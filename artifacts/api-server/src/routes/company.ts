import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, companyInfoTable } from "@workspace/db";
import { UpdateCompanyInfoBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/company", async (_req, res): Promise<void> => {
  const [info] = await db.select().from(companyInfoTable).limit(1);
  if (!info) {
    // Return defaults
    const [created] = await db
      .insert(companyInfoTable)
      .values({
        companyName: "Forth Architecture Consulting & Construction Ltd",
        slogan: "Building Visions, Crafting Excellence",
        about: "Forth Architecture Consulting & Construction Ltd is a premier architecture and construction firm dedicated to delivering exceptional design solutions.",
        mission: "To deliver innovative, sustainable architectural solutions that exceed client expectations.",
        vision: "To be the leading architecture and construction firm recognized for excellence and innovation.",
        values: "Integrity, Innovation, Excellence, Collaboration, Sustainability",
        phone: "+233 XX XXX XXXX",
        email: "info@fortharchitecture.com",
        address: "Accra, Ghana",
        whatsapp: "+233 XX XXX XXXX",
      })
      .returning();
    res.json(created);
    return;
  }
  res.json(info);
});

router.patch("/company", async (req, res): Promise<void> => {
  const parsed = UpdateCompanyInfoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(companyInfoTable).limit(1);
  if (!existing) {
    const [created] = await db
      .insert(companyInfoTable)
      .values({ companyName: "Forth Architecture Consulting & Construction Ltd", ...parsed.data })
      .returning();
    res.json(created);
    return;
  }

  const [updated] = await db
    .update(companyInfoTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(companyInfoTable.id, existing.id))
    .returning();
  res.json(updated);
});

export default router;
