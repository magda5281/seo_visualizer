import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const seoAnalyses = pgTable("seo_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  title: text("title"),
  metaDescription: text("meta_description"),
  ogTags: jsonb("og_tags").$type<Record<string, string>>(),
  twitterTags: jsonb("twitter_tags").$type<Record<string, string>>(),
  allMetaTags: jsonb("all_meta_tags").$type<Record<string, string>>(),
  score: integer("score").notNull(),
  recommendations: jsonb("recommendations").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSeoAnalysisSchema = createInsertSchema(seoAnalyses).omit({
  id: true,
  createdAt: true,
});

export const urlInputSchema = z.object({
  url: z.string().url("Please enter a valid URL starting with http:// or https://"),
});

export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;
export type UrlInput = z.infer<typeof urlInputSchema>;

export interface SeoCheckResult {
  name: string;
  status: "pass" | "warning" | "fail";
  message: string;
  value?: string;
  characterCount?: number;
  recommendation?: string;
}

export interface SeoAnalysisResult {
  url: string;
  title: string | null;
  metaDescription: string | null;
  ogTags: Record<string, string>;
  twitterTags: Record<string, string>;
  allMetaTags: Record<string, string>;
  score: number;
  checks: {
    title: SeoCheckResult[];
    metaDescription: SeoCheckResult[];
    openGraph: SeoCheckResult[];
    twitterCards: SeoCheckResult[];
  };
  recommendations: string[];
}
