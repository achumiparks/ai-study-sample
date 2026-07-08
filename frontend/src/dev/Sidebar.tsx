import { useNavigate } from 'react-router-dom'
import { routeRegistry } from '@/registry/routes.registry'
import { componentRegistry } from '@/registry/components.registry'
import { Stack, Text } from '@/components/primitives'
import SidebarTree from './SidebarTree'
import type { TreeNode } from './SidebarTree'

// 페이지경로 → 1뎁스 구성요소 (SSOT)
const PAGE_ORGANISMS: Record<string, string[]> = {
  '/todos': ['Header', 'NavRail', 'TodosView'],
}

interface SidebarProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function Sidebar({ selectedId, onSelect }: SidebarProps) {
  const navigate = useNavigate()

  function handleSelect(id: string) {
    onSelect(id)
    if (id.startsWith('component:')) {
      // 컴포넌트 → 격리 프리뷰
      navigate(`/dev/components/${id.replace('component:', '')}`)
    } else if (id.startsWith('page:')) {
      // 페이지 → 해당 라우트로 이동 (DesktopFrame 안에서 렌더)
      navigate(id.replace('page:', ''))
    }
  }

  // Pages 트리
  const pageNodes: TreeNode[] = routeRegistry
    .filter(r => !r.hidden)
    .map(r => ({
      id: `page:${r.path}`,
      label: r.title,
      children: (PAGE_ORGANISMS[r.navPath ?? r.path] ?? []).map(name => ({
        id: `component:${name}`,
        label: name,
      })),
    }))

  // Components 트리 (카테고리별)
  const categories = ['organisms', 'panels', 'molecules', 'atoms', 'primitives'] as const
  const categoryLabels: Record<string, string> = {
    organisms: 'Organisms',
    panels: 'Panels',
    molecules: 'Molecules',
    atoms: 'Atoms',
    primitives: 'Primitives',
  }

  const componentNodes: TreeNode[] = categories
    .map(cat => {
      const entries = componentRegistry.filter(c => c.category === cat)
      if (entries.length === 0) return null
      return {
        id: `cat:${cat}`,
        label: categoryLabels[cat],
        children: entries.map(e => ({
          id: `component:${e.name}`,
          label: e.name,
          sublabel: e.file?.split('/').pop(),
          children: (e.uses ?? []).map(usedName => {
            const used = componentRegistry.find(c => c.name === usedName)
            return {
              id: `component:${usedName}`,
              label: usedName,
              sublabel: used?.file?.split('/').pop(),
            }
          }),
        })),
      }
    })
    .filter(Boolean) as TreeNode[]

  return (
    <Stack className="w-56 bg-[#1a252f] text-white flex-shrink-0 overflow-y-auto">
      {/* Pages section */}
      <Text variant="label" className="px-3 pt-4 pb-1 text-gray-400 text-[10px]">PAGES</Text>
      <SidebarTree nodes={pageNodes} selectedId={selectedId} onSelect={handleSelect} />

      {/* Components section */}
      <Text variant="label" className="px-3 pt-4 pb-1 text-gray-400 text-[10px] border-t border-white/10 mt-2">COMPONENTS</Text>
      <SidebarTree nodes={componentNodes} selectedId={selectedId} onSelect={handleSelect} />
    </Stack>
  )
}
