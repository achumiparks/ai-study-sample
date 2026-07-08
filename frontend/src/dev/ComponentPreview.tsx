import { Suspense } from 'react'
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { componentRegistry } from '@/registry/components.registry'
import { Box, Text } from '@/components/primitives'

export default function ComponentPreview() {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()
  const entry = componentRegistry.find(c => c.name === name)

  if (!entry) {
    return (
      <Box className="flex-1 flex items-center justify-center">
        <Text variant="caption">컴포넌트를 찾을 수 없습니다: {name}</Text>
      </Box>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = entry.component as React.ComponentType<any>
  const props = entry.sampleProps ?? {}

  return (
    <Box className="flex-1 overflow-auto p-8 bg-gray-50">
      <Box className="mb-4">
        <Text variant="h3" className="mb-1">{entry.name}</Text>
        <Text variant="caption">{entry.description}</Text>
      </Box>

      {entry.uses && entry.uses.length > 0 && (
        <Box className="mb-4 flex flex-wrap gap-2">
          {entry.uses.map(usedName => (
            <button
              key={usedName}
              onClick={() => navigate(`/dev/components/${usedName}`)}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 cursor-pointer transition-colors"
            >
              {usedName}
            </button>
          ))}
        </Box>
      )}

      <Box className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <Suspense fallback={<Text variant="caption">로딩 중...</Text>}>
          <Component {...props} />
        </Suspense>
      </Box>
    </Box>
  )
}
