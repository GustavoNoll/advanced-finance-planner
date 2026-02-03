import { Link } from "react-router-dom"
import { Button } from "@/shared/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface GoalsEventsHeaderProps {
  title: string
  userId?: string
}

export function GoalsEventsHeader({ title, userId }: GoalsEventsHeaderProps) {
  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="w-1/3">
            <Link to={userId ? `/client/${userId}` : "/"}>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          </div>

          <div className="w-1/3" />
        </div>
      </div>
    </header>
  )
}
