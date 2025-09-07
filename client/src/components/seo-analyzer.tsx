import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Search, HelpCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { urlInputSchema, type UrlInput, type SeoAnalysisResult } from "@shared/schema";
import AnalysisResults from "./analysis-results";

export default function SeoAnalyzer() {
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysisResult | null>(null);
  const { toast } = useToast();

  const form = useForm<UrlInput>({
    resolver: zodResolver(urlInputSchema),
    defaultValues: {
      url: ""
    }
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: UrlInput) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json();
    },
    onSuccess: (data: SeoAnalysisResult) => {
      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: `SEO analysis completed with a score of ${data.score}/100`,
      });
    },
    onError: (error: any) => {
      const message = error.message || "Failed to analyze website";
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: UrlInput) => {
    analyzeMutation.mutate(data);
  };

  const handleExportReport = () => {
    if (analysisResult) {
      // Implementation for PDF export would go here
      toast({
        title: "Export Feature",
        description: "Export functionality would be implemented here",
      });
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex  items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg flex-shrink-0">
                <Search className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">SEO Tag Analyzer</h1>
                <p className="text-sm text-muted-foreground ">Professional SEO Analysis Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Button variant="ghost" size="sm" data-testid="button-help" className="hidden sm:flex">
                <HelpCircle className="w-5 h-5" />
              </Button>
              <Button 
                onClick={handleExportReport}
                disabled={!analysisResult}
                data-testid="button-export-report"
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export Report</span>
                {/* <span className="sm:hidden">Export</span> */}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* URL Input Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Analyze Website SEO</h2>
              <p className="text-muted-foreground">Enter a URL to analyze its SEO meta tags and get optimization recommendations</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="example.com or https://example.com" 
                              {...field}
                              data-testid="input-url"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter any website URL - https:// will be added automatically if needed
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-end lg:mt-2">
                    <Button 
                      type="submit" 
                      disabled={analyzeMutation.isPending}
                      className="flex items-center gap-2 w-full lg:w-auto"
                      data-testid="button-analyze"
                    >
                      <Search className="w-4 h-4" />
                      {analyzeMutation.isPending ? "Analyzing..." : "Analyze SEO"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>

            {/* Loading State */}
            {analyzeMutation.isPending && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span className="text-foreground">Analyzing website... This may take a few seconds</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && <AnalysisResults result={analysisResult} />}

        {/* Quick Actions */}
        {analysisResult && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" data-testid="button-export-pdf">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF Report
                </Button>
                <Button variant="secondary" size="sm" data-testid="button-share-results">
                  <Search className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    setAnalysisResult(null);
                    form.reset();
                  }}
                  data-testid="button-analyze-another"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Another URL
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">About SEO Analyzer</h4>
              <p className="text-sm text-muted-foreground">
                Professional SEO analysis tool helping developers and marketers optimize their websites for better search engine rankings.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Features</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Meta tag analysis</li>
                <li>• Social media previews</li>
                <li>• SEO recommendations</li>
                <li>• Export reports</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Support</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 SEO Tag Analyzer. Built for developers and SEO professionals.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
