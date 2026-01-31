import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { PortfolioPerformanceService } from "@/services/portfolio-performance.service"
import type { ConsolidatedPerformance } from "@/types/financial"
import type { UserProfileInvestment } from "@/types/broker-dashboard"

export interface OutdatedClient {
  id: string
  name: string
  email: string
  lastPeriod: string | null
  expectedPeriod: string
  monthsDelayed: number | null // null means never updated
  totalRecords: number
  brokerId: string | null
}

function calculateExpectedPeriod(): string {
  const now = new Date()
  // Get previous month (mês anterior ao atual)
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const month = String(previousMonth.getMonth() + 1).padStart(2, '0')
  const year = previousMonth.getFullYear()
  return `${month}/${year}`
}

function parsePeriod(period: string | null): Date | null {
  if (!period) return null
  const [month, year] = period.split('/').map(Number)
  if (!month || !year) return null
  return new Date(year, month - 1, 1)
}

function calculateMonthsDelayed(lastPeriod: string | null, expectedPeriod: string): number {
  if (!lastPeriod) {
    // If no period, calculate from a year ago (12 months)
    return 12
  }
  
  const lastDate = parsePeriod(lastPeriod)
  const expectedDate = parsePeriod(expectedPeriod)
  
  if (!lastDate || !expectedDate) return 0
  
  const monthsDiff = (expectedDate.getFullYear() - lastDate.getFullYear()) * 12 + 
                     (expectedDate.getMonth() - lastDate.getMonth())
  
  return Math.max(0, monthsDiff)
}

export function useOutdatedClients(brokerId?: string) {
  const [outdatedClients, setOutdatedClients] = useState<OutdatedClient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOutdatedClients = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const expectedPeriod = calculateExpectedPeriod()
      
      // Fetch all clients (filtered by broker if provided)
      let query = supabase
        .from('user_profiles_investment')
        .select('id, profile_name, email, broker_id')
      
      if (brokerId) {
        query = query.eq('broker_id', brokerId)
      }
      
      const { data: clients, error: clientsError } = await query

      if (clientsError) throw clientsError

      if (!clients || clients.length === 0) {
        setOutdatedClients([])
        setLoading(false)
        return
      }

      // Fetch consolidated performance data for all clients
      const clientIds = clients.map(c => c.id)
      const { data: allConsolidatedData, error: consolidatedError } = await supabase
        .from('consolidated_performance')
        .select('profile_id, period')
        .in('profile_id', clientIds)

      if (consolidatedError) throw consolidatedError

      // Group by profile_id and find the most recent period for each client
      const clientPeriods = new Map<string, string | null>()
      const clientRecordCounts = new Map<string, number>()

      allConsolidatedData?.forEach(record => {
        const profileId = record.profile_id
        const currentPeriod = clientPeriods.get(profileId)
        
        // Count records
        clientRecordCounts.set(profileId, (clientRecordCounts.get(profileId) || 0) + 1)
        
        // Find most recent period using proper date comparison
        if (!record.period) return
        
        if (!currentPeriod) {
          clientPeriods.set(profileId, record.period)
        } else {
          // Compare periods properly by parsing dates
          const currentDate = parsePeriod(currentPeriod)
          const recordDate = parsePeriod(record.period)
          
          if (recordDate && currentDate && recordDate > currentDate) {
            clientPeriods.set(profileId, record.period)
          } else if (!currentDate && recordDate) {
            // If current period is invalid but record period is valid, use record period
            clientPeriods.set(profileId, record.period)
          }
        }
      })

      // Build clients list - include ALL clients
      // This page is for bulk PDF import, so we show all clients
      // Clients without consolidated_performance data will appear as "Nunca Atualizado"
      const outdated: OutdatedClient[] = []

      for (const client of clients) {
        const lastPeriod = clientPeriods.get(client.id) || null
        const totalRecords = clientRecordCounts.get(client.id) || 0
        
        // Calculate months delayed
        // If no records at all, use null to indicate "never updated"
        const monthsDelayed: number | null = totalRecords === 0 
          ? null 
          : calculateMonthsDelayed(lastPeriod, expectedPeriod)

        // Include ALL clients - this is a bulk import page, so we show everyone
        outdated.push({
          id: client.id,
          name: client.profile_name || client.email || client.id.slice(0, 8),
          email: client.email || '',
          lastPeriod,
          expectedPeriod,
          monthsDelayed,
          totalRecords,
          brokerId: client.broker_id
        })
      }

      // Sort by months delayed (null first = never updated, then most delayed first)
      outdated.sort((a, b) => {
        // null (never updated) comes first
        if (a.monthsDelayed === null && b.monthsDelayed === null) return 0
        if (a.monthsDelayed === null) return -1
        if (b.monthsDelayed === null) return 1
        // Then sort by months delayed descending
        return b.monthsDelayed! - a.monthsDelayed!
      })

      setOutdatedClients(outdated)
    } catch (err) {
      console.error('Error fetching outdated clients:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar clientes desatualizados')
      setOutdatedClients([])
    } finally {
      setLoading(false)
    }
  }, [brokerId])

  useEffect(() => {
    fetchOutdatedClients()
  }, [fetchOutdatedClients])

  return {
    outdatedClients,
    loading,
    error,
    refetch: fetchOutdatedClients
  }
}

