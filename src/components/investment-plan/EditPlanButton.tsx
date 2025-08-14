import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

interface EditPlanButtonProps {
  planId: string
  t: (key: string) => string
}

export function EditPlanButton({ planId, t }: EditPlanButtonProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <Link to={`/edit-plan/${planId}`}>
          <Button 
            variant="ghost"
            className="w-full h-14 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-card to-muted hover:from-accent hover:to-accent/60 shadow-sm hover:shadow transition-all duration-200 border border-border"
          >
            <div className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-foreground">{t('dashboard.buttons.editPlan')}</span>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  )
}
