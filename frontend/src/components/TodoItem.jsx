export default function TodoItem({ todo, isSelected, onToggle, onSelect }) {
  const todayStr = new Date().toISOString().split('T')[0]
  const isOverdue = !todo.completed && todo.dueDate < todayStr

  function handleCheckbox(e) {
    e.stopPropagation()
    onToggle(todo.id)
  }

  return (
    <div
      className={`todo-item${isSelected ? ' selected' : ''}${todo.completed ? ' completed' : ''}`}
      onClick={() => onSelect(todo)}
    >
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={handleCheckbox}
      />
      <div className="todo-info">
        <div className="todo-title">{todo.title}</div>
        {todo.dueDate && (
          <div className={`todo-due${isOverdue ? ' overdue' : ''}`}>
            {isOverdue ? '기한 초과: ' : '마감: '}{todo.dueDate}
          </div>
        )}
      </div>
    </div>
  )
}
