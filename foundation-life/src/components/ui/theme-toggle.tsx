'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/theme-context'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

function IconSun({ className }: { className?: string }) {
  return (
    <svg className={cn('size-4', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function IconMoon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-4', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export function ThemeToggle() {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  function onToggle() {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={t('common.theme.toggle', { defaultValue: 'Alternar tema' })}
            onClick={onToggle}
            className={cn(
              'group inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-2 py-1 shadow transition-all',
              'hover:px-3'
            )}
          >
            <span
              className={cn(
                'relative flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors'
              )}
            >
              {isDark ? (
                <IconMoon className="h-4 w-4" />
              ) : (
                <IconSun className="h-4 w-4" />
              )}
            </span>
            <span
              className={cn(
                'max-w-0 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-all duration-200',
                'group-hover:max-w-[120px] group-hover:opacity-100'
              )}
            >
              {isDark
                ? t('common.theme.dark', { defaultValue: 'Escuro' })
                : t('common.theme.light', { defaultValue: 'Claro' })}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>
          {t('common.theme.toggle', { defaultValue: 'Alternar tema' })}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
