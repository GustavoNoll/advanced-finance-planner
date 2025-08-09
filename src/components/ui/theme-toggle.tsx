import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

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
    } catch (_) {}
  }

  return (
    <div
      className={cn(
        'fixed z-50 bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur border px-3 py-2 shadow'
      )}
    >
      <Label htmlFor="theme-toggle" className="text-sm">Dark</Label>
      <Switch id="theme-toggle" checked={isDark} onCheckedChange={onToggle} />
    </div>
  )
}


