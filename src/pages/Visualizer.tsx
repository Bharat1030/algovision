import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart } from '../components/BarChart'
import { Controls } from '../components/Controls'
import { CodePanel } from '../components/CodePanel'
import { ComplexityChart } from '../components/ComplexityChart'
import { useVisualizerStore, ALGORITHMS, type AlgorithmKey } from '../store/useVisualizerStore'

export function Visualizer() {
  const navigate = useNavigate()
  const isPlaying = useVisualizerStore((state) => state.isPlaying)
  const speed = useVisualizerStore((state) => state.speed)
  const stepForward = useVisualizerStore((state) => state.stepForward)
  const stepBackward = useVisualizerStore((state) => state.stepBackward)
  const play = useVisualizerStore((state) => state.play)
  const pause = useVisualizerStore((state) => state.pause)
  const restart = useVisualizerStore((state) => state.restart)
  const currentAlgorithm = useVisualizerStore((state) => state.currentAlgorithm)
  const setAlgorithm = useVisualizerStore((state) => state.setAlgorithm)
  const steps = useVisualizerStore((state) => state.steps)
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex)
  const recordRun = useVisualizerStore((state) => state.recordRun)

  const algo = ALGORITHMS[currentAlgorithm]
  const hasRecordedRef = useRef(false)

  // Playback tick loop
  useEffect(() => {
    if (!isPlaying) return
    const delay = 750 - speed * 100
    const timer = setInterval(() => {
      stepForward()
    }, Math.max(delay, 40))
    return () => clearInterval(timer)
  }, [isPlaying, speed, stepForward])

  // Record run when sort completes
  useEffect(() => {
    if (currentStepIndex === steps.length - 1 && steps.length > 1) {
      if (!hasRecordedRef.current) {
        hasRecordedRef.current = true
        recordRun()
      }
    } else {
      hasRecordedRef.current = false
    }
  }, [currentStepIndex, steps, recordRun])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          isPlaying ? pause() : play()
          break
        case 'ArrowRight':
          e.preventDefault()
          stepForward()
          break
        case 'ArrowLeft':
          e.preventDefault()
          stepBackward()
          break
        case 'r':
        case 'R':
          restart()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, play, pause, stepForward, stepBackward, restart])

  return (
    <div className="min-h-screen text-ink font-body">
      {/* Header */}
      <header className="border-b border-panel-border sticky top-0 z-50 backdrop-blur-sm bg-bg/80">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="font-mono font-semibold text-sm flex items-center gap-2 hover:text-accent transition"
          >
            <span className="w-2 h-2 bg-accent rotate-45 inline-block" />
            ALGOVISION
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/graph')}
              className="font-mono text-xs text-ink-dim border border-panel-border px-3 py-1.5 hover:border-accent hover:text-ink transition"
            >
              Graph →
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
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

        {/* Heading + dropdown */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-semibold text-4xl mb-2">
              The <span className="text-accent">Visualizer</span>
            </h1>
            <p className="text-ink-dim max-w-md">
              Step through the sort one comparison at a time, or press play and watch it run.
            </p>
            <div className="flex gap-3 mt-3 flex-wrap">
              {[
                { key: 'Space', label: 'play / pause' },
                { key: '→', label: 'step forward' },
                { key: '←', label: 'step back' },
                { key: 'R', label: 'restart' },
              ].map(({ key, label }) => (
                <span key={key} className="flex items-center gap-1.5 font-mono text-[11px] text-ink-faint">
                  <kbd className="border border-panel-border bg-panel px-1.5 py-0.5 rounded text-ink-dim">
                    {key}
                  </kbd>
                  {label}
                </span>
              ))}
            </div>
          </div>

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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-panel-border">
              <BarChart />
              <Controls />
            </div>
            <CodePanel />
          </div>
        </div>

        <ComplexityChart />
      </main>
    </div>
  )
}