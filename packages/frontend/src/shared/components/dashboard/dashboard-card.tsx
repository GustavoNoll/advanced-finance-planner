// 1. Imports externos
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

// 2. Imports internos (shared)
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { cn } from '@/lib/utils'

// 3. Types
interface DashboardCardProps {
  title: ReactNode
  children: ReactNode
  className?: string
  icon?: LucideIcon
  headerActions?: ReactNode
}

// 4. Component
export function DashboardCard({ title, children, className, icon: Icon, headerActions }: DashboardCardProps) {
  return (
    <Card className={cn("investment-card bg-card text-card-foreground border border-border", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            {Icon && <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {title}
          </CardTitle>
          {headerActions && (
            <div className="flex items-center">
              {headerActions}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}