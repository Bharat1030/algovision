import { useVisualizerStore, ALGORITHMS } from '../store/useVisualizerStore'

export function CodePanel() {
  const steps = useVisualizerStore((state) => state.steps)
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex)
  const currentAlgorithm = useVisualizerStore((state) => state.currentAlgorithm)

  const step = steps[currentStepIndex]
  const code = ALGORITHMS[currentAlgorithm].code
  const activeLine = step?.codeLine ?? -1

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-panel-border">
        <span className="font-mono text-[10px] tracking-wide uppercase text-ink-dim">
          Code
        </span>
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
              className={`flex gap-4 px-2 py-0.5 rounded-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-accent text-bg-deep border-l-2 border-accent'
                  : 'text-ink-dim border-l-2 border-transparent'
              }`}
            >
              <span
                className={`select-none w-5 text-right shrink-0 ${
                  isActive ? 'text-bg-deep' : 'text-ink-faint'
                }`}
              >
                {index + 1}
              </span>
              <span className={isActive ? 'text-bg-deep font-semibold' : ''}>
                {line}
              </span>
            </div>
          )
        })}
      </div>

      {/* Step explanation */}
      <div className="px-4 py-3 border-t border-panel-border font-mono text-xs text-ink-dim min-h-[48px]">
        {step && (
          <span>
            {activeLine === 0 && 'Initializing — starting the sort.'}
            {activeLine === 1 && `Comparing elements at positions ${step.comparing?.[0]} and ${step.comparing?.[1]}.`}
            {activeLine === 2 && `Swap needed — moving larger element right.`}
            {activeLine === 3 && `Swap complete.`}
            {activeLine === 4 && `Pass complete — one more element is in its final position.`}
            {activeLine === 5 && `Marking index as sorted.`}
            {activeLine === 6 && 'Sort complete — all elements in order.'}
          </span>
        )}
      </div>
    </div>
  )
}