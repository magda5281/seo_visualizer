import { type SeoAnalysis, type InsertSeoAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getSeoAnalysis(id: string): Promise<SeoAnalysis | undefined>;
  getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined>;
  createSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
  getAllSeoAnalyses(): Promise<SeoAnalysis[]>;
}

export class MemStorage implements IStorage {
  private seoAnalyses: Map<string, SeoAnalysis>;

  constructor() {
    this.seoAnalyses = new Map();
  }

  async getSeoAnalysis(id: string): Promise<SeoAnalysis | undefined> {
    return this.seoAnalyses.get(id);
  }

  async getSeoAnalysisByUrl(url: string): Promise<SeoAnalysis | undefined> {
    return Array.from(this.seoAnalyses.values()).find(
      (analysis) => analysis.url === url,
    );
  }

  async createSeoAnalysis(insertAnalysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    const id = randomUUID();
    const analysis: SeoAnalysis = { 
      id,
      url: insertAnalysis.url,
      title: insertAnalysis.title ?? null,
      metaDescription: insertAnalysis.metaDescription ?? null,
      ogTags: insertAnalysis.ogTags ?? null,
      twitterTags: insertAnalysis.twitterTags ?? null,
      allMetaTags: insertAnalysis.allMetaTags ?? null,
      score: insertAnalysis.score,
      recommendations: (insertAnalysis.recommendations && Array.isArray(insertAnalysis.recommendations)) 
        ? insertAnalysis.recommendations as string[]
        : [] as string[],
      createdAt: new Date(),
    };
    this.seoAnalyses.set(id, analysis);
    return analysis;
  }

  async getAllSeoAnalyses(): Promise<SeoAnalysis[]> {
    return Array.from(this.seoAnalyses.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();
