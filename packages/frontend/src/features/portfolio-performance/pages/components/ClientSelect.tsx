import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { SelectWithSearch, type SelectOption } from "@/shared/components/ui/select-with-search"
import type { UserProfileInvestment } from "@/types/broker-dashboard"

interface ClientSelectProps {
  clients?: UserProfileInvestment[]
  options?: SelectOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  error?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
}

export function ClientSelect({
  clients = [],
  options,
  value,
  onValueChange,
  placeholder,
  error,
  searchPlaceholder,
  emptyMessage,
  disabled = false
}: ClientSelectProps) {
  const { t } = useTranslation()

  const normalizedOptions: SelectOption[] = useMemo(() => {
    const baseOptions = options
      ? options
      : clients.map(client => ({
          id: client.id,
          label: client.profile_name || client.email || client.id,
          searchTerms: [
            client.profile_name || '',
            client.email || '',
            client.id
          ].filter(Boolean)
        }))

    return baseOptions.map(option => ({
      ...option,
      searchTerms: option.searchTerms && option.searchTerms.length > 0
        ? option.searchTerms
        : [option.label]
    }))
  }, [clients, options])

  const resolvedPlaceholder = placeholder
    || t('portfolioPerformance.dataManagement.importPDF.formPlaceholders.client')
  const resolvedSearchPlaceholder = searchPlaceholder || "Buscar"
  const resolvedEmptyMessage = emptyMessage
    || t('portfolioPerformance.dataManagement.importPDF.noClientFound')

  return (
    <SelectWithSearch
      options={normalizedOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={resolvedPlaceholder}
      error={error}
      searchPlaceholder={resolvedSearchPlaceholder}
      emptyMessage={resolvedEmptyMessage}
      disabled={disabled}
    />
  )
}

