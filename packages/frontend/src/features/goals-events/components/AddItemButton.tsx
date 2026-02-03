import { Button } from "@/shared/components/ui/button"
import { Plus } from "lucide-react"

interface AddItemButtonProps {
  onClick: () => void
  label: string
}

export function AddItemButton({ onClick, label }: AddItemButtonProps) {
  return (
    <Button 
      variant="ghost"
      onClick={onClick}
      className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-card to-muted hover:from-accent hover:to-accent/60 shadow-sm hover:shadow transition-all duration-200 border border-border"
    >
      <div className="flex items-center gap-2">
        <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
    </Button>
  )
}
