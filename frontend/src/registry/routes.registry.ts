import { lazy } from 'react'
import type { RouteEntry } from './types'

export const routeRegistry: RouteEntry[] = [
  {
    path: '/todos',
    title: 'Todos',
    category: 'main',
    layout: 'console',
    component: lazy(() => import('@/pages/todos/TodosPage')),
    file: 'pages/todos/TodosPage.tsx',
  },
]
