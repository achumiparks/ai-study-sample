import type { ElementType, HTMLAttributes, ReactNode } from 'react'

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label'

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  variant?: TextVariant
  children?: ReactNode
}

const variantStyles: Record<TextVariant, string> = {
  h1: 'text-2xl font-bold text-gray-900',
  h2: 'text-xl font-bold text-gray-900',
  h3: 'text-lg font-semibold text-gray-800',
  body: 'text-sm text-gray-700',
  caption: 'text-xs text-gray-500',
  label: 'text-xs font-semibold uppercase tracking-wide text-gray-600',
}

const defaultTag: Record<TextVariant, ElementType> = {
  h1: 'h1', h2: 'h2', h3: 'h3', body: 'p', caption: 'span', label: 'span',
}

export default function Text({
  as,
  variant = 'body',
  className = '',
  children,
  ...props
}: TextProps) {
  const Tag = as ?? defaultTag[variant]
  return (
    <Tag className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
