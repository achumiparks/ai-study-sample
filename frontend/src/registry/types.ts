import type { ComponentType, LazyExoticComponent } from 'react'

export type LayoutType = 'console' | 'blank'

export interface RouteEntry {
  path: string
  title: string
  category: string
  layout: LayoutType
  component: LazyExoticComponent<ComponentType<unknown>>
  file?: string
  navPath?: string
  hidden?: boolean
  variants?: Array<{ key: string; label: string }>
}

export interface ComponentEntry {
  name: string
  category: 'primitives' | 'atoms' | 'molecules' | 'organisms' | 'panels'
  component: LazyExoticComponent<ComponentType<unknown>>
  description?: string
  uses?: string[]
  file?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sampleProps?: Record<string, any>
}
