import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
  headerActions?: ReactNode;
}

export const DashboardCard = ({ title, children, className, icon: Icon, headerActions }: DashboardCardProps) => {
  return (
    <Card className={cn("investment-card bg-card text-card-foreground border border-border", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
            {Icon && <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
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
  );
};