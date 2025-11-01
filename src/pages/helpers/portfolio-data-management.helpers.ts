import { PortfolioPerformanceService } from '@/services/portfolio-performance.service'
import type { ConsolidatedPerformance, PerformanceData } from '@/types/financial'

type ConsolidatedRow = ConsolidatedPerformance
type PerformanceRow = PerformanceData

interface SaveEditParams {
  editingType: 'consolidated' | 'detailed'
  editItem: Partial<ConsolidatedRow & PerformanceRow>
  profileId: string
  toast: (options: { title: string; description?: string; variant?: 'default' | 'destructive' }) => void
  t: (key: string, options?: Record<string, unknown>) => string
  onSuccess: () => void
  onClose: () => void
}

export async function handleSaveEdit({
  editingType,
  editItem,
  profileId,
  toast,
  t,
  onSuccess,
  onClose
}: SaveEditParams): Promise<void> {
  if (!editingType || !editItem || !profileId) return

  try {
    // Validate duplicates for both new records and edits
    if (editingType === 'consolidated') {
      const isDuplicate = await PortfolioPerformanceService.checkConsolidatedDuplicate(
        profileId,
        editItem.institution || null,
        editItem.period || null,
        editItem.id // Excluir o registro atual da verificação quando estiver editando
      )

      if (isDuplicate) {
        toast({
          title: t('portfolioPerformance.validation.duplicateTitle'),
          description: t('portfolioPerformance.validation.consolidatedDuplicate'),
          variant: 'destructive'
        })
        return
      }
    } else {
      // For detailed records, we need asset and position
      if (!editItem.asset || editItem.position === undefined) {
        toast({
          title: t('portfolioPerformance.validation.invalidData'),
          description: t('portfolioPerformance.validation.assetAndPositionRequired'),
          variant: 'destructive'
        })
        return
      }

      const isDuplicate = await PortfolioPerformanceService.checkDetailedDuplicate(
        profileId,
        editItem.institution || null,
        editItem.asset || null,
        editItem.position || 0,
        editItem.period || null,
        editItem.id // Excluir o registro atual da verificação quando estiver editando
      )

      if (isDuplicate) {
        toast({
          title: t('portfolioPerformance.validation.duplicateTitle'),
          description: t('portfolioPerformance.validation.detailedDuplicate'),
          variant: 'destructive'
        })
        return
      }
    }

    if (editingType === 'consolidated') {
      if (editItem.id) {
        await PortfolioPerformanceService.updateConsolidatedRecord(
          editItem.id,
          {
            institution: editItem.institution || null,
            period: editItem.period || null,
            report_date: editItem.report_date || null,
            initial_assets: editItem.initial_assets !== undefined && editItem.initial_assets !== null ? editItem.initial_assets : null,
            movement: editItem.movement !== undefined && editItem.movement !== null ? editItem.movement : null,
            taxes: editItem.taxes !== undefined && editItem.taxes !== null ? editItem.taxes : null,
            financial_gain: editItem.financial_gain !== undefined && editItem.financial_gain !== null ? editItem.financial_gain : null,
            final_assets: editItem.final_assets !== undefined && editItem.final_assets !== null ? editItem.final_assets : null,
            yield: editItem.yield || null
          }
        )
        toast({
          title: t('portfolioPerformance.validation.updateSuccess'),
        })
      } else {
        await PortfolioPerformanceService.createConsolidatedRecord({
          profile_id: profileId,
          institution: editItem.institution || null,
          period: editItem.period || null,
          report_date: editItem.report_date || null,
          initial_assets: editItem.initial_assets || null,
          movement: editItem.movement || null,
          taxes: editItem.taxes || null,
          financial_gain: editItem.financial_gain || null,
          final_assets: editItem.final_assets || null,
          yield: editItem.yield || null
        })
        toast({
          title: t('portfolioPerformance.validation.createSuccess'),
        })
      }
    } else {
      if (editItem.id) {
        await PortfolioPerformanceService.updateDetailedRecord(
          editItem.id,
          {
            institution: editItem.institution || null,
            period: editItem.period || null,
            report_date: editItem.report_date || null,
            asset: editItem.asset || null,
            issuer: editItem.issuer || null,
            asset_class: editItem.asset_class || null,
            position: editItem.position !== undefined && editItem.position !== null ? editItem.position : null,
            rate: editItem.rate || null,
            maturity_date: editItem.maturity_date || null,
            yield: editItem.yield || null
          }
        )
        toast({
          title: t('portfolioPerformance.validation.updateSuccess'),
        })
      } else {
        await PortfolioPerformanceService.createDetailedRecord({
          profile_id: profileId,
          institution: editItem.institution || null,
          period: editItem.period || null,
          report_date: editItem.report_date || null,
          asset: editItem.asset || null,
          issuer: editItem.issuer || null,
          asset_class: editItem.asset_class || null,
          position: editItem.position || null,
          rate: editItem.rate || null,
          maturity_date: editItem.maturity_date || null,
          yield: editItem.yield || null
        })
        toast({
          title: t('portfolioPerformance.validation.createSuccess'),
        })
      }
    }

    onClose()
    onSuccess()
  } catch (error) {
    console.error('Error saving record:', error)
    toast({
      title: t('portfolioPerformance.validation.saveError'),
      description: error instanceof Error ? error.message : t('portfolioPerformance.validation.unknownError'),
      variant: 'destructive'
    })
  }
}

interface DeleteRowParams {
  type: 'consolidated' | 'detailed'
  id: string
  toast: (options: { title: string; description?: string; variant?: 'default' | 'destructive' }) => void
  t: (key: string, options?: Record<string, unknown>) => string
  onSuccess: () => void
}

export async function handleDeleteRow({
  type,
  id,
  toast,
  t,
  onSuccess
}: DeleteRowParams): Promise<void> {
  try {
    if (type === 'consolidated') {
      await PortfolioPerformanceService.deleteConsolidatedRecord(id)
    } else {
      await PortfolioPerformanceService.deleteDetailedRecord(id)
    }
    toast({
      title: t('portfolioPerformance.dataManagement.delete.success'),
    })
    onSuccess()
  } catch (error) {
    toast({
      title: t('portfolioPerformance.validation.saveError'),
      description: error instanceof Error ? error.message : t('portfolioPerformance.validation.unknownError'),
      variant: 'destructive'
    })
  }
}

interface DeleteSelectedParams {
  tab: 'consolidated' | 'detailed'
  selectedIds: Set<string>
  toast: (options: { title: string; description?: string; variant?: 'default' | 'destructive' }) => void
  t: (key: string, options?: Record<string, unknown>) => string
  onSuccess: () => void
  onClearSelection: () => void
}

export async function handleDeleteSelected({
  tab,
  selectedIds,
  toast,
  t,
  onSuccess,
  onClearSelection
}: DeleteSelectedParams): Promise<void> {
  if (selectedIds.size === 0) return

  try {
    const ids = Array.from(selectedIds)

    if (tab === 'consolidated') {
      await PortfolioPerformanceService.deleteMultipleConsolidatedRecords(ids)
    } else {
      await PortfolioPerformanceService.deleteMultipleDetailedRecords(ids)
    }

    toast({
      title: t('portfolioPerformance.dataManagement.delete.successMultiple', { count: ids.length }),
    })

    onClearSelection()
    onSuccess()
  } catch (error) {
    toast({
      title: t('portfolioPerformance.validation.saveError'),
      description: error instanceof Error ? error.message : t('portfolioPerformance.validation.unknownError'),
      variant: 'destructive'
    })
  }
}

export function formatCurrency(value?: number | null): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(Number(value || 0))
}
