import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import type { AppMode } from '@/app/hooks/useAppMode'
import { routeRegistry } from '@/registry/routes.registry'
import ConsoleLayout from '@/layouts/ConsoleLayout'

function buildLayoutRoutes(): RouteObject[] {
  const consoleRoutes = routeRegistry
    .filter(r => r.layout === 'console')
    .map(r => ({
      path: r.path,
      element: (
        <Suspense fallback={null}>
          <r.component />
        </Suspense>
      ),
    }))

  return [
    {
      element: <ConsoleLayout />,
      children: [
        { index: true, element: <Navigate to="/todos" replace /> },
        ...consoleRoutes,
      ],
    },
  ]
}

export async function buildRoutes(mode: AppMode): Promise<RouteObject[]> {
  const layoutRoutes = buildLayoutRoutes()

  if (mode === 'dev') {
    const { default: DevShell } = await import('@/dev/DevShell')
    const ComponentPreview = lazy(() => import('@/dev/ComponentPreview'))

    return [
      {
        element: <DevShell />,
        children: [
          ...layoutRoutes,
          {
            path: '/dev/components/:name',
            element: (
              <Suspense fallback={null}>
                <ComponentPreview />
              </Suspense>
            ),
          },
        ],
      },
    ]
  }

  return layoutRoutes
}
