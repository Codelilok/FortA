import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, contactMessagesTable } from "@workspace/db";
import {
  SubmitContactBody,
  ListContactMessagesQueryParams,
  MarkMessageReadParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [message] = await db.insert(contactMessagesTable).values(parsed.data).returning();
  res.status(201).json(message);
});

router.get("/contact/messages", async (req, res): Promise<void> => {
  const parsed = ListContactMessagesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { read } = parsed.data;
  const messages = read !== undefined
    ? await db.select().from(contactMessagesTable).where(eq(contactMessagesTable.isRead, read)).orderBy(contactMessagesTable.createdAt)
    : await db.select().from(contactMessagesTable).orderBy(contactMessagesTable.createdAt);
  res.json(messages);
});

router.patch("/contact/messages/:id/read", async (req, res): Promise<void> => {
  const params = MarkMessageReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [message] = await db
    .update(contactMessagesTable)
    .set({ isRead: true })
    .where(eq(contactMessagesTable.id, params.data.id))
    .returning();
  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.json(message);
});

router.delete("/contact/messages/:id", async (req, res): Promise<void> => {
  const params = MarkMessageReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [message] = await db
    .delete(contactMessagesTable)
    .where(eq(contactMessagesTable.id, params.data.id))
    .returning();
  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
