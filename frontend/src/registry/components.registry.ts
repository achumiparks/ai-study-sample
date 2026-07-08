import { lazy } from 'react'
import type { ComponentEntry } from './types'

function entry(category: ComponentEntry['category']) {
  return (
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    importFn: () => Promise<{ default: React.ComponentType<any> }>,
    description?: string,
    uses?: string[],
    file?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sampleProps?: Record<string, any>,
  ): ComponentEntry => ({
    name,
    category,
    component: lazy(importFn),
    description,
    uses,
    file,
    sampleProps,
  })
}

const primitive = entry('primitives')
const atom = entry('atoms')
const organism = entry('organisms')
const panel = entry('panels')

export const componentRegistry: ComponentEntry[] = [
  // organisms (chrome)
  organism('Header', () => import('@/components/chrome/TopAppBar'), '공용 상단 헤더', [], 'chrome/TopAppBar.tsx',
    { title: 'My Todos' }),
  organism('NavRail', () => import('@/components/chrome/NavRail'), '공용 좌측 사이드바', [], 'chrome/NavRail.tsx',
    { sections: [{ key: 'all', label: '전체', badge: 5 }, { key: 'today', label: '오늘', badge: 2 }, { key: 'next7days', label: '다음 7일', badge: 3 }], activeKey: 'all', onSelect: () => {} }),
  organism('TodosView', () => import('@/pages/todos/TodosView'), '할일 메인 뷰', ['TodoListPanel', 'TodoDetailPanel'], 'pages/todos/TodosView.tsx'),

  // panels (sub-views)
  panel('TodoListPanel', () => import('@/components/panels/TodoListPanel'), '할일 목록 패널', [], 'panels/TodoListPanel.tsx',
    { todos: [{ id: 1, title: '샘플 할일', description: '설명', dueDate: new Date().toISOString().split('T')[0], completed: false }], activeFilter: 'all', selectedId: null, onToggle: () => {}, onSelect: () => {}, onAdd: () => {} }),
  panel('TodoDetailPanel', () => import('@/components/panels/TodoDetailPanel'), '할일 상세 편집 패널', [], 'panels/TodoDetailPanel.tsx',
    { todo: { id: 1, title: '샘플 할일', description: '상세 설명입니다.', dueDate: new Date().toISOString().split('T')[0], completed: false }, onSave: () => {}, onDelete: () => {} }),

  // atoms
  atom('Button', () => import('@/components/atoms/Button'), '버튼', [], 'atoms/Button.tsx',
    { children: '버튼 샘플', variant: 'primary' }),
  atom('TextField', () => import('@/components/atoms/TextField'), '텍스트 입력', [], 'atoms/TextField.tsx',
    { label: '이름', placeholder: '입력하세요' }),
  atom('Select', () => import('@/components/atoms/Select'), '드롭다운 선택', [], 'atoms/Select.tsx',
    { options: [{ value: 'a', label: '옵션 A' }, { value: 'b', label: '옵션 B' }], label: '선택' }),
  atom('Checkbox', () => import('@/components/atoms/Checkbox'), '체크박스', [], 'atoms/Checkbox.tsx',
    { label: '동의합니다' }),

  // primitives
  primitive('Box', () => import('@/components/primitives/Box'), '기본 컨테이너', [], 'primitives/Box.tsx'),
  primitive('Stack', () => import('@/components/primitives/Stack'), '수직 스택', [], 'primitives/Stack.tsx'),
  primitive('Row', () => import('@/components/primitives/Row'), '수평 행', [], 'primitives/Row.tsx'),
  primitive('Text', () => import('@/components/primitives/Text'), '텍스트', [], 'primitives/Text.tsx'),
]
