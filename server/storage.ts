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
      ...insertAnalysis, 
      id,
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
