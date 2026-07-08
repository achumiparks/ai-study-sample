import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useTodos } from '@/hooks/useTodos'
import type { FilterKey } from './sections'
import { TODO_FILTERS } from './sections'
import { Stack } from '@/components/primitives'
import TopAppBar from '@/components/chrome/TopAppBar'
import NavRail from '@/components/chrome/NavRail'
import type { NavSection } from '@/components/chrome/NavRail'
import TodosView from './TodosView'

export default function TodosPage() {
  const { t } = useTranslation(['common', 'todos'])
  const [searchParams, setSearchParams] = useSearchParams()
  const { todos } = useTodos()

  const activeFilter = (searchParams.get('filter') as FilterKey) ?? 'all'

  function handleFilterChange(key: string) {
    const next = new URLSearchParams(searchParams)
    next.set('filter', key)
    setSearchParams(next)
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const in7Days = new Date()
  in7Days.setDate(in7Days.getDate() + 7)
  const in7DaysStr = in7Days.toISOString().split('T')[0]

  const badgeCounts: Record<FilterKey, number> = {
    all: todos.length,
    today: todos.filter(t => t.dueDate === todayStr).length,
    next7days: todos.filter(t => t.dueDate >= todayStr && t.dueDate <= in7DaysStr).length,
  }

  const navSections: NavSection[] = TODO_FILTERS.map(f => ({
    key: f.key,
    label: t(f.i18nKey),
    badge: badgeCounts[f.key],
  }))

  return (
    <Stack className="h-full overflow-hidden">
      <TopAppBar title={t('todos:appTitle')} />
      <div className="flex flex-1 overflow-hidden">
        <NavRail
          sections={navSections}
          activeKey={activeFilter}
          onSelect={handleFilterChange}
        />
        <TodosView />
      </div>
    </Stack>
  )
}
