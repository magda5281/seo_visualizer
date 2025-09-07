import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSeoAnalysisSchema, urlInputSchema, type SeoAnalysisResult, type SeoCheckResult } from "@shared/schema";
import { z } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze SEO for a given URL
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = urlInputSchema.parse(req.body);
      
      // Fetch the HTML content
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const html = response.data;
      const $ = cheerio.load(html);
      
      // Extract meta tags
      const title = $('title').text() || null;
      const metaDescription = $('meta[name="description"]').attr('content') || null;
      
      // Extract Open Graph tags
      const ogTags: Record<string, string> = {};
      $('meta[property^="og:"]').each((_, element) => {
        const property = $(element).attr('property');
        const content = $(element).attr('content');
        if (property && content) {
          ogTags[property] = content;
        }
      });
      
      // Extract Twitter Card tags
      const twitterTags: Record<string, string> = {};
      $('meta[name^="twitter:"]').each((_, element) => {
        const name = $(element).attr('name');
        const content = $(element).attr('content');
        if (name && content) {
          twitterTags[name] = content;
        }
      });

      // Extract all meta tags
      const allMetaTags: Record<string, string> = {};
      
      // Get title
      if (title) {
        allMetaTags['title'] = title;
      }
      
      // Get all meta tags with name attribute
      $('meta[name]').each((_, element) => {
        const name = $(element).attr('name');
        const content = $(element).attr('content');
        if (name && content) {
          allMetaTags[name] = content;
        }
      });
      
      // Get all meta tags with property attribute (includes og: tags)
      $('meta[property]').each((_, element) => {
        const property = $(element).attr('property');
        const content = $(element).attr('content');
        if (property && content) {
          allMetaTags[property] = content;
        }
      });
      
      // Get all meta tags with http-equiv attribute
      $('meta[http-equiv]').each((_, element) => {
        const httpEquiv = $(element).attr('http-equiv');
        const content = $(element).attr('content');
        if (httpEquiv && content) {
          allMetaTags[`http-equiv:${httpEquiv}`] = content;
        }
      });
      
      // Get charset
      const charset = $('meta[charset]').attr('charset');
      if (charset) {
        allMetaTags['charset'] = charset;
      }
      
      // Get viewport
      const viewport = $('meta[name="viewport"]').attr('content');
      if (viewport) {
        allMetaTags['viewport'] = viewport;
      }
      
      // Get canonical link
      const canonical = $('link[rel="canonical"]').attr('href');
      if (canonical) {
        allMetaTags['canonical'] = canonical;
      }
      
      // Get theme-color
      const themeColor = $('meta[name="theme-color"]').attr('content');
      if (themeColor) {
        allMetaTags['theme-color'] = themeColor;
      }

      // Debug: Log allMetaTags
      console.log('allMetaTags extracted:', Object.keys(allMetaTags).length, 'tags');
      console.log('Sample allMetaTags:', Object.entries(allMetaTags).slice(0, 3));

      // Perform SEO analysis
      const analysisResult = await performSeoAnalysis({
        url,
        title,
        metaDescription,
        ogTags,
        twitterTags,
        allMetaTags
      });

      // Store the analysis
      const storedAnalysis = await storage.createSeoAnalysis({
        url,
        title,
        metaDescription,
        ogTags,
        twitterTags,
        allMetaTags,
        score: analysisResult.score,
        recommendations: analysisResult.recommendations
      });

      res.json(analysisResult);
    } catch (error) {
      console.error('SEO analysis error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid URL format", errors: error.errors });
      } else if (axios.isAxiosError(error)) {
        res.status(400).json({ message: "Failed to fetch website content. Please check the URL and try again." });
      } else {
        res.status(500).json({ message: "Failed to analyze website" });
      }
    }
  });

  // Get analysis history
  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getAllSeoAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error('Get analyses error:', error);
      res.status(500).json({ message: "Failed to fetch analysis history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function performSeoAnalysis(data: {
  url: string;
  title: string | null;
  metaDescription: string | null;
  ogTags: Record<string, string>;
  twitterTags: Record<string, string>;
  allMetaTags: Record<string, string>;
}): Promise<SeoAnalysisResult> {
  
  const checks: SeoAnalysisResult['checks'] = {
    title: [],
    metaDescription: [],
    openGraph: [],
    twitterCards: []
  };

  let score = 0;
  const recommendations: string[] = [];

  // Title checks
  if (data.title) {
    const titleLength = data.title.length;
    if (titleLength >= 30 && titleLength <= 60) {
      checks.title.push({
        name: "Title length",
        status: "pass",
        message: "Title length is optimal",
        value: data.title,
        characterCount: titleLength
      });
      score += 15;
    } else if (titleLength > 0 && titleLength < 30) {
      checks.title.push({
        name: "Title length",
        status: "warning",
        message: "Title is too short",
        value: data.title,
        characterCount: titleLength,
        recommendation: "Extend your title to 30-60 characters for better SEO"
      });
      score += 10;
      recommendations.push("Extend your title to 30-60 characters for better SEO performance");
    } else if (titleLength > 60) {
      checks.title.push({
        name: "Title length",
        status: "warning",
        message: "Title is too long",
        value: data.title,
        characterCount: titleLength,
        recommendation: "Shorten your title to under 60 characters"
      });
      score += 10;
      recommendations.push("Shorten your title to under 60 characters to prevent truncation in search results");
    }

    checks.title.push({
      name: "Title presence",
      status: "pass",
      message: "Title tag is present",
      value: data.title
    });
    score += 10;
  } else {
    checks.title.push({
      name: "Title presence",
      status: "fail",
      message: "Title tag is missing",
      recommendation: "Add a descriptive title tag to your page"
    });
    recommendations.push("Add a descriptive title tag (30-60 characters) that includes your target keywords");
  }

  // Meta description checks
  if (data.metaDescription) {
    const descLength = data.metaDescription.length;
    if (descLength >= 150 && descLength <= 160) {
      checks.metaDescription.push({
        name: "Meta description length",
        status: "pass",
        message: "Meta description length is optimal",
        value: data.metaDescription,
        characterCount: descLength
      });
      score += 15;
    } else if (descLength > 0 && descLength < 150) {
      checks.metaDescription.push({
        name: "Meta description length",
        status: "warning",
        message: "Meta description is too short",
        value: data.metaDescription,
        characterCount: descLength,
        recommendation: "Extend to 150-160 characters for better click-through rates"
      });
      score += 10;
      recommendations.push("Extend your meta description to 150-160 characters to provide more context and improve click-through rates");
    } else if (descLength > 160) {
      checks.metaDescription.push({
        name: "Meta description length",
        status: "warning",
        message: "Meta description is too long",
        value: data.metaDescription,
        characterCount: descLength,
        recommendation: "Shorten to under 160 characters"
      });
      score += 10;
      recommendations.push("Shorten your meta description to under 160 characters to prevent truncation in search results");
    }

    checks.metaDescription.push({
      name: "Meta description presence",
      status: "pass",
      message: "Meta description is present",
      value: data.metaDescription
    });
    score += 10;
  } else {
    checks.metaDescription.push({
      name: "Meta description presence",
      status: "fail",
      message: "Meta description is missing",
      recommendation: "Add a compelling meta description (150-160 characters)"
    });
    recommendations.push("Add a compelling meta description (150-160 characters) that summarizes your page content");
  }

  // Open Graph checks
  const requiredOgTags = ['og:title', 'og:description', 'og:image', 'og:url'];
  let ogScore = 0;
  
  requiredOgTags.forEach(tag => {
    if (data.ogTags[tag]) {
      checks.openGraph.push({
        name: tag,
        status: "pass",
        message: `${tag} is present`,
        value: data.ogTags[tag]
      });
      ogScore += 5;
    } else {
      checks.openGraph.push({
        name: tag,
        status: "fail",
        message: `${tag} is missing`,
        recommendation: `Add ${tag} meta tag for better social media sharing`
      });
    }
  });

  score += ogScore;
  if (ogScore < 20) {
    recommendations.push("Add missing Open Graph tags for better social media sharing appearance");
  }

  // Twitter Card checks
  const requiredTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description'];
  let twitterScore = 0;
  
  requiredTwitterTags.forEach(tag => {
    if (data.twitterTags[tag]) {
      checks.twitterCards.push({
        name: tag,
        status: "pass",
        message: `${tag} is present`,
        value: data.twitterTags[tag]
      });
      twitterScore += 5;
    } else {
      checks.twitterCards.push({
        name: tag,
        status: "fail",
        message: `${tag} is missing`,
        recommendation: `Add ${tag} meta tag for Twitter sharing`
      });
    }
  });

  score += twitterScore;
  if (twitterScore === 0) {
    recommendations.push("Add Twitter Card meta tags to improve how your content appears when shared on Twitter");
  }

  // Additional recommendations
  if (score >= 80) {
    recommendations.push("Consider adding Schema markup to help search engines better understand your content");
  }

  return {
    url: data.url,
    title: data.title,
    metaDescription: data.metaDescription,
    ogTags: data.ogTags,
    twitterTags: data.twitterTags,
    allMetaTags: data.allMetaTags,
    score: Math.min(score, 100),
    checks,
    recommendations
  };
}
