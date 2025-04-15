import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border bg-background px-3 py-2 text-base ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-200",
            startIcon && "pl-10",
            endIcon && "pr-10",
            error 
              ? "border-red-500 focus-visible:ring-red-500" 
              : "border-input focus-visible:ring-primary",
            className
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
