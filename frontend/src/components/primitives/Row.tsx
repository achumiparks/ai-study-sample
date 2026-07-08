import type { HTMLAttributes, ReactNode } from 'react'

interface RowProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  children?: ReactNode
}

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
}

export default function Row({
  gap = 0,
  align = 'center',
  justify = 'start',
  className = '',
  children,
  ...props
}: RowProps) {
  return (
    <div
      className={`flex flex-row gap-${gap} ${alignMap[align]} ${justifyMap[justify]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
