import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
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
      // Fetch consolidated_performance data from Supabase
      const { data: consolidated, error: consolidatedError } = await supabase
        .from('consolidated_performance')
        .select('*')
        .eq('profile_id', profileId)
        .order('report_date', { ascending: true });

      if (consolidatedError) {
        throw new Error(consolidatedError.message);
      }

      // Fetch performance_data from Supabase
      const { data: performance, error: performanceError } = await supabase
        .from('performance_data')
        .select('*')
        .eq('profile_id', profileId)
        .order('report_date', { ascending: true });

      if (performanceError) {
        throw new Error(performanceError.message);
      }

      setConsolidatedData(consolidated || []);
      setPerformanceData(performance || []);

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

  // Get the most recent period data
  const getMostRecentData = () => {
    if (consolidatedData.length === 0) return { assets: 0, yieldValue: 0 };
    
    // Find the most recent period
    const mostRecentEntry = consolidatedData.reduce((latest, current) => {
      if (!latest.period) return current;
      if (!current.period) return latest;
      return current.period > latest.period ? current : latest;
    });
    
    return {
      assets: mostRecentEntry.final_assets || 0,
      yieldValue: mostRecentEntry.yield || 0
    };
  };

  const { assets: totalAssets, yieldValue: totalYield } = getMostRecentData();

  return {
    consolidatedData,
    performanceData,
    loading,
    error,
    totalAssets,
    totalYield,
    hasData: consolidatedData.length > 0 || performanceData.length > 0,
    refetch: fetchPerformanceData
  };
}

