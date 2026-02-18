'use client'

import { useTranslation } from 'react-i18next'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

function IconLanguages({ className }: { className?: string }) {
  return (
    <svg className={cn('size-4', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="m2 5 6 6" />
      <path d="M12 4v16" />
      <path d="M17 4v16" />
      <path d="M17 12h7" />
      <path d="M17 12a5 5 0 0 0 0 10" />
      <path d="M17 12a5 5 0 0 1 0 10" />
    </svg>
  )
}

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const handleToggle = () => {
    const next = i18n.language === 'pt-BR' ? 'en-US' : 'pt-BR'
    i18n.changeLanguage(next)
  }

  const abbreviation = i18n.language === 'pt-BR' ? 'PT' : 'EN'

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleToggle}
            aria-label={t('common.language.tooltip', { defaultValue: 'Alternar idioma' })}
            className={cn(
              'group inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-2 py-1 shadow transition-all backdrop-blur',
              'hover:px-3'
            )}
          >
            <span
              className={cn(
                'relative flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors',
                'group-hover:bg-primary group-hover:text-primary-foreground'
              )}
            >
              <IconLanguages className="h-4 w-4" />
            </span>
            <span
              className={cn(
                'flex-1 overflow-hidden text-xs font-semibold uppercase tracking-wider text-foreground transition-all',
                'max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100'
              )}
            >
              {abbreviation}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>
          {t('common.language.tooltip', { defaultValue: 'Alternar idioma' })}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
