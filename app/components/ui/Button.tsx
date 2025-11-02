import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-bold rounded-bubble transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-neopets hover:shadow-neopets-lg'

  const variants = {
    primary: 'bg-neopets-blue text-white border-2 border-white hover:bg-neopets-lightBlue',
    secondary: 'bg-neopets-pink text-white border-2 border-white hover:bg-neopets-lightPink',
    outline:
      'bg-white border-3 border-neopets-blue text-neopets-blue hover:bg-neopets-lightBlue hover:text-white',
    ghost:
      'bg-white/80 hover:bg-white text-neopets-blue border-2 border-transparent hover:border-neopets-blue',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}
