import { useState, useEffect, useCallback } from "react";
import { PortfolioPerformanceService } from "@/services/portfolio-performance.service";
import type { ConsolidatedPerformance, PerformanceData } from "@/types/financial";

export function usePerformanceData(profileId: string | null) {
  const [consolidatedData, setConsolidatedData] = useState<ConsolidatedPerformance[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformanceData = useCallback(async () => {
    if (!profileId) return;

    setLoading(true);
    setError(null);

    try {
      const { consolidated, detailed } = await PortfolioPerformanceService.fetchAllData(
        profileId,
        'report_date',
        true
      );

      setConsolidatedData(consolidated);
      setPerformanceData(detailed);

    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de performance');
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    if (profileId) {
      fetchPerformanceData();
    } else {
      setConsolidatedData([]);
      setPerformanceData([]);
    }
  }, [profileId, fetchPerformanceData]);

  // Get assets by period (summing all institutions for each period)
  const getAssetsByPeriod = () => {
    if (consolidatedData.length === 0) return new Map<string, number>();
    
    const assetsMap = new Map<string, number>();
    
    consolidatedData.forEach(entry => {
      if (!entry.period) return;
      const currentTotal = assetsMap.get(entry.period) || 0;
      assetsMap.set(entry.period, currentTotal + (entry.final_assets || 0));
    });
    
    return assetsMap;
  };

  // Get the most recent period data
  const getMostRecentData = () => {
    if (consolidatedData.length === 0) return { 
      assets: 0, 
      yieldValue: 0, 
      previousAssets: null,
      period: null,
      previousPeriod: null
    };
    
    const assetsByPeriod = getAssetsByPeriod();
    // Sort periods by date (MM/YYYY format)
    const periods = Array.from(assetsByPeriod.keys()).sort((a, b) => {
      if (!a || !b) return 0;
      const [monthA, yearA] = a.split('/').map(Number);
      const [monthB, yearB] = b.split('/').map(Number);
      const dateA = new Date(yearA, monthA - 1);
      const dateB = new Date(yearB, monthB - 1);
      return dateB.getTime() - dateA.getTime(); // Descending order (most recent first)
    });
    
    if (periods.length === 0) {
      return { 
        assets: 0, 
        yieldValue: 0, 
        previousAssets: null,
        period: null,
        previousPeriod: null
      };
    }
    
    const latestPeriod = periods[0];
    const previousPeriod = periods.length > 1 ? periods[1] : null;
    
    const totalAssets = assetsByPeriod.get(latestPeriod) || 0;
    const previousAssets = previousPeriod ? assetsByPeriod.get(previousPeriod) || null : null;
    
    // Find the most recent entry for yield calculation
    const mostRecentEntry = consolidatedData.reduce((latest, current) => {
      if (!latest.period) return current;
      if (!current.period) return latest;
      return current.period > latest.period ? current : latest;
    });
    
    return {
      assets: totalAssets,
      yieldValue: mostRecentEntry.yield || 0,
      previousAssets,
      period: latestPeriod,
      previousPeriod
    };
  };

  const { assets: totalAssets, yieldValue: totalYield, previousAssets, period, previousPeriod } = getMostRecentData();

  // Calculate percentage change from previous period
  const assetsChangePercent = previousAssets !== null && previousAssets > 0 && totalAssets > 0
    ? ((totalAssets - previousAssets) / previousAssets) * 100
    : null;

  return {
    consolidatedData,
    performanceData,
    loading,
    error,
    totalAssets,
    totalYield,
    previousAssets,
    assetsChangePercent,
    hasData: consolidatedData.length > 0 || performanceData.length > 0,
    refetch: fetchPerformanceData
  };
}

