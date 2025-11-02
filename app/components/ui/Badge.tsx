import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning'
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-neopets-blue text-white border-2 border-white',
    primary: 'bg-neopets-blue text-white border-2 border-white',
    success: 'bg-neopets-green text-white border-2 border-white',
    warning: 'bg-neopets-yellow text-gray-800 border-2 border-white',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
