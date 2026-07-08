import type { ElementType, HTMLAttributes, ReactNode } from 'react'

interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  children?: ReactNode
}

export default function Box({ as: Tag = 'div', className = '', children, ...props }: BoxProps) {
  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  )
}
