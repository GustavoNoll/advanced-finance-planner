import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";
import { useTranslation } from "react-i18next";
import { Logo } from "./logo";

interface LoadingScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function LoadingScreen({ 
  className, 
  ...props 
}: LoadingScreenProps) {
  const { t } = useTranslation();
  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-50",
        className
      )} 
      {...props}
    >
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <Spinner 
            size="lg" 
            className="border-t-primary/80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/10" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <Logo variant="full" />
          <p className="text-sm text-gray-500">{t('common.loading')}</p>
        </div>
      </div>
    </div>
  );
} 