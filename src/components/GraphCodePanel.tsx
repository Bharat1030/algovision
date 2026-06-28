import { GRAPH_ALGORITHMS } from '../types/graphTypes'
import type { GraphAlgorithmKey, GraphStep } from '../types/graphTypes'

const KEYWORDS = ['function', 'while', 'if', 'for', 'return', 'update']

function highlightLine(line: string) {
  const parts = line.split(/(\s+)/)
  return parts.map((part, i) => {
    if (KEYWORDS.some(kw => part.startsWith(kw))) {
      return <span key={i} className="text-accent">{part}</span>
    }
    if (part.startsWith('//') || part.startsWith('→')) {
      return <span key={i} className="text-accent-2">{part}</span>
    }
    return <span key={i}>{part}</span>
  })
}

interface GraphCodePanelProps {
  algorithm: GraphAlgorithmKey
  currentStep: GraphStep | null
  totalSteps: number
  currentStepIndex: number
}

export function GraphCodePanel({ algorithm, currentStep, totalSteps, currentStepIndex }: GraphCodePanelProps) {
  const info = GRAPH_ALGORITHMS[algorithm]
  const code = info.code
  const activeLine = currentStep?.codeLine ?? -1

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-panel-border bg-panel">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink-dim">
            {info.name}
          </span>
        </div>
        <span className="font-mono text-[10px] text-ink-faint">
          line {activeLine + 1} / {code.length}
        </span>
      </div>

      {/* Code */}
      <div className="flex-1 bg-bg-deep p-4 font-mono text-sm overflow-auto">
        {code.map((line, index) => {
          const isActive = index === activeLine
          return (
            <div
              key={index}
              className={`
                flex gap-4 px-3 py-1 transition-all duration-150 border-l-2
                ${isActive
                  ? 'bg-accent/10 border-accent'
                  : 'border-transparent hover:bg-panel/40'
                }
              `}
            >
              <span className={`select-none w-4 text-right shrink-0 text-xs mt-0.5 ${
                isActive ? 'text-accent' : 'text-ink-faint'
              }`}>
                {index + 1}
              </span>
              <span className={isActive ? 'text-ink' : 'text-ink-dim'}>
                {highlightLine(line)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Step explanation */}
      <div className="px-4 py-3 border-t border-panel-border bg-panel min-h-[56px] flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-2 shrink-0 inline-block" />
        <p className="font-mono text-xs text-ink-dim leading-relaxed">
          {!currentStep && 'Draw walls then press Run to begin.'}
          {currentStep && activeLine === 0 && 'Initializing — setting up the data structure.'}
          {currentStep && (activeLine === 1 || activeLine === 2) && 'Adding the start node to the data structure.'}
          {currentStep && activeLine === 3 && `Processing node at (${currentStep.current?.[0]}, ${currentStep.current?.[1]}).`}
          {currentStep && activeLine === 4 && 'Checking if we reached the end node.'}
          {currentStep && activeLine === 5 && '✓ End node reached!'}
          {currentStep && activeLine === 6 && `Marking (${currentStep.current?.[0]}, ${currentStep.current?.[1]}) as visited.`}
          {currentStep && activeLine === 7 && 'Scanning neighbors of current node.'}
          {currentStep && activeLine === 8 && 'Tracing path back from end to start.'}
          {currentStep && activeLine === 9 && `Done — ${currentStep.found ? `path found (${currentStep.pathLength} cells)` : 'no path exists'}.`}
          {currentStep && activeLine === 10 && `Found shorter path — updating distance for (${currentStep.current?.[0]}, ${currentStep.current?.[1]}).`}
          {currentStep && activeLine === 12 && 'Highlighting the shortest path.'}
          {currentStep && activeLine === 13 && `Done — ${currentStep.found ? `shortest path is ${currentStep.pathLength} cells` : 'no path exists'}.`}
        </p>
      </div>
    </div>
  )
}