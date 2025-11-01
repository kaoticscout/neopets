'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../../lib/utils'

const links = [
  { href: '/', label: 'Home' },
  { href: '/pets', label: 'Pets' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4">
      {links.map((link) => {
        const isActive =
          pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'transform rounded-bubble px-4 py-2 text-sm font-bold transition-all duration-300 hover:scale-110',
              isActive
                ? 'bg-gradient-to-r from-neopets-blue to-neopets-lightBlue text-white shadow-neopets'
                : 'border-[2px] border-neopets-blue bg-white/80 text-neopets-blue hover:bg-neopets-lightBlue hover:text-white'
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
