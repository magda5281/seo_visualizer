import { type SeoAnalysisResult } from "@shared/schema";

interface GooglePreviewProps {
  result: SeoAnalysisResult;
}

export default function GooglePreview({ result }: GooglePreviewProps) {
  const getDisplayUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground mb-6">Google Search Preview</h3>
      
      <div className="max-w-2xl">
        <div className="border border-border rounded-lg p-4 bg-white">
          <div className="text-xs text-green-600 mb-1" data-testid="text-google-url">
            {getDisplayUrl(result.url)}
          </div>
          <a 
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-blue-600 hover:underline cursor-pointer mb-1 block" 
            data-testid="text-google-title"
          >
            {result.title || "No title available"}
          </a>
          <p className="text-sm text-gray-600" data-testid="text-google-description">
            {result.metaDescription || "No meta description available"}
          </p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <span>Dec 15, 2024</span>
            <span className="mx-2">·</span>
            <span>5 min read</span>
          </div>
        </div>
      </div>
    </div>
  );
}
