import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/auth/login", async (req, res) => {
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

  req.session.adminId = admin.id;
  req.session.adminUsername = admin.username;
  req.session.save((err) => {
    if (err) {
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
