import { CheckCircle2, AlertCircle, XCircle, Info, Tag, DollarSign } from 'lucide-react'
import type { VerificationResult } from '../types/portfolio-data-management.types'

interface VerificationBadgeProps {
  verification: VerificationResult
  compact?: boolean
}

export function VerificationBadge({ verification, compact = false }: VerificationBadgeProps) {
  const { status, unclassifiedCount, missingYieldCount } = verification

  const getStatusConfig = () => {
    switch (status) {
      case 'match':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        }
      case 'tolerance':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        }
      case 'mismatch':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        }
      case 'no-data':
        return {
          icon: Info,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Icon className={`h-4 w-4 ${config.color} cursor-pointer hover:opacity-70 transition-opacity`} />
        {unclassifiedCount > 0 && (
          <Tag className="h-3 w-3 text-orange-600 cursor-pointer hover:opacity-70 transition-opacity" />
        )}
        {missingYieldCount > 0 && (
          <DollarSign className="h-3 w-3 text-purple-600 cursor-pointer hover:opacity-70 transition-opacity" />
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${config.bgColor} px-2 py-1 rounded`}>
      <Icon className={`h-4 w-4 ${config.color} cursor-pointer hover:opacity-70 transition-opacity`} />
      {unclassifiedCount > 0 && (
        <Tag className="h-3 w-3 text-orange-600 cursor-pointer hover:opacity-70 transition-opacity" />
      )}
      {missingYieldCount > 0 && (
        <DollarSign className="h-3 w-3 text-purple-600 cursor-pointer hover:opacity-70 transition-opacity" />
      )}
    </div>
  )
}

