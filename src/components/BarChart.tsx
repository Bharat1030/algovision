import { useVisualizerStore } from '../store/useVisualizerStore'

export function BarChart() {
  const steps = useVisualizerStore((state) => state.steps)
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex)

  const step = steps[currentStepIndex]
  if (!step) return null

  const isComplete = currentStepIndex === steps.length - 1

  return (
    <div>
      <div className={`
        flex items-end gap-[3px] h-72 bg-bg-deep px-4 pb-4 pt-8 rounded-sm border transition-all duration-500
        ${isComplete
          ? 'border-accent-2 shadow-[0_0_24px_2px_rgba(52,211,153,0.15)]'
          : 'border-panel-border'
        }
        relative overflow-hidden
      `}>

        {/* Completion banner */}
        {isComplete && (
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center py-1.5 bg-accent-2/10 border-b border-accent-2/30">
            <span className="font-mono text-[11px] text-accent-2 tracking-widest uppercase">
              ✓ Sort complete
            </span>
          </div>
        )}

        {step.array.map((value, index) => {
          const isComparing = step.comparing?.includes(index)
          const isSwapping = step.swapping?.includes(index)
          const isSorted = step.sorted.includes(index)

          let barColor = 'bg-ink-faint'
          if (isComparing) barColor = 'bg-accent'
          if (isSwapping) barColor = 'bg-accent'
          if (isSorted) barColor = 'bg-accent-2'

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end relative"
              style={{ height: '100%' }}
            >
              {isComparing && (
                <span className="absolute -top-5 text-[9px] font-mono text-accent font-semibold">
                  {value}
                </span>
              )}

              <div
                className={`
                  w-full rounded-t-sm transition-all duration-150
                  ${barColor}
                  ${isComparing ? 'brightness-110' : ''}
                  ${isSorted ? 'opacity-75' : ''}
                  ${isComplete ? 'opacity-100' : ''}
                `}
                style={{
                  height: `${value}%`,
                  transform: isComparing ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: isComplete
                    ? '0 0 8px 2px rgba(52,211,153,0.3)'
                    : isComparing
                    ? '0 0 8px 2px rgba(232,121,249,0.5), 0 0 24px 4px rgba(232,121,249,0.2)'
                    : isSorted
                    ? '0 0 6px 1px rgba(52,211,153,0.2)'
                    : 'none',
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-3 font-mono text-[11px] text-ink-faint">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-ink-faint inline-block" />
          idle
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm bg-accent inline-block"
            style={{ boxShadow: '0 0 6px 1px rgba(232,121,249,0.5)' }}
          />
          comparing
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm bg-accent-2 inline-block"
            style={{ boxShadow: '0 0 6px 1px rgba(52,211,153,0.3)' }}
          />
          sorted
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-7 mt-4 font-mono text-xs text-ink-dim">
        <div>
          <span className="block text-2xl font-display text-ink">{step.comparisons}</span>
          comparisons
        </div>
        <div>
          <span className="block text-2xl font-display text-ink">{step.swaps}</span>
          swaps
        </div>
        <div>
          <span className="block text-2xl font-display text-ink">
            {currentStepIndex} / {steps.length - 1}
          </span>
          step
        </div>
      </div>
    </div>
  )
}