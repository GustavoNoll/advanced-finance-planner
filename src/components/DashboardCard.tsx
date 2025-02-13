import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: ReactNode;  // Change from string to ReactNode
  children: ReactNode;
  className?: string;
}

export const DashboardCard = ({ title, children, className }: DashboardCardProps) => {
  return (
    <Card className={cn("investment-card", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};