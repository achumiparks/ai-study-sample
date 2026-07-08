import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useTodos } from '@/hooks/useTodos'
import type { Todo } from '@/hooks/useTodos'
import type { FilterKey } from './sections'
import { Row } from '@/components/primitives'
import TodoListPanel from '@/components/panels/TodoListPanel'
import TodoDetailPanel from '@/components/panels/TodoDetailPanel'

export default function TodosView() {
  const { t } = useTranslation('todos')
  const [searchParams] = useSearchParams()
  const { todos, toggleComplete, updateTodo, deleteTodo, addTodo } = useTodos()
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)

  const activeFilter = (searchParams.get('filter') as FilterKey) ?? 'all'

  function handleAdd() {
    const newTodo = addTodo(t('newTodo'))
    setSelectedTodo(newTodo)
  }

  function handleSave(updated: Todo) {
    updateTodo(updated)
    setSelectedTodo(updated)
  }

  function handleDelete(id: number) {
    deleteTodo(id)
    setSelectedTodo(null)
  }

  return (
    <Row className="flex-1 overflow-hidden">
      <TodoListPanel
        todos={todos}
        activeFilter={activeFilter}
        selectedId={selectedTodo?.id ?? null}
        onToggle={toggleComplete}
        onSelect={setSelectedTodo}
        onAdd={handleAdd}
      />
      <TodoDetailPanel
        todo={selectedTodo}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </Row>
  )
}
