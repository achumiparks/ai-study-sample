import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Todo } from '@/hooks/useTodos'
import { Box, Stack, Row, Text } from '@/components/primitives'
import { Button, TextField } from '@/components/atoms'

interface TodoDetailPanelProps {
  todo: Todo | null
  onSave: (todo: Todo) => void
  onDelete: (id: number) => void
}

export default function TodoDetailPanel({ todo, onSave, onDelete }: TodoDetailPanelProps) {
  const { t } = useTranslation(['common', 'todos'])
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' })

  useEffect(() => {
    if (todo) {
      setForm({ title: todo.title, description: todo.description, dueDate: todo.dueDate })
    }
  }, [todo])

  if (!todo) {
    return (
      <Box className="w-[300px] bg-gray-50 flex-shrink-0 flex items-center justify-center">
        <Text variant="caption" className="text-center leading-8">{t('noSelection')}</Text>
      </Box>
    )
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <Stack className="w-[300px] bg-gray-50 flex-shrink-0 p-6 overflow-y-auto gap-4">
      <Text variant="h3">{t('todos:editDetail')}</Text>

      <TextField
        label={t('title')}
        name="title"
        value={form.title}
        onChange={handleChange}
      />

      <Stack gap={1}>
        <Text variant="label">{t('description')}</Text>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none min-h-[80px] resize-y font-[inherit]
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        />
      </Stack>

      <TextField
        label={t('dueDate')}
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
      />

      <Row gap={2} className="pt-2">
        <Button variant="primary" fullWidth onClick={() => onSave({ ...todo, ...form })}>
          {t('save')}
        </Button>
        <Button variant="danger" onClick={() => onDelete(todo.id)}>
          {t('delete')}
        </Button>
      </Row>
    </Stack>
  )
}
