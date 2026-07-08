import { useState } from 'react'
import TodoItem from './TodoItem'

export default function TodoList({ todos, selectedTodo, activeFilter, onToggle, onSelect, onAdd }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [completionFilter, setCompletionFilter] = useState('전체')

  const todayStr = new Date().toISOString().split('T')[0]
  const in7Days = new Date()
  in7Days.setDate(in7Days.getDate() + 7)
  const in7DaysStr = in7Days.toISOString().split('T')[0]

  const filtered = todos.filter(t => {
    if (activeFilter === '오늘' && t.dueDate !== todayStr) return false
    if (activeFilter === '다음7일' && (t.dueDate < todayStr || t.dueDate > in7DaysStr)) return false
    if (completionFilter === '미완료' && t.completed) return false
    if (completionFilter === '완료' && !t.completed) return false
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="todo-list-panel">
      <div className="todo-list-header">
        <h3>{activeFilter}</h3>
        <div className="todo-controls">
          <input
            className="search-input"
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select
            className="filter-select"
            value={completionFilter}
            onChange={e => setCompletionFilter(e.target.value)}
          >
            <option>전체</option>
            <option>미완료</option>
            <option>완료</option>
          </select>
        </div>
      </div>

      <div className="todo-items">
        {filtered.length === 0 ? (
          <div className="empty-list">할일이 없습니다.</div>
        ) : (
          filtered.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isSelected={selectedTodo?.id === todo.id}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))
        )}
      </div>

      <button className="add-btn" onClick={onAdd}>+ 새 할일 추가</button>
    </div>
  )
}
