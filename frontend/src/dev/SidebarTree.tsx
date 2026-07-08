import { useRef } from 'react'

export interface TreeNode {
  id: string
  label: string
  sublabel?: string
  children?: TreeNode[]
}

interface SidebarTreeProps {
  nodes: TreeNode[]
  selectedId: string | null
  onSelect: (id: string) => void
  depth?: number
}

export default function SidebarTree({ nodes, selectedId, onSelect, depth = 0 }: SidebarTreeProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref}>
      {nodes.map(node => (
        <div key={node.id}>
          <div
            className={`
              flex items-center px-2 py-1.5 text-xs cursor-pointer rounded transition-colors
              ${selectedId === node.id ? 'bg-blue-500 text-white' : 'text-gray-200 hover:bg-white/10'}
            `}
            style={{ paddingLeft: `${8 + depth * 14}px` }}
            onClick={() => onSelect(node.id)}
          >
            {node.children && node.children.length > 0 && (
              <span className="mr-1 opacity-60">▸</span>
            )}
            <span>{node.label}</span>
            {node.sublabel && (
              <span className="ml-1 text-[10px] opacity-40 font-mono">({node.sublabel})</span>
            )}
          </div>
          {node.children && (
            <SidebarTree
              nodes={node.children}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </div>
  )
}
