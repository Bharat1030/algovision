import { useVisualizerStore } from '../store/useVisualizerStore'
import type { AlgorithmKey } from '../store/useVisualizerStore'

const ALGO_COLORS: Record<AlgorithmKey, { bar: string, glow: string, label: string }> = {
  bubble:    { bar: 'bg-red-400',    glow: 'rgba(248,113,113,0.4)',  label: 'text-red-400' },
  selection: { bar: 'bg-orange-400', glow: 'rgba(251,146,60,0.4)',   label: 'text-orange-400' },
  merge:     { bar: 'bg-accent',     glow: 'rgba(232,121,249,0.4)',  label: 'text-accent' },
  quick:     { bar: 'bg-accent-2',   glow: 'rgba(52,211,153,0.4)',   label: 'text-accent-2' },
}

export function ComplexityChart() {
  const runHistory = useVisualizerStore((state) => state.runHistory)
  const clearHistory = useVisualizerStore((state) => state.clearHistory)

  if (runHistory.length === 0) {
    return (
      <div className="border border-panel-border bg-panel relative mt-8">
        <div className="absolute -top-[11px] left-4 bg-bg px-2 font-mono text-[10px] tracking-wide text-accent">
          FIG. 02 — LIVE COMPLEXITY COMPARISON
        </div>
        <div className="p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[160px]">
          <span className="font-mono text-xs text-ink-faint">
            No runs recorded yet.
          </span>
          <span className="font-mono text-xs text-ink-faint">
            Run an algorithm to completion — stats will appear here for comparison.
          </span>
        </div>
      </div>
    )
  }

  const maxOps = Math.max(...runHistory.map((r) => r.totalOps), 1)

  return (
    <div className="border border-panel-border bg-panel relative mt-8">
      <div className="absolute -top-[11px] left-4 bg-bg px-2 font-mono text-[10px] tracking-wide text-accent">
        FIG. 02 — LIVE COMPLEXITY COMPARISON
      </div>

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-mono text-xs text-ink-dim">
            Actual operations recorded from completed runs — comparisons + swaps.
          </p>
          <button
            onClick={clearHistory}
            className="font-mono text-[11px] text-ink-faint border border-panel-border px-3 py-1 hover:border-red-400 hover:text-red-400 transition"
          >
            Clear
          </button>
        </div>

        {/* Bars */}
        <div className="flex flex-col gap-4">
          {runHistory.map((record, index) => {
            const colors = ALGO_COLORS[record.algorithm]
            const widthPct = (record.totalOps / maxOps) * 100

            return (
              <div key={index} className="flex flex-col gap-1.5">
                {/* Label row */}
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${colors.label}`}>
                      {record.algorithmName}
                    </span>
                    <span className="text-ink-faint">
                      n = {record.arraySize}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-ink-dim">
                    <span>{record.comparisons} cmp</span>
                    <span>{record.swaps} swp</span>
                    <span className="text-ink font-semibold">{record.totalOps} total</span>
                  </div>
                </div>

                {/* Bar */}
                <div className="h-7 bg-bg-deep rounded-sm overflow-hidden border border-panel-border">
                  <div
                    className={`h-full rounded-sm transition-all duration-700 ${colors.bar}`}
                    style={{
                      width: `${widthPct}%`,
                      boxShadow: `0 0 10px 1px ${colors.glow}`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-6 flex-wrap">
          {(Object.keys(ALGO_COLORS) as AlgorithmKey[]).map((key) => (
            <div key={key} className="flex items-center gap-2 font-mono text-[11px] text-ink-faint">
              <span className={`w-2.5 h-2.5 rounded-sm inline-block ${ALGO_COLORS[key].bar}`} />
              {key.charAt(0).toUpperCase() + key.slice(1)} Sort
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}