import { createBrowserRouter } from 'react-router-dom'
import type { AppMode } from '@/app/hooks/useAppMode'
import { buildRoutes } from './routes'

export async function createAppRouter(mode: AppMode) {
  const routes = await buildRoutes(mode)
  return createBrowserRouter(routes)
}
