'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_SECTIONS = [
  { key: 'projecao' as const, label: 'Projeção', icon: IconChart },
  { key: 'insights' as const, label: 'Insights', icon: IconLightbulb },
  { key: 'tabela' as const, label: 'Tabela anual', icon: IconTable },
] as const

const EDIT_SECTIONS = [
  { key: 'you' as const, label: 'Você hoje', icon: IconUser },
  { key: 'aposentadoria' as const, label: 'Aposentadoria', icon: IconPension },
  { key: 'microPlans' as const, label: 'Micro planos', icon: IconLayers },
  { key: 'events' as const, label: 'Eventos', icon: IconCalendar },
  { key: 'configuracoes' as const, label: 'Configurações', icon: IconSliders },
] as const

const iconClass = 'size-4 shrink-0 text-muted-foreground'

function IconChart({ className }: { className?: string }) {
  return (
    <svg className={cn(iconClass, className)} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function IconLightbulb({ className }: { className?: string }) {
  return (
    <svg className={cn(iconClass, className)} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}

function IconTable({ className }: { className?: string }) {
  return (
    <svg className={cn(iconClass, className)} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </svg>
  )
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={cn(iconClass, className)} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconSliders({ className }: { className?: string }) {
  return (
    <svg className={cn(iconClass, className)} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

function IconLayers({ className }: { className?: string }) {
  return (
    <svg className={cn(iconClass, className)} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
    </svg>
  )
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={cn(iconClass, className)} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function IconPension({ className }: { className?: string }) {
  return (
    <svg className={cn(iconClass, className)} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

export type SidebarKey = 'projecao' | 'insights' | 'tabela' | 'you' | 'aposentadoria' | 'microPlans' | 'events' | 'configuracoes'

/** @deprecated Use SidebarKey */
export type EditSectionKey = SidebarKey

function IconChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={cn('size-4', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg className={cn('size-4', className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

interface EditSidebarProps {
  onSelect: (key: SidebarKey) => void
  className?: string
  /** Mobile: render as overlay when true */
  isOverlay?: boolean
  onCloseOverlay?: () => void
}

export function EditSidebar({ onSelect, className, isOverlay, onCloseOverlay }: EditSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const isMinimizable = !isOverlay

  const content = (
    <aside
      className={cn(
        'flex flex-col gap-1.5 rounded-md border border-border bg-muted/30 py-1 transition-[width] duration-200',
        isOverlay && 'w-full min-w-0',
        !isOverlay && collapsed && 'w-11 px-1',
        !isOverlay && !collapsed && 'w-52 px-1.5',
        className
      )}
    >
      {isMinimizable && (
        <div className="flex items-center justify-end px-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
          </Button>
        </div>
      )}
      <div>
        {(!isMinimizable || !collapsed) && (
          <p className="mb-0.5 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Conteúdo</p>
        )}
        {NAV_SECTIONS.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 text-xs',
              isMinimizable && collapsed ? 'w-full justify-center px-0' : 'w-full justify-start gap-2 px-1.5'
            )}
            onClick={() => {
              onSelect(key)
              onCloseOverlay?.()
            }}
          >
            <Icon />
            {(!isMinimizable || !collapsed) && <span>{label}</span>}
          </Button>
        ))}
      </div>
      <div className="border-t border-border pt-1.5">
        {(!isMinimizable || !collapsed) && (
          <p className="mb-0.5 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Editar dados</p>
        )}
        {EDIT_SECTIONS.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 text-xs',
              isMinimizable && collapsed ? 'w-full justify-center px-0' : 'w-full justify-start gap-2 px-1.5'
            )}
            onClick={() => {
              onSelect(key)
              onCloseOverlay?.()
            }}
          >
            <Icon />
            {(!isMinimizable || !collapsed) && <span>{label}</span>}
          </Button>
        ))}
      </div>
    </aside>
  )

  if (isOverlay) {
    return (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onCloseOverlay}
          aria-hidden
        />
        <div className="fixed left-0 top-0 z-50 h-full w-[200px] border-r border-border bg-background p-3 pt-20 shadow-xl md:hidden">
          {content}
        </div>
      </>
    )
  }

  return content
}
