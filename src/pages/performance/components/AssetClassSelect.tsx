import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { SelectWithSearch, type SelectOption } from "@/components/ui/select-with-search"
import { VALID_ASSET_CLASSES } from "../utils/valid-asset-classes"

interface AssetClassSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  error?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
}

export function AssetClassSelect({
  value,
  onValueChange,
  placeholder,
  error,
  searchPlaceholder,
  emptyMessage,
  disabled = false,
  className
}: AssetClassSelectProps) {
  const { t } = useTranslation()

  const options: SelectOption[] = useMemo(() => {
    return VALID_ASSET_CLASSES.map(assetClassKey => {
      // Todas as traduções estão em portfolioPerformance.common.*
      const translatedLabel = t(`portfolioPerformance.common.${assetClassKey}`, {
        defaultValue: assetClassKey
      })
      
      return {
        id: assetClassKey, // Chave padronizada (salva no banco)
        label: translatedLabel, // Tradução para exibição
        searchTerms: [
          assetClassKey.toLowerCase(),
          translatedLabel.toLowerCase(),
          assetClassKey.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), // sem acentos
          translatedLabel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), // tradução sem acentos
          ...assetClassKey.split('_').map(word => word.toLowerCase()),
          ...translatedLabel.split(' ').map(word => word.toLowerCase()),
          ...translatedLabel.split(' - ').map(part => part.toLowerCase())
        ]
      }
    })
  }, [t])

  const resolvedPlaceholder = placeholder
    || t('portfolioPerformance.dataManagement.editDialog.assetClassLabel')
  const resolvedSearchPlaceholder = searchPlaceholder || t('common.search')
  const resolvedEmptyMessage = emptyMessage
    || t('common.noResults')

  return (
    <SelectWithSearch
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={resolvedPlaceholder}
      error={error}
      searchPlaceholder={resolvedSearchPlaceholder}
      emptyMessage={resolvedEmptyMessage}
      disabled={disabled}
      className={className}
      triggerClassName="h-12"
    />
  )
}

