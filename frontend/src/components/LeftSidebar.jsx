export default function LeftSidebar({ todos, activeFilter, onFilterChange }) {
  const todayStr = new Date().toISOString().split('T')[0]
  const in7Days = new Date()
  in7Days.setDate(in7Days.getDate() + 7)
  const in7DaysStr = in7Days.toISOString().split('T')[0]

  const counts = {
    '전체': todos.length,
    '오늘': todos.filter(t => t.dueDate === todayStr).length,
    '다음7일': todos.filter(t => t.dueDate >= todayStr && t.dueDate <= in7DaysStr).length,
  }

  const menus = ['전체', '오늘', '다음7일']

  return (
    <aside className="left-sidebar">
      <h2>My Todos</h2>
      {menus.map(menu => (
        <div
          key={menu}
          className={`menu-item${activeFilter === menu ? ' active' : ''}`}
          onClick={() => onFilterChange(menu)}
        >
          <span>{menu}</span>
          <span className="badge">{counts[menu]}</span>
        </div>
      ))}
    </aside>
  )
}
