interface LogoProps {
  variant?: 'full' | 'minimal'
  className?: string
}

export function Logo({ variant = 'full', className }: LogoProps) {
  const sizeClass = variant === 'full' ? 'h-10 md:h-12' : 'h-8'

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <svg
        viewBox="0 0 500 120"
        className={sizeClass}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Símbolo Foundation - roxo */}
        <g fill="#6366F1" transform="translate(10, 0)">
          <rect x="40" y="35" width="10" height="65" rx="5" />
          <rect x="60" y="35" width="25" height="10" rx="5" />
          <rect x="20" y="60" width="65" height="10" rx="5" />
          <rect x="20" y="90" width="65" height="10" rx="5" />
        </g>

        {/* Texto "foundation" em branco/roxo suave (pensado para fundo escuro) */}
        <text
          x="130"
          y="78"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="40"
          fontWeight="500"
          fill="#E5E7EB"
        >
          foundation
        </text>

        {/* Texto "life" em verde para destacar o produto */}
        <text
          x="335"
          y="78"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="40"
          fontWeight="600"
          fill="#22C55E"
        >
          life
        </text>
      </svg>
    </div>
  )
}

