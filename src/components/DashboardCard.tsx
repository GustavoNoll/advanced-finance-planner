import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  icon?: LucideIcon;
}

export const DashboardCard = ({ title, children, className, icon: Icon }: DashboardCardProps) => {
  return (
    <Card className={cn("investment-card", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-blue-500" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};