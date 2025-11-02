import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

export type RarityLevel = 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'limited-edition'

interface RarityBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  rarity: RarityLevel
  children?: ReactNode
  className?: string
}

const rarityConfig = {
  common: {
    label: 'Common',
    bg: 'bg-gray-500',
    text: 'text-white',
    glow: 'shadow-[0_0_8px_rgba(107,114,128,0.4)]',
  },
  uncommon: {
    label: 'Uncommon',
    bg: 'bg-green-500',
    text: 'text-white',
    glow: 'shadow-[0_0_8px_rgba(34,197,94,0.4)]',
  },
  rare: {
    label: 'Rare',
    bg: 'bg-blue-500',
    text: 'text-white',
    glow: 'shadow-[0_0_8px_rgba(59,130,246,0.4)]',
  },
  'ultra-rare': {
    label: 'Ultra Rare',
    bg: 'bg-purple-500',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]',
  },
  'limited-edition': {
    label: 'Limited',
    bg: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
    text: 'text-white',
    glow: 'shadow-[0_0_16px_rgba(251,191,36,0.6)]',
  },
}

export function RarityBadge({ rarity, children, className, ...props }: RarityBadgeProps) {
  const config = rarityConfig[rarity]

  return (
    <span
      className={cn('rarity-sticker', config.bg, config.text, config.glow, 'font-comic', className)}
      {...props}
    >
      {children || config.label}
    </span>
  )
}
