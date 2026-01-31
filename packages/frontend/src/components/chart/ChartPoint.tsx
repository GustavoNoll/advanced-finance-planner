// 1. Imports externos
import { Calendar, Target, Banknote } from 'lucide-react'

// 2. Imports internos (shared)
import { eventIcons } from '@/constants/events'

interface ChartPointProps {
  type: keyof typeof eventIcons
  value: number
}

export function ChartPoint({ type, value }: ChartPointProps) {
  const getIcon = () => {
    switch (type) {
      case 'goal':
        return <Target className="h-4 w-4" />;
      case 'contribution':
        return <Banknote className="h-4 w-4" />;
      case 'other':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getIcon()}
      <span className="text-sm font-medium">
        {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </span>
    </div>
  )
} 