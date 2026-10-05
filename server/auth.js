import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_LIFETIME_MS = 8 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;

const sign = (secret, payload) => createHmac("sha256", secret).update(payload).digest("base64url");

const safeEqual = (a, b) => {
  const left = createHmac("sha256", "compare").update(String(a)).digest();
  const right = createHmac("sha256", "compare").update(String(b)).digest();
  return timingSafeEqual(left, right);
};

// Stateless admin sessions: the token is an expiry timestamp signed with a key derived from the
// admin password, so changing the password signs everyone out. With no password configured,
// admin access is disabled entirely.
export const createAdminAuth = (password) => {
  const secret = password ? createHmac("sha256", "intake-admin").update(password).digest() : null;
  let failures = 0;
  let lockedUntil = 0;

  const issueToken = () => {
    const payload = String(Date.now() + TOKEN_LIFETIME_MS);
    return `${payload}.${sign(secret, payload)}`;
  };

  const isValidToken = (token) => {
    if (!secret || typeof token !== "string") return false;
    const [payload, signature, ...rest] = token.split(".");
    if (!payload || !signature || rest.length > 0) return false;
    const expected = sign(secret, payload);
    if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return false;
    }
    return Number(payload) > Date.now();
  };

  const tokenFrom = (request) => {
    const header = request.get("authorization") ?? "";
    return header.startsWith("Bearer ") ? header.slice(7) : "";
  };

  const login = (request, response) => {
    if (!secret) {
      response.status(503).json({ error: "Admin access is not configured on the server." });
      return;
    }
    if (Date.now() < lockedUntil) {
      response.status(429).json({ error: "Too many failed attempts. Try again in a minute." });
      return;
    }

    const submitted = request.body?.password;
    if (typeof submitted !== "string" || !safeEqual(submitted, password)) {
      failures += 1;
      if (failures >= MAX_FAILED_ATTEMPTS) {
        failures = 0;
        lockedUntil = Date.now() + LOCKOUT_MS;
      }
      response.status(401).json({ error: "Incorrect admin password." });
      return;
    }

    failures = 0;
    response.json({ token: issueToken() });
  };

  const requireAdmin = (request, response, next) => {
    if (!isValidToken(tokenFrom(request))) {
      response.status(401).json({ error: "Admin sign-in required." });
      return;
    }
    next();
  };

  const status = (request, response) => {
    response.json({ admin: isValidToken(tokenFrom(request)) });
  };

  return { login, requireAdmin, status };
};
