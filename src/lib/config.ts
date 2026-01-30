// App configuration
// Update this URL to your production domain
export const APP_CONFIG = {
  // The public URL where pages are accessible
  // Set to your Netlify URL for production
  publicUrl: 'https://growthpagess.netlify.app',
  
  // The page path prefix
  pagePrefix: '/p/',
} as const;

// Helper to get the full public page URL
export function getPublicPageUrl(slug: string): string {
  return `${APP_CONFIG.publicUrl}${APP_CONFIG.pagePrefix}${slug}`;
}
