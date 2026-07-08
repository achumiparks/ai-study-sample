import type { ComponentEntry } from '@/registry/types'
import { Stack, Text } from '@/components/primitives'

interface PropsPanelProps {
  entry: ComponentEntry | null
  onNavigate: (name: string) => void
}

export default function PropsPanel({ entry, onNavigate }: PropsPanelProps) {
  if (!entry) {
    return (
      <Stack className="w-60 bg-gray-50 border-l border-gray-200 p-4 flex-shrink-0">
        <Text variant="caption">컴포넌트를 선택하세요</Text>
      </Stack>
    )
  }

  return (
    <Stack className="w-60 bg-gray-50 border-l border-gray-200 p-4 flex-shrink-0 gap-4 overflow-y-auto">
      <Stack gap={1}>
        <Text variant="label">Component</Text>
        <Text variant="body" className="font-semibold">{entry.name}</Text>
      </Stack>

      <Stack gap={1}>
        <Text variant="label">Category</Text>
        <Text variant="caption">{entry.category}</Text>
      </Stack>

      {entry.description && (
        <Stack gap={1}>
          <Text variant="label">Description</Text>
          <Text variant="caption">{entry.description}</Text>
        </Stack>
      )}

      {entry.file && (
        <Stack gap={1}>
          <Text variant="label">File</Text>
          <Text variant="caption" className="break-all font-mono">{entry.file}</Text>
        </Stack>
      )}

      {entry.uses && entry.uses.length > 0 && (
        <Stack gap={2}>
          <Text variant="label">Uses</Text>
          <div className="flex flex-wrap gap-1">
            {entry.uses.map(name => (
              <button
                key={name}
                onClick={() => onNavigate(name)}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded cursor-pointer hover:bg-blue-200 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </Stack>
      )}
    </Stack>
  )
}
