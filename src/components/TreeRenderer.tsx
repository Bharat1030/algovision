import type { TreeNode, TreeStep } from '../types/treeTypes'

interface TreeRendererProps {
  root: TreeNode
  currentStep: TreeStep | null
}

function collectNodes(node: TreeNode | null, nodes: TreeNode[] = []): TreeNode[] {
  if (!node) return nodes
  nodes.push(node)
  collectNodes(node.left, nodes)
  collectNodes(node.right, nodes)
  return nodes
}

function collectEdges(node: TreeNode | null, edges: [TreeNode, TreeNode][] = []): [TreeNode, TreeNode][] {
  if (!node) return edges
  if (node.left) {
    edges.push([node, node.left])
    collectEdges(node.left, edges)
  }
  if (node.right) {
    edges.push([node, node.right])
    collectEdges(node.right, edges)
  }
  return edges
}

export function TreeRenderer({ root, currentStep }: TreeRendererProps) {
  const nodes = collectNodes(root)
  const edges = collectEdges(root)

  const visitedOrder = currentStep?.visitedOrder ?? []
  const current = currentStep?.current ?? null

  return (
    <div className="border border-panel-border bg-bg-deep p-4 rounded-sm">
      <svg viewBox="0 0 100 65" className="w-full h-64">
        {/* Edges */}
        {edges.map(([from, to], i) => (
          <line
            key={i}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.6"
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => {
          const isVisited = visitedOrder.includes(node.id)
          const isCurrent = current === node.id
          const visitIndex = visitedOrder.indexOf(node.id)

          let fill = 'rgba(255,255,255,0.08)'
          let stroke = 'rgba(255,255,255,0.15)'
          let textColor = 'rgba(255,255,255,0.4)'

          if (isCurrent) {
            fill = '#E879F9'
            stroke = '#E879F9'
            textColor = '#000'
          } else if (isVisited) {
            fill = '#34D399'
            stroke = '#34D399'
            textColor = '#000'
          }

          return (
            <g key={node.id}>
              <circle
                cx={node.x} cy={node.y} r="6"
                fill={fill}
                stroke={stroke}
                strokeWidth="0.5"
                style={{
                  filter: isCurrent ? 'drop-shadow(0 0 3px rgba(232,121,249,0.8))' : 'none',
                  transition: 'fill 0.2s ease',
                }}
              />
              <text
                x={node.x} y={node.y + 1.8}
                textAnchor="middle"
                fontSize="4.5"
                fill={textColor}
                fontFamily="JetBrains Mono"
                fontWeight="600"
              >
                {node.value}
              </text>

              {/* Visit order badge */}
              {isVisited && visitIndex !== -1 && (
                <text
                  x={node.x + 7} y={node.y - 5}
                  textAnchor="middle"
                  fontSize="3.5"
                  fill="#34D399"
                  fontFamily="JetBrains Mono"
                >
                  {visitIndex + 1}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-5 mt-3 font-mono text-[11px] text-ink-faint">
        <span className="flex items-center gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full not-italic inline-block" style={{ background: 'rgba(255,255,255,0.15)' }} />
          unvisited
        </span>
        <span className="flex items-center gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full not-italic inline-block bg-accent" />
          visiting
        </span>
        <span className="flex items-center gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full not-italic inline-block bg-accent-2" />
          visited
        </span>
      </div>
    </div>
  )
}