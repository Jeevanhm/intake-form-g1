
# Weekly Intake Form

## Project info

## About this project

This is a digital weekly intake form for IT infrastructure requests. This form is used for capturing:
- Application details
- Support needs
- Exceptions
- Location information
- Database platforms
- Server counts
- Environment requirements
- Storage needs

The form is designed to be user-friendly with Yes/No toggles, text fields, and text areas for capturing detailed information.

## Development

The only requirement is having Node.js and npm installed.

Follow these steps:

```powershell
npm install
npm run dev
```

The development command starts both the Vite app and its local API. Add multiple applications to the same weekly review with **Add another application**, then submit them together. Each application is stored as a separate SQLite record with the shared review date and its own optional PDF attachment (up to 10 MB). You can submit up to 20 applications at once. The SQLite file is created automatically at `server/data/intake.sqlite` and is excluded from Git.

For a production-style local run, build the app and start the API server:

```powershell
npm run build
npm start
```

The server listens on `127.0.0.1:3001` by default. Set `API_PORT` to change the port and `API_HOST` to change the listen address. For example, `API_HOST=0.0.0.0 API_PORT=8444 npm start` makes it reachable on port 8444 via the server's network interfaces. This direct setup uses HTTP, not HTTPS; do not expose it to untrusted networks. For multi-user or external access, put it behind an HTTPS reverse proxy and configure appropriate access controls.

## Deploying on RHEL 8

The deployment script installs its RHEL packages, enables the RHEL 8 Node.js 20 module if needed, installs Python 3.11 (or Python 3.9) for compiling the native SQLite dependency, clones the repository to `/opt/intake-form` (or fast-forward pulls it if it is already cloned), and builds the app. Run it as root:

```bash
sudo bash deploy.sh
```

The script builds the app, configures the Node service to listen locally on `127.0.0.1:3001`, and configures Nginx to serve it at `https://10.113.130.18:8444/weeklyintake` with a self-signed TLS certificate. Browsers will warn until the certificate is trusted. SQLite and CSV exports are stored under `/var/lib/intake-form`. If it creates an admin password, it prints it once; save it securely. Permit inbound TCP port 8444 only from approved internal client networks.

## Technologies used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Hook Form for form state management
- date-fns for date formatting
