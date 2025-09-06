import { AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";
import { type SeoAnalysisResult } from "@shared/schema";

interface RecommendationsProps {
  result: SeoAnalysisResult;
}

export default function Recommendations({ result }: RecommendationsProps) {
  const getHighPriorityIssues = () => {
    const issues: string[] = [];
    
    // Check for missing Twitter cards
    const hasTwitterCard = result.twitterTags['twitter:card'];
    if (!hasTwitterCard) {
      issues.push("Add Twitter Card Meta Tags");
    }
    
    // Check for missing title
    if (!result.title) {
      issues.push("Add Title Tag");
    }
    
    // Check for missing meta description
    if (!result.metaDescription) {
      issues.push("Add Meta Description");
    }
    
    return issues;
  };

  const getMediumPriorityIssues = () => {
    const issues: string[] = [];
    
    // Check meta description length
    if (result.metaDescription && result.metaDescription.length < 150) {
      issues.push("Extend Meta Description Length");
    }
    
    // Check title length
    if (result.title && (result.title.length < 30 || result.title.length > 60)) {
      issues.push("Optimize Title Length");
    }
    
    return issues;
  };

  const highPriorityIssues = getHighPriorityIssues();
  const mediumPriorityIssues = getMediumPriorityIssues();

  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground mb-6">SEO Recommendations</h3>
      
      <div className="space-y-6">
        {/* High Priority Recommendations */}
        {highPriorityIssues.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-red-600 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              High Priority Issues
            </h4>
            <div className="space-y-4">
              {highPriorityIssues.includes("Add Twitter Card Meta Tags") && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50" data-testid="recommendation-twitter-cards">
                  <h5 className="font-medium text-gray-900 mb-2">Add Twitter Card Meta Tags</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Your website is missing Twitter Card meta tags, which means your content won't display properly when shared on Twitter.
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono">
                    &lt;meta name="twitter:card" content="summary_large_image"&gt;<br />
                    &lt;meta name="twitter:title" content="Your Page Title"&gt;<br />
                    &lt;meta name="twitter:description" content="Your page description"&gt;
                  </div>
                </div>
              )}
              
              {highPriorityIssues.includes("Add Title Tag") && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50" data-testid="recommendation-title">
                  <h5 className="font-medium text-gray-900 mb-2">Add Title Tag</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Your page is missing a title tag, which is crucial for SEO and user experience.
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono">
                    &lt;title&gt;Your Page Title (30-60 characters)&lt;/title&gt;
                  </div>
                </div>
              )}
              
              {highPriorityIssues.includes("Add Meta Description") && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50" data-testid="recommendation-meta-description">
                  <h5 className="font-medium text-gray-900 mb-2">Add Meta Description</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Your page is missing a meta description, which appears in search results and affects click-through rates.
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono">
                    &lt;meta name="description" content="Your page description (150-160 characters)"&gt;
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medium Priority Recommendations */}
        {mediumPriorityIssues.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-amber-600 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Medium Priority Issues
            </h4>
            <div className="space-y-4">
              {mediumPriorityIssues.includes("Extend Meta Description Length") && (
                <div className="border border-amber-200 rounded-lg p-4 bg-amber-50" data-testid="recommendation-description-length">
                  <h5 className="font-medium text-gray-900 mb-2">Extend Meta Description Length</h5>
                  <p className="text-sm text-gray-600">
                    Your meta description is {result.metaDescription?.length || 0} characters. 
                    Extend it to 150-160 characters to provide more context and improve click-through rates.
                  </p>
                </div>
              )}
              
              {mediumPriorityIssues.includes("Optimize Title Length") && (
                <div className="border border-amber-200 rounded-lg p-4 bg-amber-50" data-testid="recommendation-title-length">
                  <h5 className="font-medium text-gray-900 mb-2">Optimize Title Length</h5>
                  <p className="text-sm text-gray-600">
                    Your title is {result.title?.length || 0} characters. 
                    Optimize it to 30-60 characters for best search engine display.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Optimization Tips */}
        <div>
          <h4 className="text-lg font-medium text-blue-600 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Optimization Tips
          </h4>
          <div className="space-y-4">
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50" data-testid="tip-schema-markup">
              <h5 className="font-medium text-gray-900 mb-2">Consider Adding Schema Markup</h5>
              <p className="text-sm text-gray-600">
                Implement structured data to help search engines better understand your content and potentially earn rich snippets.
              </p>
            </div>
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50" data-testid="tip-image-optimization">
              <h5 className="font-medium text-gray-900 mb-2">Optimize Images for Social Sharing</h5>
              <p className="text-sm text-gray-600">
                Ensure your Open Graph and Twitter Card images are optimized (1200x630px for optimal display across platforms).
              </p>
            </div>
            
            {/* Show additional recommendations from the analysis */}
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <p className="text-sm text-gray-600">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
