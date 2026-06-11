import { Router, type IRouter } from "express";
import { count, eq } from "drizzle-orm";
import { db, projectsTable, teamMembersTable, galleryTable, servicesTable, contactMessagesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [[{ projectCount }], [{ teamCount }], [{ galleryCount }], [{ serviceCount }], [{ unreadMessages }], [{ featuredProjects }]] =
    await Promise.all([
      db.select({ projectCount: count() }).from(projectsTable),
      db.select({ teamCount: count() }).from(teamMembersTable),
      db.select({ galleryCount: count() }).from(galleryTable),
      db.select({ serviceCount: count() }).from(servicesTable),
      db.select({ unreadMessages: count() }).from(contactMessagesTable).where(eq(contactMessagesTable.isRead, false)),
      db.select({ featuredProjects: count() }).from(projectsTable).where(eq(projectsTable.featured, true)),
    ]);

  // Projects by category
  const projectsByCategory = await db
    .select({ category: projectsTable.category, count: count() })
    .from(projectsTable)
    .groupBy(projectsTable.category);

  // Gallery by category
  const galleryByCategory = await db
    .select({ category: galleryTable.category, count: count() })
    .from(galleryTable)
    .groupBy(galleryTable.category);

  res.json({
    projectCount: Number(projectCount),
    teamCount: Number(teamCount),
    galleryCount: Number(galleryCount),
    serviceCount: Number(serviceCount),
    unreadMessages: Number(unreadMessages),
    featuredProjects: Number(featuredProjects),
    projectsByCategory: projectsByCategory.map(r => ({ category: r.category, count: Number(r.count) })),
    galleryByCategory: galleryByCategory.map(r => ({ category: r.category, count: Number(r.count) })),
  });
});

export default router;
