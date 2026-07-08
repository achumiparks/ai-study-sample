import { useState, Suspense } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { componentRegistry } from '@/registry/components.registry'
import { Box, Row, Text } from '@/components/primitives'
import Sidebar from './Sidebar'
import PropsPanel from './PropsPanel'
import DesktopFrame from './DesktopFrame'

type ViewportWidth = '1280' | '1440' | 'fluid'

export default function DevShell() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewport, setViewport] = useState<ViewportWidth>('fluid')
  const location = useLocation()
  const navigate = useNavigate()

  const isDevRoute = location.pathname.startsWith('/dev/components')

  // 선택된 컴포넌트 entry
  const selectedEntry = selectedId?.startsWith('component:')
    ? componentRegistry.find(c => c.name === selectedId.replace('component:', ''))
    : null

  function handleNavigateToComponent(name: string) {
    const id = `component:${name}`
    setSelectedId(id)
    navigate(`/dev/components/${name}`)
  }

  return (
    <Box className="h-screen flex flex-col overflow-hidden bg-gray-900">
      {/* Top bar */}
      <Row
        align="center"
        justify="between"
        className="h-10 px-4 bg-gray-900 border-b border-gray-700 flex-shrink-0"
      >
        <Row gap={2} align="center">
          <Text variant="label" className="text-blue-400 text-[11px]">DevShell</Text>
          <Text variant="caption" className="text-gray-500">Component Catalog</Text>
        </Row>
        <button
          onClick={() => navigate('/todos')}
          className="text-xs text-gray-400 hover:text-white cursor-pointer transition-colors"
        >
          → App으로 이동
        </button>
      </Row>

      {/* Main */}
      <Row align="stretch" className="flex-1 overflow-hidden">
        <Sidebar selectedId={selectedId} onSelect={setSelectedId} />

        {isDevRoute ? (
          <>
            <Suspense fallback={<Box className="flex-1 flex items-center justify-center"><Text variant="caption">로딩 중...</Text></Box>}>
              <Outlet />
            </Suspense>
            <PropsPanel entry={selectedEntry ?? null} onNavigate={handleNavigateToComponent} />
          </>
        ) : (
          <DesktopFrame width={viewport} onWidthChange={setViewport}>
            <Suspense fallback={<Box className="flex-1 flex items-center justify-center"><Text variant="caption">로딩 중...</Text></Box>}>
              <Outlet />
            </Suspense>
          </DesktopFrame>
        )}
      </Row>
    </Box>
  )
}
