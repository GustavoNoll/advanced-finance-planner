import type { ConsolidatedPerformance, PerformanceData } from '@/types/financial'
import type { VerificationResult } from '../types/portfolio-data-management.types'
import { isValidAssetClass } from './valid-asset-classes'

export function verifyIntegrity(
  competencia: string,
  instituicao: string | null,
  accountName: string | null,
  patrimonioFinal: number | null,
  relatedDetails: PerformanceData[],
  correctThreshold: number,
  toleranceValue: number
): VerificationResult {
  const finalAssets = patrimonioFinal || 0
  
  const detailedSum = relatedDetails.reduce((sum, item) => sum + (item.position || 0), 0)
  
  const unclassifiedCount = relatedDetails.filter(item => 
    !isValidAssetClass(item.asset_class)
  ).length
  
  const missingYieldCount = relatedDetails.filter(item => {
    const rendimento = item.yield
    
    // yield is number | null, so if it's null/undefined, it's missing
    if (rendimento == null) return true
    
    // If it's a number (including 0), it's valid
    return false
  }).length
  
  const difference = Math.abs(finalAssets - detailedSum)
  
  let status: VerificationResult['status']
  if (relatedDetails.length === 0) {
    status = 'no-data'
  } else if (difference < correctThreshold) {
    status = 'match'
  } else if (difference < toleranceValue) {
    status = 'tolerance'
  } else {
    status = 'mismatch'
  }
  
  return {
    status,
    consolidatedValue: finalAssets,
    detailedSum,
    difference,
    detailedCount: relatedDetails.length,
    unclassifiedCount,
    hasUnclassified: unclassifiedCount > 0,
    missingYieldCount,
    hasMissingYield: missingYieldCount > 0
  }
}

export function createVerificationCache(
  consolidatedData: ConsolidatedPerformance[],
  detailedData: PerformanceData[],
  correctThreshold: number,
  toleranceValue: number
): Map<string, VerificationResult> {
  const cache = new Map<string, VerificationResult>()
  
  const detailedIndex = new Map<string, PerformanceData[]>()
  detailedData.forEach(item => {
    const key = `${item.period || ''}-${item.institution || ''}-${item.account_name || ''}`
    if (!detailedIndex.has(key)) detailedIndex.set(key, [])
    detailedIndex.get(key)!.push(item)
  })
  
  consolidatedData.forEach(item => {
    const key = `${item.period || ''}-${item.institution || ''}-${item.account_name || ''}`
    const relatedDetails = detailedIndex.get(key) || []
    
    cache.set(key, verifyIntegrity(
      item.period || '',
      item.institution,
      item.account_name,
      item.final_assets,
      relatedDetails,
      correctThreshold,
      toleranceValue
    ))
  })
  
  return cache
}

