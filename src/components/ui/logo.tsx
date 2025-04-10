import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: 'full' | 'minimal';
  className?: string;
}

export function Logo({ variant = 'full', className }: LogoProps) {
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <img 
          src="/images/logoCropped.png" 
          alt="Logo" 
          className={cn(
            "object-contain",
            variant === 'full' ? "h-50" : "h-10"
          )}
        />
      </div>
    </div>
  );
} 