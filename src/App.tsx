import { useEffect } from 'react'
import { BarChart } from './components/BarChart'
import { Controls } from './components/Controls'
import { useVisualizerStore, ALGORITHMS, type AlgorithmKey } from './store/useVisualizerStore'

function App() {
  const isPlaying = useVisualizerStore((state) => state.isPlaying)
  const speed = useVisualizerStore((state) => state.speed)
  const stepForward = useVisualizerStore((state) => state.stepForward)
  const currentAlgorithm = useVisualizerStore((state) => state.currentAlgorithm)
  const setAlgorithm = useVisualizerStore((state) => state.setAlgorithm)

  const algo = ALGORITHMS[currentAlgorithm]

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
        <div className="max-w-5xl mx-auto px-8 h-16 flex items-center">
          <div className="font-mono font-semibold text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rotate-45 inline-block" />
            ALGOVISION
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        {/* Title block */}
        <div className="border border-panel-border bg-panel p-5 font-mono text-xs text-ink-faint grid grid-cols-3 gap-x-4 gap-y-3 max-w-md mb-10">
          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">Algorithm</b>
            <span className="text-ink text-[13px]">{algo.name}</span>
          </div>
          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">Complexity</b>
            <span className="text-ink text-[13px]">{algo.complexity}</span>
          </div>
          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">Status</b>
            <span className="text-accent-2 text-[13px]">{isPlaying ? 'Running' : 'Idle'}</span>
          </div>
        </div>

        {/* Page heading + dropdown */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-semibold text-4xl mb-2">
              The <span className="text-accent">Visualizer</span>
            </h1>
            <p className="text-ink-dim max-w-md">
              Step through the sort one comparison at a time, or press play and watch it run.
            </p>
          </div>

          {/* Algorithm dropdown */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] tracking-wide uppercase text-ink-dim">
              Algorithm
            </label>
            <select
              value={currentAlgorithm}
              onChange={(e) => setAlgorithm(e.target.value as AlgorithmKey)}
              className="bg-panel border border-panel-border text-ink font-mono text-sm px-4 py-2 focus:outline-none focus:border-accent cursor-pointer"
            >
              {(Object.keys(ALGORITHMS) as AlgorithmKey[]).map((key) => (
                <option key={key} value={key}>
                  {ALGORITHMS[key].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visualizer panel */}
        <div className="border border-panel-border bg-panel relative">
          <div className="absolute -top-[11px] left-4 bg-bg px-2 font-mono text-[10px] tracking-wide text-accent">
            FIG. 01 — {algo.name.toUpperCase()}
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