import { type SeoAnalysisResult } from "@shared/schema";

interface SocialPreviewsProps {
  result: SeoAnalysisResult;
}

export default function SocialPreviews({ result }: SocialPreviewsProps) {
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
        </div>
      </div>
    </div>
  );
}
