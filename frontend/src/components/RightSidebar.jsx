import { useState, useEffect } from 'react'

export default function RightSidebar({ todo, onSave, onDelete }) {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' })

  useEffect(() => {
    if (todo) {
      setForm({ title: todo.title, description: todo.description, dueDate: todo.dueDate })
    }
  }, [todo])

  if (!todo) {
    return (
      <aside className="right-sidebar">
        <div className="empty-detail">
          <p>할일을 선택하면</p>
          <p>상세 내용을 볼 수 있습니다.</p>
        </div>
      </aside>
    )
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSave() {
    onSave({ ...todo, ...form })
  }

  return (
    <aside className="right-sidebar">
      <div className="detail-form">
        <h3>상세 편집</h3>

        <div className="form-group">
          <label>제목</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>설명</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>마감일</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button className="save-btn" onClick={handleSave}>저장</button>
          <button className="delete-btn" onClick={() => onDelete(todo.id)}>삭제</button>
        </div>
      </div>
    </aside>
  )
}
