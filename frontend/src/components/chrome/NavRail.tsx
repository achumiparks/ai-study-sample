import { Stack, Row, Text } from '@/components/primitives'

export interface NavSection {
  key: string
  label: string
  badge?: number
}

interface NavRailProps {
  sections: NavSection[]
  activeKey: string
  onSelect: (key: string) => void
}

export default function NavRail({ sections, activeKey, onSelect }: NavRailProps) {
  return (
    <Stack className="w-[220px] bg-[#2c3e50] text-white flex-shrink-0 pt-3 overflow-y-auto">
      {sections.map(section => {
        const isActive = section.key === activeKey
        return (
          <Row
            key={section.key}
            justify="between"
            align="center"
            className={`
              px-5 py-3 cursor-pointer transition-colors text-sm
              ${isActive ? 'bg-blue-500' : 'hover:bg-white/10'}
            `}
            onClick={() => onSelect(section.key)}
          >
            <span>{section.label}</span>
            {section.badge !== undefined && (
              <Text
                variant="caption"
                className={`rounded-full px-2 py-0.5 font-semibold ${isActive ? 'bg-white/30' : 'bg-white/20'} text-white`}
              >
                {section.badge}
              </Text>
            )}
          </Row>
        )
      })}
    </Stack>
  )
}
