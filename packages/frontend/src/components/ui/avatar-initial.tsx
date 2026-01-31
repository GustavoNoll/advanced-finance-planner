import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface AvatarProps {
  initial?: string
  icon?: LucideIcon
  size?: 'sm' | 'md' | 'lg'
  variant?: 'rounded' | 'square'
  className?: string
  iconClassName?: string
  color?: 'gray' | 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'bluePrimary'
}

const colorClasses = {
  gray: {
    container: 'bg-gray-50 ring-gray-100',
    icon: 'text-gray-600'
  },
  green: {
    container: 'bg-green-50 ring-green-100',
    icon: 'text-green-600'
  },
  blue: {
    container: 'bg-blue-50 ring-blue-100',
    icon: 'text-blue-600'
  },
  red: {
    container: 'bg-red-50 ring-red-100',
    icon: 'text-red-600'
  },
  yellow: {
    container: 'bg-yellow-50 ring-yellow-100',
    icon: 'text-yellow-600'
  },
  purple: {
    container: 'bg-purple-50 ring-purple-100',
    icon: 'text-purple-600'
  },
  bluePrimary: {
    container: 'bg-blue-50 ring-blue-100',
    icon: 'text-blue-600'
  }
}

/**
 * Displays a circular or square avatar with an initial or icon inside
 * @param {string} [initial] - The initial to display inside the avatar
 * @param {LucideIcon} [icon] - Optional icon to display instead of initial
 * @param {'sm' | 'md' | 'lg'} [size='md'] - Size of the avatar
 * @param {'rounded' | 'square'} [variant='rounded'] - Shape of the avatar
 * @param {'gray' | 'green' | 'blue' | 'red' | 'yellow' | 'purple'} [color='gray'] - Color theme of the avatar
 * @param {string} [className] - Additional CSS classes to apply to the container
 * @param {string} [iconClassName] - Additional CSS classes to apply to the icon
 */
export function Avatar({ 
  initial, 
  icon: Icon,
  size = 'md',
  variant = 'rounded',
  color = 'gray',
  className,
  iconClassName
}: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const roundedClass = variant === 'rounded' ? 'rounded-full' : 'rounded-xl'
  const colorTheme = colorClasses[color]

  return (
    <div 
      className={cn(
        `${sizeClasses[size]} ${roundedClass} flex items-center justify-center ring-2`,
        colorTheme.container,
        className
      )}
    >
      {Icon ? (
        <Icon className={cn(colorTheme.icon, iconClassName)} />
      ) : (
        <span className={cn('text-sm font-semibold', colorTheme.icon)}>
          {initial?.toUpperCase()}
        </span>
      )}
    </div>
  )
} 