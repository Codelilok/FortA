import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, testimonialsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/testimonials", async (_req, res): Promise<void> => {
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .orderBy(testimonialsTable.sortOrder, testimonialsTable.createdAt);
  res.json(testimonials);
});

router.post("/testimonials", async (req, res): Promise<void> => {
  const { quote, authorName, authorRole, avatarUrl, active, sortOrder } = req.body;
  if (!quote || !authorName) {
    res.status(400).json({ error: "quote and authorName are required" });
    return;
  }
  const [item] = await db
    .insert(testimonialsTable)
    .values({ quote, authorName, authorRole: authorRole || "", avatarUrl, active: active ?? true, sortOrder: sortOrder ?? 0 })
    .returning();
  res.status(201).json(item);
});

router.patch("/testimonials/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { quote, authorName, authorRole, avatarUrl, active, sortOrder } = req.body;
  const [item] = await db
    .update(testimonialsTable)
    .set({ quote, authorName, authorRole, avatarUrl, active, sortOrder, updatedAt: new Date() })
    .where(eq(testimonialsTable.id, id))
    .returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

router.delete("/testimonials/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const [item] = await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id)).returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
