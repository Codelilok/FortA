import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const companyInfoTable = pgTable("company_info", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull().default("Forth Architecture Consulting & Construction Ltd"),
  slogan: text("slogan"),
  about: text("about"),
  mission: text("mission"),
  vision: text("vision"),
  values: text("values"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  whatsapp: text("whatsapp"),
  logoUrl: text("logo_url"),
  mapEmbedUrl: text("map_embed_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCompanyInfoSchema = createInsertSchema(companyInfoTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCompanyInfo = z.infer<typeof insertCompanyInfoSchema>;
export type CompanyInfo = typeof companyInfoTable.$inferSelect;
