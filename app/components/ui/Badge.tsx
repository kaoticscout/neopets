import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning'
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variants = {
    default:
      'bg-gradient-to-r from-neopets-lightBlue to-neopets-blue text-white border-2 border-white',
    primary:
      'bg-gradient-to-r from-neopets-blue to-neopets-lightBlue text-white border-2 border-white',
    success:
      'bg-gradient-to-r from-neopets-green to-neopets-lightGreen text-white border-2 border-white',
    warning:
      'bg-gradient-to-r from-neopets-yellow to-neopets-lightYellow text-gray-800 border-2 border-white',
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
