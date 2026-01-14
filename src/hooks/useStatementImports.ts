import { useState, useEffect, useCallback } from 'react'
import { StatementImportsService } from '@/services/statement-imports.service'
import { supabase } from '@/lib/supabase'
import type { StatementImport } from '@/types/financial/statement-imports'

export function useStatementImports(profileId: string | null) {
  const [latestImport, setLatestImport] = useState<StatementImport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLatestImport = useCallback(async () => {
    if (!profileId) {
      setLatestImport(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const importData = await StatementImportsService.getLatestImport(profileId)
      setLatestImport(importData)
    } catch (err) {
      console.error('Error fetching latest import:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar importação')
    } finally {
      setLoading(false)
    }
  }, [profileId])

  useEffect(() => {
    fetchLatestImport()
  }, [fetchLatestImport])

  return {
    latestImport,
    loading,
    error,
    refetch: fetchLatestImport
  }
}

export function useStatementImportsHistory(profileId: string | null) {
  const [imports, setImports] = useState<StatementImport[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchImports = useCallback(async () => {
    if (!profileId) {
      setImports([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const importsData = await StatementImportsService.getAllImports(profileId)
      setImports(importsData)
    } catch (err) {
      console.error('Error fetching imports history:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico')
    } finally {
      setLoading(false)
    }
  }, [profileId])

  useEffect(() => {
    fetchImports()
  }, [fetchImports])

  return {
    imports,
    loading,
    error,
    refetch: fetchImports
  }
}

interface StatementImportsByDay {
  date: string;
  total: number;
  success: number;
  failed: number;
  running: number;
  created: number;
}

interface StatementImportsStats {
  total: number;
  success: number;
  failed: number;
  running: number;
  created: number;
  consolidated: number;
  detailed: number;
}

interface UseAdminStatementImportsReturn {
  statementImports: StatementImport[];
  statementImportsByDay: StatementImportsByDay[];
  statementImportsStats: StatementImportsStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAdminStatementImports(days: number = 30): UseAdminStatementImportsReturn {
  const [statementImports, setStatementImports] = useState<StatementImport[]>([]);
  const [statementImportsByDay, setStatementImportsByDay] = useState<StatementImportsByDay[]>([]);
  const [statementImportsStats, setStatementImportsStats] = useState<StatementImportsStats>({
    total: 0,
    success: 0,
    failed: 0,
    running: 0,
    created: 0,
    consolidated: 0,
    detailed: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatementImports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get imports from the last N days
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      
      const { data: imports, error: fetchError } = await supabase
        .from('statement_imports')
        .select('*')
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setStatementImports(imports || []);

      // Calculate stats
      const stats: StatementImportsStats = {
        total: imports?.length || 0,
        success: imports?.filter(i => i.status === 'success').length || 0,
        failed: imports?.filter(i => i.status === 'failed').length || 0,
        running: imports?.filter(i => i.status === 'running').length || 0,
        created: imports?.filter(i => i.status === 'created').length || 0,
        consolidated: imports?.filter(i => i.import_type === 'consolidated').length || 0,
        detailed: imports?.filter(i => i.import_type === 'assets').length || 0
      };
      setStatementImportsStats(stats);

      // Group by day for the last 14 days
      const daysData: Record<string, StatementImportsByDay> = {};

      // Initialize last 14 days
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        daysData[dateKey] = {
          date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
          total: 0,
          success: 0,
          failed: 0,
          running: 0,
          created: 0
        };
      }

      // Count imports by day
      imports?.forEach(importItem => {
        const importDate = new Date(importItem.created_at);
        const dateKey = importDate.toISOString().split('T')[0];
        
        if (daysData[dateKey]) {
          daysData[dateKey].total++;
          if (importItem.status === 'success') daysData[dateKey].success++;
          if (importItem.status === 'failed') daysData[dateKey].failed++;
          if (importItem.status === 'running') daysData[dateKey].running++;
          if (importItem.status === 'created') daysData[dateKey].created++;
        }
      });

      setStatementImportsByDay(Object.values(daysData));
    } catch (err) {
      console.error('Error fetching statement imports:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar importações');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchStatementImports();
  }, [fetchStatementImports]);

  return {
    statementImports,
    statementImportsByDay,
    statementImportsStats,
    loading,
    error,
    refetch: fetchStatementImports
  };
}

export function useBrokerStatementImports(brokerId: string | null, days: number = 30): UseAdminStatementImportsReturn {
  const [statementImports, setStatementImports] = useState<StatementImport[]>([]);
  const [statementImportsByDay, setStatementImportsByDay] = useState<StatementImportsByDay[]>([]);
  const [statementImportsStats, setStatementImportsStats] = useState<StatementImportsStats>({
    total: 0,
    success: 0,
    failed: 0,
    running: 0,
    created: 0,
    consolidated: 0,
    detailed: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatementImports = useCallback(async () => {
    if (!brokerId) {
      setStatementImports([]);
      setStatementImportsByDay([]);
      setStatementImportsStats({
        total: 0,
        success: 0,
        failed: 0,
        running: 0,
        created: 0,
        consolidated: 0,
        detailed: 0
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, get all client profile_ids for this broker
      const { data: clients, error: clientsError } = await supabase
        .from('user_profiles_investment')
        .select('id')
        .eq('broker_id', brokerId);

      if (clientsError) throw clientsError;

      const clientIds = clients?.map(c => c.id) || [];
      
      if (clientIds.length === 0) {
        setStatementImports([]);
        setStatementImportsByDay([]);
        setStatementImportsStats({
          total: 0,
          success: 0,
          failed: 0,
          running: 0,
          created: 0,
          consolidated: 0,
          detailed: 0
        });
        setLoading(false);
        return;
      }

      // Get imports from the last N days for these clients
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      
      const { data: imports, error: fetchError } = await supabase
        .from('statement_imports')
        .select('*')
        .in('profile_id', clientIds)
        .gte('created_at', daysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setStatementImports(imports || []);

      // Calculate stats
      const stats: StatementImportsStats = {
        total: imports?.length || 0,
        success: imports?.filter(i => i.status === 'success').length || 0,
        failed: imports?.filter(i => i.status === 'failed').length || 0,
        running: imports?.filter(i => i.status === 'running').length || 0,
        created: imports?.filter(i => i.status === 'created').length || 0,
        consolidated: imports?.filter(i => i.import_type === 'consolidated').length || 0,
        detailed: imports?.filter(i => i.import_type === 'assets').length || 0
      };
      setStatementImportsStats(stats);

      // Group by day for the last 14 days
      const daysData: Record<string, StatementImportsByDay> = {};

      // Initialize last 14 days
      for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        daysData[dateKey] = {
          date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
          total: 0,
          success: 0,
          failed: 0,
          running: 0,
          created: 0
        };
      }

      // Count imports by day
      imports?.forEach(importItem => {
        const importDate = new Date(importItem.created_at);
        const dateKey = importDate.toISOString().split('T')[0];
        
        if (daysData[dateKey]) {
          daysData[dateKey].total++;
          if (importItem.status === 'success') daysData[dateKey].success++;
          if (importItem.status === 'failed') daysData[dateKey].failed++;
          if (importItem.status === 'running') daysData[dateKey].running++;
          if (importItem.status === 'created') daysData[dateKey].created++;
        }
      });

      setStatementImportsByDay(Object.values(daysData));
    } catch (err) {
      console.error('Error fetching broker statement imports:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar importações');
    } finally {
      setLoading(false);
    }
  }, [brokerId, days]);

  useEffect(() => {
    fetchStatementImports();
  }, [fetchStatementImports]);

  return {
    statementImports,
    statementImportsByDay,
    statementImportsStats,
    loading,
    error,
    refetch: fetchStatementImports
  };
}
