#!/usr/bin/env bash
set -Eeuo pipefail

REPO_URL="https://github.com/Jeevanhm/intake-form-g1.git"
APP_DIR="/opt/intake-form"
SERVICE_NAME="intake-form"
SERVICE_USER="intakeform"
ENV_FILE="/etc/intake-form/intake-form.env"
DATA_DIR="/var/lib/intake-form"
SERVER_IP="10.113.130.18"
APP_PATH="/weeklyintake"
NODE_PORT="3002"
HTTPS_PORT="8444"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root, for example: sudo bash deploy.sh" >&2
  exit 1
fi

for tool in dnf systemctl; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "Required command not found: $tool" >&2
    exit 1
  fi
done

dnf install -y git gcc-c++ make nginx openssl policycoreutils-python-utils gcc-toolset-12-gcc-c++

if ! command -v node >/dev/null 2>&1 || ! node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 20 ? 0 : 1)'; then
  dnf module reset -y nodejs
  dnf module enable -y nodejs:20
  dnf install -y nodejs
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found. Install it with the approved Node.js package, then rerun this script." >&2
  exit 1
fi

if ! dnf install -y python3.11 python3.11-devel; then
  echo "Python 3.11 packages are unavailable; trying the RHEL 8 Python 3.9 packages."
  dnf install -y python39 python39-devel
fi

if command -v python3.11 >/dev/null 2>&1; then
  NODE_GYP_PYTHON="$(command -v python3.11)"
elif command -v python3.9 >/dev/null 2>&1; then
  NODE_GYP_PYTHON="$(command -v python3.9)"
else
  echo "Python 3.9 or newer is required to compile better-sqlite3." >&2
  exit 1
fi

if ! "$NODE_GYP_PYTHON" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 8) else 1)'; then
  echo "node-gyp requires Python 3.8 or newer; found $("$NODE_GYP_PYTHON" --version)." >&2
  exit 1
fi

if ! id "$SERVICE_USER" >/dev/null 2>&1; then
  useradd --system --user-group --no-create-home --shell /sbin/nologin "$SERVICE_USER"
fi

if [[ -e "$APP_DIR" && ! -d "$APP_DIR/.git" ]]; then
  echo "$APP_DIR already exists but is not a Git checkout; move it aside before deploying." >&2
  exit 1
fi

if [[ -d "$APP_DIR/.git" ]]; then
  git -C "$APP_DIR" pull --ff-only
else
  install -d -o root -g root "$(dirname "$APP_DIR")"
  git clone "$REPO_URL" "$APP_DIR"
fi

if [[ ! -f "$APP_DIR/package-lock.json" || ! -f "$APP_DIR/server/index.js" ]]; then
  echo "The cloned repository is missing required application files." >&2
  exit 1
fi
if ! grep -q 'APP_BASE_PATH' "$APP_DIR/server/index.js" ||
  ! grep -q 'APP_BASE_PATH' "$APP_DIR/vite.config.ts"; then
  echo "The GitHub checkout does not include the /weeklyintake deployment changes yet." >&2
  echo "Push the updated app code to GitHub, then rerun this script." >&2
  exit 1
fi

chown -R root:root "$APP_DIR"
cd "$APP_DIR"
npm_config_python="$NODE_GYP_PYTHON" npm ci
APP_BASE_PATH="$APP_PATH" npm run build
npm prune --omit=dev

# The prebuilt better-sqlite3 binary needs a newer glibc than RHEL 8 has, and it takes
# priority over a source build, so remove it and compile with a C++20-capable GCC.
rm -f node_modules/better-sqlite3/prebuilds/*.node
(
  set +u
  # shellcheck disable=SC1091
  source /opt/rh/gcc-toolset-12/enable
  set -u
  cd node_modules/better-sqlite3
  npm_config_python="$NODE_GYP_PYTHON" npm run build-release
)
test -f node_modules/better-sqlite3/build/Release/better_sqlite3.node

# Let the service account read the app (including the compiled module).
chgrp -R "$SERVICE_USER" "$APP_DIR"
chmod -R g+rX "$APP_DIR"
if [[ -f "$APP_DIR/.env" ]]; then
  chmod 0600 "$APP_DIR/.env"
fi
sudo -u "$SERVICE_USER" "$(command -v node)" -e \
  'const D = require("/opt/intake-form/node_modules/better-sqlite3"); new D(":memory:").close()'

install -d -o "$SERVICE_USER" -g "$SERVICE_USER" "$DATA_DIR" "$DATA_DIR/csv-exports"
install -d -o root -g root -m 0750 "$(dirname "$ENV_FILE")"
touch "$ENV_FILE"
chown root:root "$ENV_FILE"
chmod 0600 "$ENV_FILE"

set_env() {
  local key="$1"
  local value="$2"
  if grep -q "^${key}=" "$ENV_FILE"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
  else
    printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
  fi
}

GENERATED_PASSWORD=""
if ! grep -q '^ADMIN_PASSWORD=.' "$ENV_FILE"; then
  GENERATED_PASSWORD="$(openssl rand -hex 32)"
  set_env "ADMIN_PASSWORD" "$GENERATED_PASSWORD"
fi

set_env "API_HOST" "127.0.0.1"
set_env "API_PORT" "$NODE_PORT"
set_env "APP_BASE_PATH" "$APP_PATH"
set_env "SQLITE_DB_PATH" "$DATA_DIR/intake.sqlite"
set_env "CSV_DIR" "$DATA_DIR/csv-exports"
chmod 0600 "$ENV_FILE"

NODE_BIN="$(command -v node)"
cat > "/etc/systemd/system/${SERVICE_NAME}.service" <<EOF
[Unit]
Description=Weekly Intake Form
After=network.target

[Service]
Type=simple
User=${SERVICE_USER}
Group=${SERVICE_USER}
WorkingDirectory=${APP_DIR}
EnvironmentFile=${ENV_FILE}
ExecStart=${NODE_BIN} server/index.js
Restart=on-failure
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=${DATA_DIR}

[Install]
WantedBy=multi-user.target
EOF

install -d -o root -g root -m 0700 /etc/nginx/ssl
if [[ ! -f /etc/nginx/ssl/intake-form.key || ! -f /etc/nginx/ssl/intake-form.crt ]]; then
  openssl req -x509 -nodes -days 825 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/intake-form.key \
    -out /etc/nginx/ssl/intake-form.crt \
    -subj "/CN=${SERVER_IP}" \
    -addext "subjectAltName=IP:${SERVER_IP}"
  chmod 0600 /etc/nginx/ssl/intake-form.key
  chmod 0644 /etc/nginx/ssl/intake-form.crt
fi

cat > /etc/nginx/conf.d/intake-form.conf <<EOF
server {
    listen ${HTTPS_PORT} ssl;
    server_name ${SERVER_IP};

    ssl_certificate     /etc/nginx/ssl/intake-form.crt;
    ssl_certificate_key /etc/nginx/ssl/intake-form.key;

    client_max_body_size 210m;

    location / {
        proxy_pass http://127.0.0.1:${NODE_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

setsebool -P httpd_can_network_connect 1
if ! semanage port -l | awk -v port="$HTTPS_PORT" '
  $1 == "http_port_t" {
    for (i = 3; i <= NF; i++) {
      count = split($i, entries, ",")
      for (j = 1; j <= count; j++) {
        bounds = split(entries[j], range, "-")
        low = range[1]
        high = bounds == 2 ? range[2] : low
        if (port >= low && port <= high) found = 1
      }
    }
  }
  END { exit !found }
'; then
  semanage port -a -t http_port_t -p tcp "$HTTPS_PORT"
fi

nginx -t
systemctl daemon-reload
systemctl enable --now "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"
systemctl enable --now nginx
systemctl restart nginx

if ! command -v curl >/dev/null 2>&1; then
  dnf install -y curl
fi
curl --fail --silent --show-error --retry 10 --retry-connrefused --retry-delay 1 \
  "http://127.0.0.1:${NODE_PORT}${APP_PATH}/api/admin/status" >/dev/null
curl --fail --silent --show-error --insecure --retry 10 --retry-connrefused --retry-delay 1 \
  "https://127.0.0.1:${HTTPS_PORT}${APP_PATH}/api/admin/status" >/dev/null

echo
echo "Deployment succeeded."
echo "Open https://${SERVER_IP}:${HTTPS_PORT}${APP_PATH}"
echo "The certificate is self-signed, so browsers will show a certificate warning until it is trusted."
echo "Allow inbound TCP ${HTTPS_PORT} only from approved client networks in the host/network firewall."
if [[ -n "$GENERATED_PASSWORD" ]]; then
  echo "Generated one-time admin password: ${GENERATED_PASSWORD}"
  echo "Save it securely; it is stored in ${ENV_FILE}."
fi
