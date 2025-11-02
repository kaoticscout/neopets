import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  // If comic-card class is present, don't add bubble (comic-card has its own styling)
  // Also use overflow-visible for comic-cards so rarity stickers aren't clipped
  const isComicCard = className?.includes('comic-card')

  return (
    <div
      className={cn(
        !isComicCard && 'bubble',
        isComicCard ? 'overflow-visible' : 'overflow-hidden',
        'rounded-big transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('p-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('p-4 pt-0', className)} {...props}>
      {children}
    </div>
  )
}
