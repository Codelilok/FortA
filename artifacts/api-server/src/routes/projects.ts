import { Router, type IRouter } from "express";
import { eq, ilike, and, count, sql } from "drizzle-orm";
import { db, projectsTable, projectImagesTable } from "@workspace/db";
import {
  ListProjectsQueryParams,
  CreateProjectBody,
  GetProjectParams,
  UpdateProjectParams,
  UpdateProjectBody,
  DeleteProjectParams,
  ListProjectImagesParams,
  AddProjectImageParams,
  AddProjectImageBody,
  DeleteProjectImageParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/projects", async (req, res): Promise<void> => {
  const parsed = ListProjectsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, search, page = 1, limit = 12, featured } = parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(projectsTable.category, category));
  if (search) conditions.push(ilike(projectsTable.title, `%${search}%`));
  if (featured !== undefined) conditions.push(eq(projectsTable.featured, featured));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(projectsTable)
    .where(where);

  const data = await db
    .select()
    .from(projectsTable)
    .where(where)
    .orderBy(projectsTable.sortOrder, projectsTable.createdAt)
    .limit(limit)
    .offset((page - 1) * limit);

  res.json({ data, total: Number(total), page, limit });
});

router.post("/projects", async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db.insert(projectsTable).values(parsed.data).returning();
  res.status(201).json(project);
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const params = GetProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, params.data.id));

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const images = await db
    .select()
    .from(projectImagesTable)
    .where(eq(projectImagesTable.projectId, params.data.id))
    .orderBy(projectImagesTable.sortOrder);

  res.json({ ...project, images });
});

router.patch("/projects/:id", async (req, res): Promise<void> => {
  const params = UpdateProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db
    .update(projectsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(projectsTable.id, params.data.id))
    .returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(project);
});

router.delete("/projects/:id", async (req, res): Promise<void> => {
  const params = DeleteProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [project] = await db
    .delete(projectsTable)
    .where(eq(projectsTable.id, params.data.id))
    .returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.sendStatus(204);
});

router.get("/projects/:id/images", async (req, res): Promise<void> => {
  const params = ListProjectImagesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const images = await db
    .select()
    .from(projectImagesTable)
    .where(eq(projectImagesTable.projectId, params.data.id))
    .orderBy(projectImagesTable.sortOrder);
  res.json(images);
});

router.post("/projects/:id/images", async (req, res): Promise<void> => {
  const params = AddProjectImageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = AddProjectImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [image] = await db
    .insert(projectImagesTable)
    .values({ ...parsed.data, projectId: params.data.id })
    .returning();
  res.status(201).json(image);
});

router.delete("/project-images/:imageId", async (req, res): Promise<void> => {
  const params = DeleteProjectImageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [image] = await db
    .delete(projectImagesTable)
    .where(eq(projectImagesTable.id, params.data.imageId))
    .returning();

  if (!image) {
    res.status(404).json({ error: "Project image not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
