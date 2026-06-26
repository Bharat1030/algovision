import { useVisualizerStore, ALGORITHMS } from '../store/useVisualizerStore'

const KEYWORDS = ['function', 'if', 'return', 'swap', 'find', 'place', 'mark', 'compare']

function highlightLine(line: string) {
  const parts = line.split(/(\s+)/)
  return parts.map((part, i) => {
    if (KEYWORDS.some((kw) => part.startsWith(kw))) {
      return <span key={i} className="text-accent">{part}</span>
    }
    if (part.startsWith('//')) {
      return <span key={i} className="text-ink-faint italic">{part}</span>
    }
    if (/^[0-9]+$/.test(part)) {
      return <span key={i} className="text-accent-2">{part}</span>
    }
    return <span key={i}>{part}</span>
  })
}

const EXPLANATIONS: Record<string, Record<number, string>> = {
  bubble: {
    0: 'Starting bubble sort — unsorted array loaded.',
    1: 'Comparing two adjacent elements.',
    2: 'Left is greater — swapping them.',
    3: 'Pass complete — one element is in its final position.',
    4: 'All passes done — array is fully sorted.',
  },
  selection: {
    0: 'Starting selection sort — scanning for the minimum.',
    1: 'Scanning unsorted region for the minimum element.',
    2: 'Found a new minimum — updating index.',
    3: 'Placing minimum at the start of unsorted region.',
    4: 'Index is now in its final sorted position.',
    5: 'Array is fully sorted.',
  },
  merge: {
    0: 'Starting merge sort — splitting the array.',
    1: 'Comparing elements from left and right halves.',
    2: 'Right element is smaller — placing it into position.',
    3: 'Merging two halves back together.',
    4: 'Array is fully sorted.',
  },
  quick: {
    0: 'Starting quick sort — picking a pivot.',
    1: 'Comparing current element with the pivot.',
    2: 'Element is smaller than pivot — swapping into place.',
    3: 'Placing pivot into its correct final position.',
    4: 'Pivot is now sorted — recursing on both sides.',
    5: 'Array is fully sorted.',
  },
}

export function CodePanel() {
  const steps = useVisualizerStore((state) => state.steps)
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex)
  const currentAlgorithm = useVisualizerStore((state) => state.currentAlgorithm)

  const step = steps[currentStepIndex]
  const code = ALGORITHMS[currentAlgorithm].code
  const activeLine = step?.codeLine ?? -1
  const explanation = EXPLANATIONS[currentAlgorithm]?.[activeLine] ?? ''

  return (
    <div className="flex flex-col h-full min-h-[400px]">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-panel-border bg-panel">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink-dim">
            {ALGORITHMS[currentAlgorithm].name}
          </span>
        </div>
        <span className="font-mono text-[10px] text-ink-faint">
          line {activeLine + 1} / {code.length}
        </span>
      </div>

      {/* Code lines */}
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
              <span className={`${isActive ? 'text-ink' : 'text-ink-dim'}`}>
                {highlightLine(line)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      <div className="px-4 py-3 border-t border-panel-border bg-panel min-h-[56px] flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-2 shrink-0 inline-block" />
        <p className="font-mono text-xs text-ink-dim leading-relaxed">
          {explanation || 'Press play or step forward to begin.'}
        </p>
      </div>

    </div>
  )
}