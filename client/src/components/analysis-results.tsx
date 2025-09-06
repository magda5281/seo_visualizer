import { useState } from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type SeoAnalysisResult, type SeoCheckResult } from "@shared/schema";
import GooglePreview from "./google-preview";
import SocialPreviews from "./social-previews";
import Recommendations from "./recommendations";

interface AnalysisResultsProps {
  result: SeoAnalysisResult;
}

type TabType = "google" | "social";

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("google");

  const getStatusIcon = (status: SeoCheckResult['status']) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: SeoCheckResult['status']) => {
    switch (status) {
      case "pass":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Optimized</Badge>;
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Needs Improvement</Badge>;
      case "fail":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Missing</Badge>;
    }
  };

  const getOverallStatus = (checks: SeoCheckResult[]) => {
    const passCount = checks.filter(check => check.status === "pass").length;
    const totalCount = checks.length;
    
    if (passCount === totalCount) return "pass";
    if (passCount === 0) return "fail";
    return "warning";
  };

  const getCategoryStats = (checks: SeoCheckResult[]) => {
    const passCount = checks.filter(check => check.status === "pass").length;
    return `${passCount}/${checks.length} checks passed`;
  };

  // Calculate overall check statistics
  const getAllCheckStats = () => {
    const allChecks = [
      ...result.checks.title,
      ...result.checks.metaDescription,
      ...result.checks.openGraph,
      ...result.checks.twitterCards,
    ];
    
    return {
      passed: allChecks.filter(check => check.status === "pass").length,
      warnings: allChecks.filter(check => check.status === "warning").length,
      failed: allChecks.filter(check => check.status === "fail").length,
      total: allChecks.length,
    };
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    if (score >= 50) return "Poor";
    return "Very Poor";
  };

  const stats = getAllCheckStats();

  return (
    <div className="space-y-8">
      {/* SEO Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Circular Progress and Score */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-muted-foreground/20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke={result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${(result.score / 100) * 339.29} 339.29`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground" data-testid="text-seo-score">
                      {result.score}
                    </div>
                    <div className="text-sm text-muted-foreground">/100</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Overall SEO Score</div>
                <div className="text-xl font-semibold text-foreground">{getScoreDescription(result.score)}</div>
              </div>
            </div>

            {/* SEO Summary Title */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-6">SEO Summary</h3>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Passed Checks */}
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">Passed Checks</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100" data-testid="text-passed-checks">
                    {stats.passed}
                  </div>
                </div>

                {/* Warnings */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Warnings</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100" data-testid="text-warnings">
                    {stats.warnings}
                  </div>
                </div>

                {/* Failed Checks */}
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">Failed Checks</span>
                  </div>
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100" data-testid="text-failed-checks">
                    {stats.failed}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Title Tags</span>
                  {getStatusIcon(getOverallStatus(result.checks.title))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getCategoryStats(result.checks.title)}
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Meta Description</span>
                  {getStatusIcon(getOverallStatus(result.checks.metaDescription))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getCategoryStats(result.checks.metaDescription)}
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Open Graph</span>
                  {getStatusIcon(getOverallStatus(result.checks.openGraph))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getCategoryStats(result.checks.openGraph)}
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Twitter Cards</span>
                  {getStatusIcon(getOverallStatus(result.checks.twitterCards))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getCategoryStats(result.checks.twitterCards)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <Button
              variant="ghost"
              className={`border-b-2 ${
                activeTab === "google" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              } py-4 px-1 text-sm font-medium rounded-none`}
              onClick={() => setActiveTab("google")}
              data-testid="tab-google"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Preview
            </Button>
            <Button
              variant="ghost"
              className={`border-b-2 ${
                activeTab === "social" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              } py-4 px-1 text-sm font-medium rounded-none`}
              onClick={() => setActiveTab("social")}
              data-testid="tab-social"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 011-1h3V3h-3a5 5 0 00-5 5v2H7z"/>
              </svg>
              Social Media Previews
            </Button>
          </nav>
        </div>

        <CardContent className="p-6">
          {activeTab === "google" && (
            <div className="space-y-8">
              {/* Google Preview */}
              <GooglePreview result={result} />
              
              {/* Search Engine Optimization Checks */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Search Engine Optimization Checks</h3>
                
                {/* Title Tag Analysis */}
                <div className="border border-border rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(getOverallStatus(result.checks.title))}
                      <h4 className="text-lg font-semibold text-foreground">Title Tag</h4>
                    </div>
                    {getStatusBadge(getOverallStatus(result.checks.title))}
                  </div>
                  
                  {result.title && (
                    <div className="bg-muted rounded-lg p-4 mb-4">
                      <div className="text-sm text-muted-foreground mb-1">Current Title</div>
                      <div className="font-medium text-foreground" data-testid="text-current-title">
                        {result.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Length: {result.title.length} characters
                      </div>
                    </div>
                  )}

                  {result.checks.title.map((check, index) => (
                    <div key={index} className="flex items-start space-x-3 mb-3 last:mb-0">
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

                {/* Meta Description Analysis */}
                <div className="border border-border rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(getOverallStatus(result.checks.metaDescription))}
                      <h4 className="text-lg font-semibold text-foreground">Meta Description</h4>
                    </div>
                    {getStatusBadge(getOverallStatus(result.checks.metaDescription))}
                  </div>
                  
                  {result.metaDescription && (
                    <div className="bg-muted rounded-lg p-4 mb-4">
                      <div className="text-sm text-muted-foreground mb-1">Current Description</div>
                      <div className="font-medium text-foreground" data-testid="text-current-description">
                        {result.metaDescription}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Length: {result.metaDescription.length} characters
                      </div>
                    </div>
                  )}

                  {result.checks.metaDescription.map((check, index) => (
                    <div key={index} className="flex items-start space-x-3 mb-3 last:mb-0">
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

                {/* Open Graph Tags */}
                <div className="border border-border rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(getOverallStatus(result.checks.openGraph))}
                      <h4 className="text-lg font-semibold text-foreground">Open Graph Tags</h4>
                    </div>
                    {getStatusBadge(getOverallStatus(result.checks.openGraph))}
                  </div>
                  
                  {result.checks.openGraph.map((check, index) => (
                    <div key={index} className="flex items-start space-x-3 mb-3 last:mb-0">
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

                {/* Twitter Cards */}
                <div className="border border-border rounded-lg p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(getOverallStatus(result.checks.twitterCards))}
                      <h4 className="text-lg font-semibold text-foreground">Twitter Cards</h4>
                    </div>
                    {getStatusBadge(getOverallStatus(result.checks.twitterCards))}
                  </div>
                  
                  {result.checks.twitterCards.map((check, index) => (
                    <div key={index} className="flex items-start space-x-3 mb-3 last:mb-0">
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

              {/* SEO Recommendations */}
              <Recommendations result={result} />
            </div>
          )}

          {activeTab === "social" && <SocialPreviews result={result} />}
        </CardContent>
      </Card>
    </div>
  );
}
