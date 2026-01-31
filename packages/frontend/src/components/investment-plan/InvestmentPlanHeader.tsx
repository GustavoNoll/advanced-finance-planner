import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil } from "lucide-react"
import { InvestmentPlanWithProfile } from "@/services/investment-plan.service"

interface InvestmentPlanHeaderProps {
  plan: InvestmentPlanWithProfile | null
  userId?: string
  t: (key: string) => string
}

export function InvestmentPlanHeader({ plan, userId, t }: InvestmentPlanHeaderProps) {
  return (
    <header className="bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to={plan?.user_id ? `/client/${plan.user_id}` : "/"}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              {t('investmentPlan.details.title')}
            </h1>
          </div>
        </div>
      </div>
    </header>
  )
}
