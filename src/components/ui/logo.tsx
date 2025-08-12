import { useEffect, useState } from 'react'
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: 'full' | 'minimal';
  className?: string;
}

export function Logo({ variant = 'full', className }: LogoProps) {
  const [isDark, setIsDark] = useState<boolean>(
    typeof document !== 'undefined' 
      ? document.documentElement.classList.contains('dark') 
      : false
  )

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }

    updateTheme()
    window.addEventListener('themechange', updateTheme)
    return () => window.removeEventListener('themechange', updateTheme)
  }, [])
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <svg 
          viewBox="0 0 500 120" 
          className={cn(
            "object-contain",
            variant === 'full' ? "h-32" : "h-12"
          )}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Logo symbol - purple/lavender for both themes */}
          <g fill="#B794F4" transform="translate(20, 0)">
            {/* Vertical line */}
            <rect x="40" y="35" width="10" height="65" rx="5" />
            {/* Top horizontal element */}
            <rect x="60" y="35" width="25" height="10" rx="5" />
            {/* Middle horizontal line */}
            <rect x="20" y="60" width="65" height="10" rx="5" />
            {/* Bottom horizontal line */}
            <rect x="20" y="90" width="65" height="10" rx="5" />
          </g>
          
          {/* Text "foundation" - adapts to theme */}
          <text 
            x="135" 
            y="85" 
            fontFamily="Arial, sans-serif" 
            fontSize="62" 
            fontWeight="500" 
            fill={isDark ? "#E2E8F0" : "#1F2937"}
          >
            foundation
          </text>
        </svg>
      </div>
    </div>
  );
} 