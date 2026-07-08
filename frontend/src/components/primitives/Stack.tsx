import type { HTMLAttributes, ReactNode } from 'react'

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number
  children?: ReactNode
}

export default function Stack({ gap = 0, className = '', children, ...props }: StackProps) {
  return (
    <div className={`flex flex-col gap-${gap} ${className}`} {...props}>
      {children}
    </div>
  )
}
