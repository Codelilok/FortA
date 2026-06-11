import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, galleryTable } from "@workspace/db";
import {
  ListGalleryQueryParams,
  CreateGalleryItemBody,
  GetGalleryItemParams,
  UpdateGalleryItemParams,
  UpdateGalleryItemBody,
  DeleteGalleryItemParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/gallery", async (req, res): Promise<void> => {
  const parsed = ListGalleryQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category } = parsed.data;
  const items = category
    ? await db.select().from(galleryTable).where(eq(galleryTable.category, category)).orderBy(galleryTable.sortOrder)
    : await db.select().from(galleryTable).orderBy(galleryTable.sortOrder);
  res.json(items);
});

router.post("/gallery", async (req, res): Promise<void> => {
  const parsed = CreateGalleryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(galleryTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.get("/gallery/:id", async (req, res): Promise<void> => {
  const params = GetGalleryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(galleryTable).where(eq(galleryTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "Gallery item not found" });
    return;
  }
  res.json(item);
});

router.patch("/gallery/:id", async (req, res): Promise<void> => {
  const params = UpdateGalleryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateGalleryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db
    .update(galleryTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(galleryTable.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Gallery item not found" });
    return;
  }
  res.json(item);
});

router.delete("/gallery/:id", async (req, res): Promise<void> => {
  const params = DeleteGalleryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.delete(galleryTable).where(eq(galleryTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Gallery item not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
