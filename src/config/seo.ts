/**
 * SEO Configuration
 * 
 * Centralized configuration for SEO-related constants.
 * Update BASE_URL when migrating to production domain.
 */

// Base URL - Update this when deploying to production
export const BASE_URL = 'https://foundationhub.vercel.app'

// Alternative: Use environment variable
// export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://foundationhub.vercel.app'

// Site metadata
export const SITE_NAME = 'Foundation'
export const SITE_TITLE = 'Foundation - Planejamento Financeiro Inteligente | Gestão de Investimentos'
export const SITE_DESCRIPTION = 'Plataforma completa de planejamento financeiro e gestão de investimentos. Projete sua aposentadoria, acompanhe patrimônio e alcance seus objetivos financeiros com inteligência.'
export const SITE_KEYWORDS = 'planejamento financeiro, gestão de investimentos, aposentadoria, patrimônio, investimentos, finanças pessoais, planejador financeiro, consultoria financeira, wealth management'

// Contact
export const CONTACT_EMAIL = 'foundationhub.app@gmail.com'

// Social/OG Images
export const OG_IMAGE = `${BASE_URL}/images/image.png`
export const LOGO_IMAGE = `${BASE_URL}/images/logoFoundation.png`

// Rating (for structured data)
export const AGGREGATE_RATING = {
  ratingValue: '4.7',
  ratingCount: '47',
  bestRating: '5',
  worstRating: '1'
}

// Organization info (for structured data)
export const ORGANIZATION = {
  '@type': 'Organization' as const,
  name: SITE_NAME,
  url: BASE_URL,
  logo: LOGO_IMAGE,
  contactPoint: {
    '@type': 'ContactPoint' as const,
    email: CONTACT_EMAIL,
    contactType: 'customer service'
  }
}

