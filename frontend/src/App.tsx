import { useEffect, useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useAppMode } from '@/app/hooks/useAppMode'
import { createAppRouter } from '@/app/router'

type Router = ReturnType<typeof createBrowserRouter>

export default function App() {
  const mode = useAppMode()
  const [router, setRouter] = useState<Router | null>(null)

  useEffect(() => {
    createAppRouter(mode).then(setRouter)
  }, [mode])

  if (!router) return null

  return <RouterProvider router={router} />
}
