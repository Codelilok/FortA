import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, processStepsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/process-steps", async (_req, res): Promise<void> => {
  const steps = await db
    .select()
    .from(processStepsTable)
    .orderBy(processStepsTable.sortOrder, processStepsTable.createdAt);
  res.json(steps);
});

router.post("/process-steps", async (req, res): Promise<void> => {
  const { stepNumber, title, description, sortOrder } = req.body;
  if (!stepNumber || !title) {
    res.status(400).json({ error: "stepNumber and title are required" });
    return;
  }
  const [item] = await db
    .insert(processStepsTable)
    .values({ stepNumber, title, description: description || "", sortOrder: sortOrder ?? 0 })
    .returning();
  res.status(201).json(item);
});

router.patch("/process-steps/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const { stepNumber, title, description, sortOrder } = req.body;
  const [item] = await db
    .update(processStepsTable)
    .set({ stepNumber, title, description, sortOrder, updatedAt: new Date() })
    .where(eq(processStepsTable.id, id))
    .returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

router.delete("/process-steps/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const [item] = await db.delete(processStepsTable).where(eq(processStepsTable.id, id)).returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
