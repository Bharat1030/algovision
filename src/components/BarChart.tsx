import { useVisualizerStore } from '../store/useVisualizerStore'

export function BarChart() {
  const steps = useVisualizerStore((state) => state.steps)
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex)

  const step = steps[currentStepIndex]
  if (!step) return null

  return (
    <div>
      <div className="flex items-end gap-1 h-64 bg-bg-deep p-4 rounded-sm border border-panel-border">
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
              className={`flex-1 transition-all duration-200 ${barColor}`}
              style={{ height: `${value}%` }}
            />
          )
        })}
      </div>

      <div className="flex gap-7 mt-5 font-mono text-xs text-ink-dim">
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