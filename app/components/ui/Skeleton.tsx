import { HTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded bg-gray-200', className)} {...props} />
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
