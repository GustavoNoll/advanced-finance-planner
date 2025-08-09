import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sun, Moon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const root = document.documentElement
    setIsDark(root.classList.contains('dark'))
  }, [])

  function onToggle(next: boolean) {
    const root = document.documentElement
    setIsDark(next)
    if (next) root.classList.add('dark')
    else root.classList.remove('dark')
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next ? 'dark' : 'light' } }))
    } catch {
      // eslint-disable-next-line no-empty
    }
  }

  return (
    <div className={cn('fixed bottom-4 right-4 z-50')}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={t('common.theme.toggle', { defaultValue: 'Alternar tema' })}
            onClick={() => onToggle(!isDark)}
            className={cn(
              'group inline-flex items-center gap-2 rounded-full border bg-card/80 backdrop-blur px-2 py-1 shadow transition-all',
              'hover:px-3'
            )}
          >
            <span
              className={cn(
                'relative flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors'
              )}
            >
              {/* Icons swap */}
              {isDark ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </span>
            <span
              className={cn(
                'max-w-0 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-all duration-200',
                'group-hover:max-w-[120px] group-hover:opacity-100'
              )}
            >
              {isDark
                ? t('common.theme.dark')
                : t('common.theme.light')}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>
          {t('common.theme.toggle')}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}


