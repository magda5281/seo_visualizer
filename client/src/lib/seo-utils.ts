import { type SeoAnalysisResult } from "@shared/schema";

export function calculateSeoScore(result: SeoAnalysisResult): number {
  let score = 0;
  
  // Title checks (25 points max)
  if (result.title) {
    score += 10; // Title exists
    const titleLength = result.title.length;
    if (titleLength >= 30 && titleLength <= 60) {
      score += 15; // Optimal length
    } else if (titleLength > 0) {
      score += 10; // Suboptimal length
    }
  }
  
  // Meta description checks (25 points max)
  if (result.metaDescription) {
    score += 10; // Description exists
    const descLength = result.metaDescription.length;
    if (descLength >= 150 && descLength <= 160) {
      score += 15; // Optimal length
    } else if (descLength > 0) {
      score += 10; // Suboptimal length
    }
  }
  
  // Open Graph checks (25 points max)
  const requiredOgTags = ['og:title', 'og:description', 'og:image', 'og:url'];
  const ogScore = requiredOgTags.reduce((acc, tag) => {
    return acc + (result.ogTags[tag] ? 6.25 : 0);
  }, 0);
  score += ogScore;
  
  // Twitter Cards checks (25 points max)
  const requiredTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description'];
  const twitterScore = requiredTwitterTags.reduce((acc, tag) => {
    return acc + (result.twitterTags[tag] ? 8.33 : 0);
  }, 0);
  score += twitterScore;
  
  return Math.min(Math.round(score), 100);
}

export function generateRecommendations(result: SeoAnalysisResult): string[] {
  const recommendations: string[] = [];
  
  // Title recommendations
  if (!result.title) {
    recommendations.push("Add a descriptive title tag (30-60 characters) that includes your target keywords");
  } else if (result.title.length < 30) {
    recommendations.push("Extend your title to 30-60 characters for better SEO performance");
  } else if (result.title.length > 60) {
    recommendations.push("Shorten your title to under 60 characters to prevent truncation in search results");
  }
  
  // Meta description recommendations
  if (!result.metaDescription) {
    recommendations.push("Add a compelling meta description (150-160 characters) that summarizes your page content");
  } else if (result.metaDescription.length < 150) {
    recommendations.push("Extend your meta description to 150-160 characters to provide more context and improve click-through rates");
  } else if (result.metaDescription.length > 160) {
    recommendations.push("Shorten your meta description to under 160 characters to prevent truncation in search results");
  }
  
  // Open Graph recommendations
  const missingOgTags = ['og:title', 'og:description', 'og:image', 'og:url'].filter(
    tag => !result.ogTags[tag]
  );
  if (missingOgTags.length > 0) {
    recommendations.push("Add missing Open Graph tags for better social media sharing appearance");
  }
  
  // Twitter Cards recommendations
  const missingTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description'].filter(
    tag => !result.twitterTags[tag]
  );
  if (missingTwitterTags.length > 0) {
    recommendations.push("Add Twitter Card meta tags to improve how your content appears when shared on Twitter");
  }
  
  return recommendations;
}

export function getUrlDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

export function formatCharacterCount(text: string | null, optimal: [number, number]): {
  count: number;
  status: 'optimal' | 'short' | 'long' | 'missing';
  message: string;
} {
  if (!text) {
    return {
      count: 0,
      status: 'missing',
      message: 'Missing'
    };
  }
  
  const count = text.length;
  const [min, max] = optimal;
  
  if (count >= min && count <= max) {
    return {
      count,
      status: 'optimal',
      message: `Optimal (${min}-${max} characters)`
    };
  } else if (count < min) {
    return {
      count,
      status: 'short',
      message: `Too short (recommended: ${min}-${max} characters)`
    };
  } else {
    return {
      count,
      status: 'long',
      message: `Too long (recommended: ${min}-${max} characters)`
    };
  }
}
