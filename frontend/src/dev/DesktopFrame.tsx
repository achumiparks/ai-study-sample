import { Box } from '@/components/primitives'
import type { ReactNode } from 'react'

type ViewportWidth = '1280' | '1440' | 'fluid'

interface DesktopFrameProps {
  width: ViewportWidth
  children: ReactNode
  onWidthChange: (w: ViewportWidth) => void
}

const widthStyles: Record<ViewportWidth, string> = {
  '1280': 'w-[1280px]',
  '1440': 'w-[1440px]',
  fluid: 'w-full',
}

export default function DesktopFrame({ width, children, onWidthChange }: DesktopFrameProps) {
  const options: ViewportWidth[] = ['1280', '1440', 'fluid']

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 border-b border-gray-300 flex-shrink-0">
        <span className="text-xs text-gray-500 font-medium">Viewport</span>
        {options.map(w => (
          <button
            key={w}
            onClick={() => onWidthChange(w)}
            className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors ${
              width === w ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-300'
            }`}
          >
            {w === 'fluid' ? 'Fluid' : `${w}px`}
          </button>
        ))}
      </div>

      {/* Frame */}
      <Box className="flex-1 overflow-auto p-4">
        <Box className={`mx-auto h-full bg-white shadow-md overflow-auto ${widthStyles[width]}`}>
          {children}
        </Box>
      </Box>
    </div>
  )
}
