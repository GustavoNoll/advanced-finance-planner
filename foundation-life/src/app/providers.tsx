'use client'

import { ReactNode, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { ThemeProvider } from '@/contexts/theme-context'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

export function Providers({ children }: { children: ReactNode }) {
  const [instance] = useState(() => i18n)

  return (
    <ThemeProvider>
      <TooltipProvider>
        <I18nextProvider i18n={instance}>
          {children}
          <ThemeToggle />
          <LanguageSwitcher />
        </I18nextProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

