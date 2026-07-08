import { useState } from 'react'

export interface Todo {
  id: number
  title: string
  description: string
  dueDate: string
  completed: boolean
}

function toDateStr(daysOffset: number): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + daysOffset)
  return d.toISOString().split('T')[0]
}

const SAMPLE_TODOS: Todo[] = [
  { id: 1, title: '프로젝트 기획서 작성', description: '다음 분기 프로젝트 기획서를 작성하고 팀장에게 제출한다.', dueDate: toDateStr(0), completed: false },
  { id: 2, title: '주간 회의 준비', description: '이번 주 진행 상황 정리 및 발표 자료 준비.', dueDate: toDateStr(0), completed: true },
  { id: 3, title: '코드 리뷰', description: 'PR #42 리뷰 완료 후 피드백 남기기.', dueDate: toDateStr(2), completed: false },
  { id: 4, title: '디자인 시안 검토', description: 'UI/UX 팀에서 받은 디자인 시안을 검토하고 의견 전달.', dueDate: toDateStr(5), completed: false },
  { id: 5, title: '분기 보고서 제출', description: '3분기 실적 보고서 작성 및 제출.', dueDate: toDateStr(10), completed: false },
]

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(SAMPLE_TODOS)

  function toggleComplete(id: number) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function updateTodo(updated: Todo) {
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function addTodo(title: string): Todo {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description: '',
      dueDate: toDateStr(0),
      completed: false,
    }
    setTodos(prev => [newTodo, ...prev])
    return newTodo
  }

  return { todos, toggleComplete, updateTodo, deleteTodo, addTodo }
}
