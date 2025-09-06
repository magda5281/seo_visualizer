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

type TabType = "analysis" | "google" | "social" | "recommendations";

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("analysis");

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

  return (
    <div className="space-y-8">
      {/* SEO Score Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">SEO Analysis Results</h3>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Overall SEO Score</div>
              <div className="text-3xl font-bold text-primary" data-testid="text-seo-score">
                {result.score}
              </div>
            </div>
          </div>
          
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
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <Button
              variant="ghost"
              className={`border-b-2 ${
                activeTab === "analysis" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              } py-4 px-1 text-sm font-medium rounded-none`}
              onClick={() => setActiveTab("analysis")}
              data-testid="tab-analysis"
            >
              SEO Analysis
            </Button>
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
              Social Previews
            </Button>
            <Button
              variant="ghost"
              className={`border-b-2 ${
                activeTab === "recommendations" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              } py-4 px-1 text-sm font-medium rounded-none`}
              onClick={() => setActiveTab("recommendations")}
              data-testid="tab-recommendations"
            >
              Recommendations
            </Button>
          </nav>
        </div>

        <CardContent className="p-6">
          {activeTab === "analysis" && (
            <div className="space-y-6">
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.checks.title.map((check, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {getStatusIcon(check.status)}
                      <span className="text-sm text-foreground">{check.message}</span>
                    </div>
                  ))}
                </div>
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.checks.metaDescription.map((check, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {getStatusIcon(check.status)}
                      <span className="text-sm text-foreground">{check.message}</span>
                    </div>
                  ))}
                </div>
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.checks.openGraph.map((check, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {getStatusIcon(check.status)}
                      <span className="text-sm text-foreground">{check.message}</span>
                    </div>
                  ))}
                </div>
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.checks.twitterCards.map((check, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {getStatusIcon(check.status)}
                      <span className="text-sm text-foreground">{check.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "google" && <GooglePreview result={result} />}
          {activeTab === "social" && <SocialPreviews result={result} />}
          {activeTab === "recommendations" && <Recommendations result={result} />}
        </CardContent>
      </Card>
    </div>
  );
}
