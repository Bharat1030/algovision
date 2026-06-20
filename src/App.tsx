import { useEffect } from 'react'
import { BarChart } from './components/BarChart'
import { Controls } from './components/Controls'
import { useVisualizerStore } from './store/useVisualizerStore'

function App() {
  const isPlaying = useVisualizerStore((state) => state.isPlaying)
  const speed = useVisualizerStore((state) => state.speed)
  const stepForward = useVisualizerStore((state) => state.stepForward)

  useEffect(() => {
    if (!isPlaying) return
    const delay = 750 - speed * 100
    const timer = setInterval(() => {
      stepForward()
    }, Math.max(delay, 40))
    return () => clearInterval(timer)
  }, [isPlaying, speed, stepForward])

  return (
    <div className="min-h-screen text-ink font-body">
      {/* Header */}
      <header className="border-b border-panel-border">
        <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="font-mono font-semibold text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rotate-45 inline-block" />
            ALGOVISION
          </div>
          <span className="font-mono text-xs text-ink-dim">DWG NO. AV—001 · REV A</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        {/* Title block */}
        <div className="border border-panel-border bg-panel p-5 font-mono text-xs text-ink-faint grid grid-cols-3 gap-x-4 gap-y-3 max-w-md mb-10">
          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">Algorithm</b>
            <span className="text-ink text-[13px]">Bubble Sort</span>
          </div>
          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">Complexity</b>
            <span className="text-ink text-[13px]">O(n²)</span>
          </div>
          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">Status</b>
            <span className="text-accent-2 text-[13px]">{isPlaying ? 'Running' : 'Idle'}</span>
          </div>
        </div>

        <h1 className="font-display font-semibold text-4xl mb-2">
          The <span className="text-accent">Visualizer</span>
        </h1>
        <p className="text-ink-dim mb-8 max-w-md">
          Step through the sort one comparison at a time, or press play and watch it run.
        </p>

        {/* Visualizer panel */}
        <div className="border border-panel-border bg-panel relative">
          <div className="absolute -top-[11px] left-4 bg-bg px-2 font-mono text-[10px] tracking-wide text-accent">
            FIG. 01 — BUBBLE SORT
          </div>
          <div className="p-6">
            <BarChart />
            <Controls />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App