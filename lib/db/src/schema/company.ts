import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
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
  heroTitle: text("hero_title").default("Building Visions, Crafting Excellence"),
  heroSubtitle: text("hero_subtitle").default("Professional architecture and construction services tailored to your unique needs. We transform concepts into iconic structures."),
  ctaTitle: text("cta_title").default("Ready to Start Your Next Project?"),
  ctaSubtitle: text("cta_subtitle").default("Join hundreds of satisfied clients and let us build your future together."),
  workingHours: text("working_hours").default("Mon - Fri: 9:00 AM - 6:00 PM\nSat - Sun: Closed"),
  projectsCompleted: integer("projects_completed").default(120),
  yearsOfExperience: integer("years_of_experience").default(15),
  teamMembersCount: integer("team_members_count").default(25),
  awardsWon: integer("awards_won").default(12),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCompanyInfoSchema = createInsertSchema(companyInfoTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCompanyInfo = z.infer<typeof insertCompanyInfoSchema>;
export type CompanyInfo = typeof companyInfoTable.$inferSelect;
