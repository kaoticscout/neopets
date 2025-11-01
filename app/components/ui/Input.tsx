import { InputHTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-bubble border-[3px] border-neopets-blue bg-white px-4 py-2 font-semibold text-gray-800 focus:border-neopets-lightBlue focus:outline-none focus:ring-4 focus:ring-neopets-lightBlue',
        className
      )}
      {...props}
    />
  )
}
