import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Todo } from '@/hooks/useTodos'
import type { FilterKey } from '@/pages/todos/sections'
import { Box, Stack, Row, Text } from '@/components/primitives'
import { TextField, Select, Checkbox, Button } from '@/components/atoms'

interface TodoListPanelProps {
  todos: Todo[]
  activeFilter: FilterKey
  selectedId: number | null
  onToggle: (id: number) => void
  onSelect: (todo: Todo) => void
  onAdd: () => void
}

export default function TodoListPanel({
  todos,
  activeFilter,
  selectedId,
  onToggle,
  onSelect,
  onAdd,
}: TodoListPanelProps) {
  const { t } = useTranslation(['common', 'todos'])
  const [search, setSearch] = useState('')
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'incomplete'>('all')

  const todayStr = new Date().toISOString().split('T')[0]
  const in7Days = new Date()
  in7Days.setDate(in7Days.getDate() + 7)
  const in7DaysStr = in7Days.toISOString().split('T')[0]

  const filtered = todos.filter(t => {
    if (activeFilter === 'today' && t.dueDate !== todayStr) return false
    if (activeFilter === 'next7days' && (t.dueDate < todayStr || t.dueDate > in7DaysStr)) return false
    if (completionFilter === 'incomplete' && t.completed) return false
    if (completionFilter === 'completed' && !t.completed) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const completionOptions = [
    { value: 'all', label: t('all') },
    { value: 'incomplete', label: t('incomplete') },
    { value: 'completed', label: t('completed') },
  ]

  return (
    <Stack className="flex-1 overflow-hidden border-r border-gray-200">
      {/* Header */}
      <Box className="px-5 py-4 border-b border-gray-200 flex-shrink-0">
        <Row gap={2} align="center">
          <TextField
            placeholder={t('todos:searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1"
          />
          <Select
            options={completionOptions}
            value={completionFilter}
            onChange={e => setCompletionFilter(e.target.value as typeof completionFilter)}
          />
        </Row>
      </Box>

      {/* List */}
      <Box className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <Box className="p-10 text-center">
            <Text variant="caption">{t('empty')}</Text>
          </Box>
        ) : (
          filtered.map(todo => {
            const isOverdue = !todo.completed && todo.dueDate < todayStr
            const isSelected = selectedId === todo.id

            return (
              <Row
                key={todo.id}
                gap={3}
                align="start"
                className={`
                  px-5 py-3 border-b border-gray-100 cursor-pointer transition-colors
                  ${isSelected ? 'bg-blue-50 border-l-[3px] border-l-blue-500' : 'hover:bg-gray-50'}
                  ${todo.completed ? 'opacity-60' : ''}
                `}
                onClick={() => onSelect(todo)}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={e => {
                    e.stopPropagation()
                    onToggle(todo.id)
                  }}
                  onClick={e => e.stopPropagation()}
                />
                <Stack gap={1} className="flex-1 min-w-0">
                  <Text
                    variant="body"
                    className={`font-medium truncate ${todo.completed ? 'line-through text-gray-400' : ''}`}
                  >
                    {todo.title}
                  </Text>
                  {todo.dueDate && (
                    <Text variant="caption" className={isOverdue ? 'text-red-500' : ''}>
                      {isOverdue ? t('todos:overduePrefix') : t('todos:duePrefix')}{todo.dueDate}
                    </Text>
                  )}
                </Stack>
              </Row>
            )
          })
        )}
      </Box>

      {/* Add button */}
      <Box className="p-4 flex-shrink-0 border-t border-gray-100">
        <Button variant="primary" fullWidth onClick={onAdd}>
          {t('todos:addTodo')}
        </Button>
      </Box>
    </Stack>
  )
}
