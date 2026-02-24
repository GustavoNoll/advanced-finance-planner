'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CollapsibleCardProps {
  title: string
  description?: string
  defaultOpen?: boolean
  /** When provided, card is controlled by parent (e.g. sidebar). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
}

export function CollapsibleCard({
  title,
  description,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
  className,
  headerAction,
}: CollapsibleCardProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader
        className="cursor-pointer select-none space-y-0 py-4 transition-colors hover:bg-muted/50"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground" aria-hidden>
              {open ? '▼' : '▶'}
            </span>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-0.5">{description}</CardDescription>
              )}
            </div>
          </div>
          {headerAction && (
            <div onClick={e => e.stopPropagation()}>{headerAction}</div>
          )}
        </div>
      </CardHeader>
      {open && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  )
}
