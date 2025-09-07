import { useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, Lightbulb, Target, Settings, Trophy, Search, Eye, ChevronDown, ChevronRight } from "lucide-react";
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

type MainTabType = "overview" | "technical";
type TechnicalTabType = "google" | "social";
type OverviewSubTabType = "search-engine" | "social-media";

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>("overview");
  const [activeTechnicalTab, setActiveTechnicalTab] = useState<TechnicalTabType>("google");
  const [activeOverviewSubTab, setActiveOverviewSubTab] = useState<OverviewSubTabType>("search-engine");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const getStatusIcon = (status: SeoCheckResult['status']) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "fail":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: SeoCheckResult['status']) => {
    switch (status) {
      case "pass":
        return <Badge variant="default" className="text-xs bg-green-100 text-green-800 hover:bg-green-100">Pass</Badge>;
      case "warning":
        return <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-100">Warning</Badge>;
      case "fail":
        return <Badge variant="destructive" className="text-xs bg-red-100 text-red-800 hover:bg-red-100">Fail</Badge>;
      default:
        return null;
    }
  };

  const getOverallStatus = (checks: SeoCheckResult[]): SeoCheckResult['status'] => {
    if (checks.some(check => check.status === "fail")) return "fail";
    if (checks.some(check => check.status === "warning")) return "warning";
    return "pass";
  };

  const getCategoryStats = (checks: SeoCheckResult[]) => {
    const passed = checks.filter(check => check.status === "pass").length;
    const warnings = checks.filter(check => check.status === "warning").length;
    const failed = checks.filter(check => check.status === "fail").length;
    return `${passed} passed, ${warnings} warnings, ${failed} failed`;
  };

  const getMainCheckMessage = (checks: SeoCheckResult[], categoryName: string) => {
    const overallStatus = getOverallStatus(checks);
    const stats = getCategoryStats(checks);
    
    if (overallStatus === "pass") {
      return `${categoryName} is properly implemented. ${stats}`;
    } else if (overallStatus === "warning") {
      return `${categoryName} has some issues that should be addressed. ${stats}`;
    } else {
      return `${categoryName} has critical issues that need immediate attention. ${stats}`;
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getGoodFindings = () => {
    const findings: string[] = [];
    
    if (result.checks.title.some(check => check.status === "pass")) {
      findings.push("Title tag is properly configured");
    }
    
    if (result.checks.metaDescription.some(check => check.status === "pass")) {
      findings.push("Meta description is present and well-formatted");
    }
    
    if (result.checks.openGraph.some(check => check.status === "pass")) {
      findings.push("Open Graph tags are properly set up for social sharing");
    }
    
    if (result.checks.twitterCards.some(check => check.status === "pass")) {
      findings.push("Twitter Cards are configured for better social presence");
    }
    
    return findings;
  };

  const getAttentionNeeded = () => {
    const issues: Array<{title: string, message: string}> = [];
    
    const failedChecks = [
      ...result.checks.title.filter(check => check.status === "fail" || check.status === "warning"),
      ...result.checks.metaDescription.filter(check => check.status === "fail" || check.status === "warning"),
      ...result.checks.openGraph.filter(check => check.status === "fail" || check.status === "warning"),
      ...result.checks.twitterCards.filter(check => check.status === "fail" || check.status === "warning"),
    ];
    
    failedChecks.forEach(check => {
      issues.push({
        title: check.name,
        message: check.message
      });
    });
    
    return issues.slice(0, 5); // Show top 5 issues
  };

  const getPriorityRecommendations = () => {
    const recommendations: Array<{title: string, description: string, priority: number}> = [];
    
    // High priority recommendations
    if (result.checks.title.some(check => check.status === "fail")) {
      recommendations.push({
        title: "Fix Title Tag",
        description: "Your title tag needs immediate attention for better search visibility",
        priority: 1
      });
    }
    
    if (result.checks.metaDescription.some(check => check.status === "fail")) {
      recommendations.push({
        title: "Add Meta Description",
        description: "Meta description is missing or needs improvement for better click-through rates",
        priority: 2
      });
    }
    
    if (result.checks.openGraph.some(check => check.status === "fail")) {
      recommendations.push({
        title: "Configure Open Graph",
        description: "Set up Open Graph tags to improve social media sharing appearance",
        priority: 3
      });
    }
    
    return recommendations.slice(0, 3); // Top 3 recommendations
  };

  const stats = {
    passed: [
      ...result.checks.title,
      ...result.checks.metaDescription,
      ...result.checks.openGraph,
      ...result.checks.twitterCards,
    ].filter(check => check.status === "pass").length,
    warnings: [
      ...result.checks.title,
      ...result.checks.metaDescription,
      ...result.checks.openGraph,
      ...result.checks.twitterCards,
    ].filter(check => check.status === "warning").length,
    failed: [
      ...result.checks.title,
      ...result.checks.metaDescription,
      ...result.checks.openGraph,
      ...result.checks.twitterCards,
    ].filter(check => check.status === "fail").length,
    total: [
      ...result.checks.title,
      ...result.checks.metaDescription,
      ...result.checks.openGraph,
      ...result.checks.twitterCards,
    ].length
  };

  const getSearchEngineOptimizationStats = () => {
    const searchEngineChecks = [
      ...result.checks.title,
      ...result.checks.metaDescription,
    ];
    
    const passed = searchEngineChecks.filter(check => check.status === "pass").length;
    const warnings = searchEngineChecks.filter(check => check.status === "warning").length;
    const failed = searchEngineChecks.filter(check => check.status === "fail").length;
    const total = searchEngineChecks.length;
    
    const score = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    return { passed, warnings, failed, total, score };
  };

  const getSocialMediaOptimizationStats = () => {
    const socialMediaChecks = [
      ...result.checks.openGraph,
      ...result.checks.twitterCards,
    ];
    
    const passed = socialMediaChecks.filter(check => check.status === "pass").length;
    const warnings = socialMediaChecks.filter(check => check.status === "warning").length;
    const failed = socialMediaChecks.filter(check => check.status === "fail").length;
    const total = socialMediaChecks.length;
    
    const score = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    return { passed, warnings, failed, total, score };
  };

  const getCategoryDescription = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      
      {/* SEO Analysis Results */}
      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200">SEO Analysis Results</h2>
          <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">
            {getScoreDescription(result.score)}
          </Badge>
        </div>
        <p className="text-sm text-green-700 dark:text-green-300 mb-6">
          Scored {stats.passed} passed, {stats.warnings} warnings, {stats.failed} failed
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overall SEO Score - Left */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="#CCCCCC"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted-foreground/20"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke={result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${(result.score / 100) * 339.29} 339.29`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-bold text-foreground" data-testid="text-seo-score">
                  {result.score}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Overall SEO Score</h3>
            <p className="text-sm text-muted-foreground">{getScoreDescription(result.score)}</p>
          </div>

          {/* SEO Health Summary - Right */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">SEO Health Summary</h3>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-sm font-medium text-green-800 dark:text-green-200">Passed Checks</div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.passed}</div>
              </div>
              
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-sm font-medium text-amber-800 dark:text-amber-200">Warnings</div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.warnings}</div>
              </div>
              
              <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-sm font-medium text-red-800 dark:text-red-200">Failed Checks</div>
                <div className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.failed}</div>
              </div>
            </div>

            {/* Check Distribution Bar */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-foreground" />
                <span className="text-sm font-medium text-foreground">Check Distribution</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="h-full flex">
                  {stats.total > 0 && (
                    <>
                      <div 
                        className="bg-green-500 h-full" 
                        style={{ width: `${(stats.passed / stats.total) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-amber-500 h-full" 
                        style={{ width: `${(stats.warnings / stats.total) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-red-500 h-full" 
                        style={{ width: `${(stats.failed / stats.total) * 100}%` }}
                      ></div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{Math.round((stats.passed / stats.total) * 100)}% Passed</span>
                <span>{Math.round((stats.warnings / stats.total) * 100)}% Warnings</span>
                <span>{Math.round((stats.failed / stats.total) * 100)}% Failed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Card>
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6" aria-label="Main Tabs">
            <Button
              variant="ghost"
              className={`border-b-2 ${
                activeMainTab === "overview" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              } py-4 px-2 text-sm font-medium rounded-none flex items-center gap-2`}
              onClick={() => setActiveMainTab("overview")}
              data-testid="tab-overview"
            >
              <Settings className="w-4 h-4" />
              Overview
            </Button>
            <Button
              variant="ghost"
              className={`border-b-2 ${
                activeMainTab === "technical" 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              } py-4 px-2 text-sm font-medium rounded-none flex items-center gap-2`}
              onClick={() => setActiveMainTab("technical")}
              data-testid="tab-technical"
            >
              <Eye className="w-4 h-4" />
              Technical Details
            </Button>
          </nav>
        </div>

        <CardContent className="p-6">
          {activeMainTab === "overview" && (
            <div className="space-y-8">
              {/* Category Breakdown */}
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">Category Breakdown</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Search Engine Optimization */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Search className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-foreground">Search Engine Optimization</h3>
                      <Badge className="ml-auto" variant={getSearchEngineOptimizationStats().score >= 80 ? "default" : getSearchEngineOptimizationStats().score >= 60 ? "secondary" : "destructive"}>
                        {getCategoryDescription(getSearchEngineOptimizationStats().score)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {/* Circular Progress for Search Engine */}
                      <div className="relative flex-shrink-0">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            stroke="#CCCCCC"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-muted-foreground/20"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            stroke={getSearchEngineOptimizationStats().score >= 80 ? '#10b981' : getSearchEngineOptimizationStats().score >= 60 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${(getSearchEngineOptimizationStats().score / 100) * 339.29} 339.29`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-foreground">
                              {getSearchEngineOptimizationStats().score}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats for Search Engine */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-foreground">{getSearchEngineOptimizationStats().passed} Passed</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span className="text-sm text-foreground">{getSearchEngineOptimizationStats().warnings} Warnings</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-foreground">{getSearchEngineOptimizationStats().failed} Failed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Optimization */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                      <h3 className="text-lg font-semibold text-foreground">Social Media Optimization</h3>
                      <Badge className="ml-auto" variant={getSocialMediaOptimizationStats().score >= 80 ? "default" : getSocialMediaOptimizationStats().score >= 60 ? "secondary" : "destructive"}>
                        {getCategoryDescription(getSocialMediaOptimizationStats().score)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {/* Circular Progress for Social Media */}
                      <div className="relative flex-shrink-0">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            stroke="#CCCCCC"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-muted-foreground/20"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            stroke={getSocialMediaOptimizationStats().score >= 80 ? '#10b981' : getSocialMediaOptimizationStats().score >= 60 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${(getSocialMediaOptimizationStats().score / 100) * 339.29} 339.29`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-foreground">
                              {getSocialMediaOptimizationStats().score}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats for Social Media */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-foreground">{getSocialMediaOptimizationStats().passed} Passed</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span className="text-sm text-foreground">{getSocialMediaOptimizationStats().warnings} Warnings</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-foreground">{getSocialMediaOptimizationStats().failed} Failed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Overview Sub-tabs */}
              <div>
                <div className="border-b border-border mb-6">
                  <nav className="flex space-x-8" aria-label="Overview Sub Tabs">
                    <Button
                      variant="ghost"
                      className={`border-b-2 ${
                        activeOverviewSubTab === "search-engine" 
                          ? "border-primary text-primary" 
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      } py-3 px-2 text-sm font-medium rounded-none flex items-center gap-2`}
                      onClick={() => setActiveOverviewSubTab("search-engine")}
                    >
                      <Search className="w-4 h-4" />
                      Search Engine ({getSearchEngineOptimizationStats().total})
                    </Button>
                    <Button
                      variant="ghost"
                      className={`border-b-2 ${
                        activeOverviewSubTab === "social-media" 
                          ? "border-primary text-primary" 
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      } py-3 px-2 text-sm font-medium rounded-none flex items-center gap-2`}
                      onClick={() => setActiveOverviewSubTab("social-media")}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                      Social Media ({getSocialMediaOptimizationStats().total})
                    </Button>
                  </nav>
                </div>
                
                {activeOverviewSubTab === "search-engine" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Search Engine Optimization Checks</h3>
                    <div className="space-y-3">
                      {result.checks.title.map((check, index) => (
                        <div key={index} className="border border-border rounded-lg p-4 flex items-start gap-3">
                          {getStatusIcon(check.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-foreground">{check.name}</h4>
                              {getStatusBadge(check.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{check.message}</p>
                          </div>
                        </div>
                      ))}
                      {result.checks.metaDescription.map((check, index) => (
                        <div key={index} className="border border-border rounded-lg p-4 flex items-start gap-3">
                          {getStatusIcon(check.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-foreground">{check.name}</h4>
                              {getStatusBadge(check.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{check.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeOverviewSubTab === "social-media" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Social Media Optimization Checks</h3>
                    <div className="space-y-3">
                      {result.checks.openGraph.map((check, index) => (
                        <div key={index} className="border border-border rounded-lg p-4 flex items-start gap-3">
                          {getStatusIcon(check.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-foreground">{check.name}</h4>
                              {getStatusBadge(check.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{check.message}</p>
                          </div>
                        </div>
                      ))}
                      {result.checks.twitterCards.map((check, index) => (
                        <div key={index} className="border border-border rounded-lg p-4 flex items-start gap-3">
                          {getStatusIcon(check.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-foreground">{check.name}</h4>
                              {getStatusBadge(check.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{check.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeMainTab === "technical" && (
            <div className="space-y-6">
              {/* Technical Sub-tabs */}
              <div className="border-b border-border">
                <nav className="flex space-x-8" aria-label="Technical Sub Tabs">
                  <Button
                    variant="ghost"
                    className={`border-b-2 ${
                      activeTechnicalTab === "google" 
                        ? "border-primary text-primary" 
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    } py-3 px-2 text-sm font-medium rounded-none flex items-center gap-2`}
                    onClick={() => setActiveTechnicalTab("google")}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
                      activeTechnicalTab === "social" 
                        ? "border-primary text-primary" 
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    } py-3 px-2 text-sm font-medium rounded-none flex items-center gap-2`}
                    onClick={() => setActiveTechnicalTab("social")}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                    Social Media Previews
                  </Button>
                </nav>
              </div>
              
              {activeTechnicalTab === "google" && (
                <div className="space-y-6">
                  <GooglePreview result={result} />
                  
                  {/* Collapsible sections */}
                  <div className="space-y-4">
                    {/* All SEO Recommendations */}
                    <div className="border border-border rounded-lg">
                      <button
                        onClick={() => toggleSection('allRecommendations')}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span className="font-medium text-foreground">All SEO Recommendations</span>
                        </div>
                        {expandedSections['allRecommendations'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      {expandedSections['allRecommendations'] && (
                        <div className="border-t border-border p-4">
                          <Recommendations result={result} />
                        </div>
                      )}
                    </div>

                    {/* Raw Meta Tags */}
                    <div className="border border-border rounded-lg">
                      <button
                        onClick={() => toggleSection('rawTags')}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          <span className="font-medium text-foreground">Raw Meta Tags</span>
                        </div>
                        {expandedSections['rawTags'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      {expandedSections['rawTags'] && (
                        <div className="border-t border-border p-4">
                          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto">
                            <pre className="text-green-400 text-xs sm:text-sm whitespace-pre-wrap">
                              {result.allMetaTags && Object.entries(result.allMetaTags).map(([key, value]) => 
                                key === 'title' 
                                  ? `<title>${value}</title>`
                                  : key.startsWith('http-equiv:')
                                  ? `<meta http-equiv="${key.replace('http-equiv:', '')}" content="${value}" />`
                                  : key.startsWith('og:') || key.startsWith('twitter:') || key.startsWith('fb:')
                                  ? `<meta property="${key}" content="${value}" />`
                                  : key === 'charset'
                                  ? `<meta charset="${value}" />`
                                  : key === 'canonical'
                                  ? `<link rel="canonical" href="${value}" />`
                                  : `<meta name="${key}" content="${value}" />`
                              ).join('\n')}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTechnicalTab === "social" && (
                <div className="space-y-6">
                  <SocialPreviews result={result} />
                  
                  {/* Collapsible sections for social tab */}
                  <div className="space-y-4">
                    {/* All SEO Recommendations */}
                    <div className="border border-border rounded-lg">
                      <button
                        onClick={() => toggleSection('socialRecommendations')}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          <span className="font-medium text-foreground">All SEO Recommendations</span>
                        </div>
                        {expandedSections['socialRecommendations'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      {expandedSections['socialRecommendations'] && (
                        <div className="border-t border-border p-4">
                          <Recommendations result={result} />
                        </div>
                      )}
                    </div>

                    {/* Raw Meta Tags */}
                    <div className="border border-border rounded-lg">
                      <button
                        onClick={() => toggleSection('socialRawTags')}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          <span className="font-medium text-foreground">Raw Meta Tags</span>
                        </div>
                        {expandedSections['socialRawTags'] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      {expandedSections['socialRawTags'] && (
                        <div className="border-t border-border p-4">
                          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto">
                            <pre className="text-green-400 text-xs sm:text-sm whitespace-pre-wrap">
                              {result.allMetaTags && Object.entries(result.allMetaTags).map(([key, value]) => 
                                key === 'title' 
                                  ? `<title>${value}</title>`
                                  : key.startsWith('http-equiv:')
                                  ? `<meta http-equiv="${key.replace('http-equiv:', '')}" content="${value}" />`
                                  : key.startsWith('og:') || key.startsWith('twitter:') || key.startsWith('fb:')
                                  ? `<meta property="${key}" content="${value}" />`
                                  : key === 'charset'
                                  ? `<meta charset="${value}" />`
                                  : key === 'canonical'
                                  ? `<link rel="canonical" href="${value}" />`
                                  : `<meta name="${key}" content="${value}" />`
                              ).join('\n')}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}