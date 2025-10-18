/**
 * SEO Utility Functions
 * 
 * Utility functions for SEO that don't need React hooks.
 * Separated from components to support Fast Refresh.
 */

/**
 * Generate Structured Data (JSON-LD) for SEO
 */
export function generateStructuredData(type: 'WebPage' | 'FAQPage' | 'HowTo' | 'Article', data: Record<string, unknown>) {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }
  
  return JSON.stringify(baseStructure, null, 2)
}

/**
 * Inject Structured Data into the page
 */
export function injectStructuredData(structuredData: string) {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = structuredData
  script.id = 'structured-data-custom'
  
  // Remove previous structured data if exists
  const existing = document.getElementById('structured-data-custom')
  if (existing) {
    existing.remove()
  }
  
  document.head.appendChild(script)
  
  return () => {
    script.remove()
  }
}
