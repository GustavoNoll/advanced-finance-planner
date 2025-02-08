import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  return (
    <div role="status" {...props}>
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-gray-200",
          "border-t-primary",
          sizeClasses[size],
          className
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
} 