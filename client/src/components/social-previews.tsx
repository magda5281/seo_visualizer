import { type SeoAnalysisResult, type SeoCheckResult } from "@shared/schema";
import { useState } from "react";
import Recommendations from "./recommendations";

interface SocialPreviewsProps {
  result: SeoAnalysisResult;
}

export default function SocialPreviews({ result }: SocialPreviewsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const getStatusIcon = (status: SeoCheckResult['status']) => {
    switch (status) {
      case "pass":
        return <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center"><svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div>;
      case "warning":
        return <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center"><svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg></div>;
      case "fail":
        return <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center"><svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg></div>;
    }
  };

  const getStatusBadge = (status: SeoCheckResult['status']) => {
    switch (status) {
      case "pass":
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md">Passed</span>;
      case "warning":
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md">Warning</span>;
      case "fail":
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-md">Failed</span>;
    }
  };

  const getOverallStatus = (checks: SeoCheckResult[]): SeoCheckResult['status'] => {
    if (checks.some(check => check.status === "fail")) return "fail";
    if (checks.some(check => check.status === "warning")) return "warning";
    return "pass";
  };

  const getMainCheckMessage = (checks: SeoCheckResult[], categoryName: string) => {
    const failedChecks = checks.filter(check => check.status === "fail");
    const warningChecks = checks.filter(check => check.status === "warning");
    const passedChecks = checks.filter(check => check.status === "pass");

    if (failedChecks.length > 0) {
      return failedChecks[0].message;
    } else if (warningChecks.length > 0) {
      return warningChecks[0].message;
    } else if (passedChecks.length > 0) {
      return passedChecks[0].message;
    }
    return `${categoryName} analysis completed`;
  };
  const getDisplayUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.toUpperCase();
    } catch {
      return url.toUpperCase();
    }
  };

  const ogTitle = result.ogTags['og:title'] || result.title || "No title available";
  const ogDescription = result.ogTags['og:description'] || result.metaDescription || "No description available";
  const ogImage = result.ogTags['og:image'] || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";

  const twitterTitle = result.twitterTags['twitter:title'] || ogTitle;
  const twitterDescription = result.twitterTags['twitter:description'] || ogDescription;
  const twitterImage = result.twitterTags['twitter:image'] || ogImage;

  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground mb-6">Social Media Previews</h3>
      
      <div className="space-y-8">
        {/* Facebook Preview */}
        <div>
          <h4 className="text-lg font-medium text-foreground mb-4 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook Preview
          </h4>
          <div className="max-w-lg border border-border rounded-lg overflow-hidden bg-white" data-testid="preview-facebook">
            <img 
              src={ogImage} 
              alt="Facebook preview" 
              className="w-full h-48 object-cover" 
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
              }}
            />
            <div className="p-4">
              <div className="text-xs text-gray-500 uppercase mb-1" data-testid="text-facebook-domain">
                {getDisplayUrl(result.url)}
              </div>
              <h5 className="font-semibold text-gray-900 mb-1" data-testid="text-facebook-title">
                {ogTitle}
              </h5>
              <p className="text-sm text-gray-600" data-testid="text-facebook-description">
                {ogDescription}
              </p>
            </div>
          </div>
          
          {/* Facebook/Open Graph Tags */}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h5 className="text-sm font-semibold text-foreground mb-3">Open Graph Tags</h5>
            <div className="space-y-2 text-sm">
              {Object.entries(result.ogTags).length > 0 ? (
                Object.entries(result.ogTags).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start">
                    <span className="text-muted-foreground font-mono text-xs">{key}:</span>
                    <span className="text-foreground text-right flex-1 ml-2 break-words">{value}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-xs">No Open Graph tags found</p>
              )}
            </div>
          </div>
        </div>

        {/* Twitter Preview */}
        <div>
          <h4 className="text-lg font-medium text-foreground mb-4 flex items-center">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter Preview
          </h4>
          <div className="max-w-lg border border-border rounded-xl overflow-hidden bg-white" data-testid="preview-twitter">
            <img 
              src={twitterImage} 
              alt="Twitter preview" 
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400";
              }}
            />
            <div className="p-4">
              <h5 className="font-semibold text-gray-900 mb-1" data-testid="text-twitter-title">
                {twitterTitle}
              </h5>
              <p className="text-sm text-gray-600 mb-2" data-testid="text-twitter-description">
                {twitterDescription}
              </p>
              <div className="text-xs text-gray-500" data-testid="text-twitter-domain">
                🔗 {getDisplayUrl(result.url).toLowerCase()}
              </div>
            </div>
          </div>
          
          {/* Twitter Card Tags */}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h5 className="text-sm font-semibold text-foreground mb-3">Twitter Card Tags</h5>
            <div className="space-y-2 text-sm">
              {Object.entries(result.twitterTags).length > 0 ? (
                Object.entries(result.twitterTags).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start">
                    <span className="text-muted-foreground font-mono text-xs">{key}:</span>
                    <span className="text-foreground text-right flex-1 ml-2 break-words">{value}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-xs">No Twitter Card tags found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Optimization Checks */}
      <div className="mt-8 space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Social Media Optimization Checks</h3>
        
        {/* Open Graph Tags Analysis */}
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              {getStatusIcon(getOverallStatus(result.checks.openGraph))}
              <h4 className="text-lg font-semibold text-foreground">Open Graph Tags</h4>
            </div>
            {getStatusBadge(getOverallStatus(result.checks.openGraph))}
          </div>
          
          <div className="text-sm text-muted-foreground mb-3">
            {getMainCheckMessage(result.checks.openGraph, "Open Graph Tags")}
          </div>
          
          <button
            onClick={() => toggleSection('social-og')}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            {expandedSections['social-og'] ? 'Hide details' : 'Show details'}
          </button>

          {expandedSections['social-og'] && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="space-y-3">
                {result.checks.openGraph.map((check, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="text-sm text-foreground">{check.message}</div>
                      {check.recommendation && (
                        <div className="text-xs text-muted-foreground mt-1">{check.recommendation}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Twitter Cards Analysis */}
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              {getStatusIcon(getOverallStatus(result.checks.twitterCards))}
              <h4 className="text-lg font-semibold text-foreground">Twitter Cards</h4>
            </div>
            {getStatusBadge(getOverallStatus(result.checks.twitterCards))}
          </div>
          
          <div className="text-sm text-muted-foreground mb-3">
            {getMainCheckMessage(result.checks.twitterCards, "Twitter Cards")}
          </div>
          
          <button
            onClick={() => toggleSection('social-twitter')}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            {expandedSections['social-twitter'] ? 'Hide details' : 'Show details'}
          </button>

          {expandedSections['social-twitter'] && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="space-y-3">
                {result.checks.twitterCards.map((check, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="text-sm text-foreground">{check.message}</div>
                      {check.recommendation && (
                        <div className="text-xs text-muted-foreground mt-1">{check.recommendation}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Recommendations */}
      <div className="mt-8">
        <Recommendations result={result} />
      </div>
    </div>
  );
}
