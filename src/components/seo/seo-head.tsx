import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { generateStructuredData, injectStructuredData } from '@/lib/seo-utils'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

// Base URL configuration - update this when migrating to production domain
const BASE_URL = 'https://foundationhub.vercel.app'

/**
 * SEO Head Component
 * Dynamically updates meta tags for better SEO
 */
export function SEOHead({
  title,
  description,
  keywords,
  image = `${BASE_URL}/images/image.png`,
  url = `${BASE_URL}/`,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Foundation',
}: SEOHeadProps) {
  const { i18n } = useTranslation()
  
  const defaultTitle = 'Foundation - Planejamento Financeiro Inteligente | Gestão de Investimentos'
  const defaultDescription = 'Plataforma completa de planejamento financeiro e gestão de investimentos. Projete sua aposentadoria, acompanhe patrimônio e alcance seus objetivos financeiros com inteligência.'
  const defaultKeywords = 'planejamento financeiro, gestão de investimentos, aposentadoria, patrimônio, investimentos, finanças pessoais, planejador financeiro, consultoria financeira, wealth management'
  
  const finalTitle = title || defaultTitle
  const finalDescription = description || defaultDescription
  const finalKeywords = keywords || defaultKeywords
  
  useEffect(() => {
    // Update title
    document.title = finalTitle
    
    // Update meta tags
    const updateMetaTag = (selector: string, content: string, attribute: string = 'content') => {
      let element = document.querySelector(selector)
      if (element) {
        element.setAttribute(attribute, content)
      } else {
        element = document.createElement('meta')
        const [type, name] = selector.replace(/[[\]]/g, '').split('=')
        element.setAttribute(type.trim(), name.replace(/['"]/g, ''))
        element.setAttribute(attribute, content)
        document.head.appendChild(element)
      }
    }
    
    // Basic meta tags
    updateMetaTag('[name="description"]', finalDescription)
    updateMetaTag('[name="keywords"]', finalKeywords)
    updateMetaTag('[name="author"]', author)
    
    // Open Graph
    updateMetaTag('[property="og:title"]', finalTitle)
    updateMetaTag('[property="og:description"]', finalDescription)
    updateMetaTag('[property="og:image"]', image)
    updateMetaTag('[property="og:url"]', url)
    updateMetaTag('[property="og:type"]', type)
    updateMetaTag('[property="og:locale"]', i18n.language === 'pt' ? 'pt_BR' : 'en_US')
    
    // Twitter Card
    updateMetaTag('[name="twitter:title"]', finalTitle)
    updateMetaTag('[name="twitter:description"]', finalDescription)
    updateMetaTag('[name="twitter:image"]', image)
    updateMetaTag('[name="twitter:url"]', url)
    
    // Article specific tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('[property="article:published_time"]', publishedTime)
      }
      if (modifiedTime) {
        updateMetaTag('[property="article:modified_time"]', modifiedTime)
      }
      if (author) {
        updateMetaTag('[property="article:author"]', author)
      }
    }
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (canonical) {
      canonical.href = url
    } else {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = url
      document.head.appendChild(canonical)
    }
    
    // Update language
    document.documentElement.lang = i18n.language === 'pt' ? 'pt-BR' : 'en'
  }, [finalTitle, finalDescription, finalKeywords, image, url, type, publishedTime, modifiedTime, author, i18n.language])
  
  return null
}

/**
 * Hook to inject Structured Data into the page
 */
export function useStructuredData(structuredData: string) {
  useEffect(() => {
    const cleanup = injectStructuredData(structuredData)
    return cleanup
  }, [structuredData])
}

