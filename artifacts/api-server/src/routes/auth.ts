import { Router, type Request } from "express";
import bcrypt from "bcryptjs";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 10;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getLoginClientKey(req: Request): string {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function isLoginRateLimited(key: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(key);

  if (!attempt || attempt.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return false;
  }

  attempt.count += 1;
  return attempt.count > MAX_LOGIN_ATTEMPTS;
}

function clearLoginAttempts(key: string): void {
  loginAttempts.delete(key);
}

router.post("/auth/login", async (req, res) => {
  const clientKey = getLoginClientKey(req);
  if (isLoginRateLimited(clientKey)) {
    res.setHeader("Retry-After", String(Math.ceil(LOGIN_WINDOW_MS / 1000)));
    res.status(429).json({ error: "Too many login attempts. Try again later." });
    return;
  }

  const { username, password } = req.body ?? {};
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.username, username)).limit(1);
  if (!admin) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  clearLoginAttempts(clientKey);
  req.session.adminId = admin.id;
  req.session.adminUsername = admin.username;
  req.session.save((err) => {
    if (err) {
      const sessionError = err as Error & { code?: string };
      req.log.error(
        { error: sessionError.message, code: sessionError.code },
        "Failed to save admin session",
      );
      res.status(500).json({ error: "Session save failed" });
      return;
    }
    res.json({ ok: true, username: admin.username });
  });
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

router.get("/auth/me", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.session?.adminId) {
    res.json({ admin: true, username: req.session.adminUsername });
  } else {
    res.json({ admin: false });
  }
});

export default router;
