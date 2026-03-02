import { useTranslation } from 'react-i18next'
import { MultiSelect } from '@/shared/components/ui/multi-select'
import type { ClientOption } from '../types/client-comparison'

const MAX_SELECTABLE = 4

interface ClientComparisonSelectorProps {
  options: ClientOption[]
  value: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
}

export function ClientComparisonSelector({
  options,
  value,
  onChange,
  disabled,
}: ClientComparisonSelectorProps) {
  const { t } = useTranslation()

  const multiSelectOptions = options.map((o) => ({
    value: o.id,
    label: o.name,
  }))

  const handleChange = (ids: string[]) => {
    if (ids.length <= MAX_SELECTABLE) {
      onChange(ids)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {t('clientComparison.selectClients')}
      </label>
      <MultiSelect
        options={multiSelectOptions}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={t('clientComparison.selectPlaceholder')}
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t('clientComparison.maxClients', { max: MAX_SELECTABLE })}
      </p>
    </div>
  )
}
