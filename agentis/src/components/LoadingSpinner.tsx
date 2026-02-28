import { cn } from '../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
}

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div
        className={cn(
          'rounded-full border-violet-500 border-t-transparent animate-spin',
          sizeMap[size]
        )}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}
