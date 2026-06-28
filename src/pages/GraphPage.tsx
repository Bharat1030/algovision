import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GridRenderer } from '../components/GridRenderer'
import { GraphCodePanel } from '../components/GraphCodePanel'
import { bfs } from '../algorithms/bfs'
import { dfs } from '../algorithms/dfs'
import { dijkstra } from '../algorithms/dijkstra'
import type { Cell, GraphStep, GraphAlgorithmKey } from '../types/graphTypes'
import { GRAPH_ALGORITHMS } from '../types/graphTypes'

const ROWS = 20
const COLS = 40
const START: [number, number] = [10, 5]
const END: [number, number] = [10, 34]

function createGrid(): Cell[][] {
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => ({
      row: r,
      col: c,
      type:
        r === START[0] && c === START[1]
          ? 'start'
          : r === END[0] && c === END[1]
          ? 'end'
          : 'empty',
      distance: Infinity,
      weight: 1,
    }))
  )
}

function resetGridKeepWalls(grid: Cell[][]): Cell[][] {
  return grid.map(row =>
    row.map(cell => ({
      ...cell,
      type:
        cell.row === START[0] && cell.col === START[1]
          ? 'start'
          : cell.row === END[0] && cell.col === END[1]
          ? 'end'
          : cell.type === 'wall'
          ? 'wall'
          : 'empty',
    }))
  )
}

export function GraphPage() {
  const navigate = useNavigate()
  const [grid, setGrid] = useState<Cell[][]>(createGrid)
  const [steps, setSteps] = useState<GraphStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(3)
  const [algorithm, setAlgorithm] = useState<GraphAlgorithmKey>('bfs')
  const [hasRun, setHasRun] = useState(false)
  const hasRecordedRef = useRef(false)

  const algoInfo = GRAPH_ALGORITHMS[algorithm]

  // Play tick loop
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return
    const delay = 300 - speed * 50
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, Math.max(delay, 20))
    return () => clearInterval(timer)
  }, [isPlaying, speed, steps])

  const currentStep = steps[currentStepIndex]
  const displayGrid = hasRun && currentStep ? currentStep.grid : grid

  const handleCellClick = useCallback((row: number, col: number) => {
    if (hasRun) return
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })))
      const cell = newGrid[row][col]
      if (cell.type === 'start' || cell.type === 'end') return prev
      cell.type = cell.type === 'wall' ? 'empty' : 'wall'
      return newGrid
    })
  }, [hasRun])

  const handleCellDrag = useCallback((row: number, col: number) => {
    if (hasRun) return
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })))
      const cell = newGrid[row][col]
      if (cell.type === 'start' || cell.type === 'end') return prev
      cell.type = 'wall'
      return newGrid
    })
  }, [hasRun])

  function runAlgorithm() {
    const cleanGrid = resetGridKeepWalls(grid)
    let newSteps: GraphStep[] = []

    if (algorithm === 'bfs') {
      newSteps = bfs(cleanGrid, START[0], START[1], END[0], END[1])
    } else if (algorithm === 'dfs') {
      newSteps = dfs(cleanGrid, START[0], START[1], END[0], END[1])
    } else {
      newSteps = dijkstra(cleanGrid, START[0], START[1], END[0], END[1])
    }

    setSteps(newSteps)
    setCurrentStepIndex(0)
    setHasRun(true)
    setIsPlaying(true)
    hasRecordedRef.current = false
  }

  function resetAll() {
    setGrid(createGrid())
    setSteps([])
    setCurrentStepIndex(0)
    setIsPlaying(false)
    setHasRun(false)
  }

  function clearPath() {
    setGrid(prev => resetGridKeepWalls(prev))
    setSteps([])
    setCurrentStepIndex(0)
    setIsPlaying(false)
    setHasRun(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement
      ) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          if (!hasRun) runAlgorithm()
          else setIsPlaying(p => !p)
          break
        case 'ArrowRight':
          e.preventDefault()
          setCurrentStepIndex(p => Math.min(p + 1, steps.length - 1))
          break
        case 'ArrowLeft':
          e.preventDefault()
          setCurrentStepIndex(p => Math.max(p - 1, 0))
          break
        case 'r':
        case 'R':
          resetAll()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasRun, steps, isPlaying])

  const isDone = currentStep?.done ?? false
  const isFound = currentStep?.found ?? false

  return (
    <div className="min-h-screen text-ink font-body">
      {/* Header */}
      <header className="border-b border-panel-border sticky top-0 z-50 backdrop-blur-sm bg-bg/80">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="font-mono font-semibold text-sm flex items-center gap-2 hover:text-accent transition"
          >
            <span className="w-2 h-2 bg-accent rotate-45 inline-block" />
            ALGOVISION
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/visualizer')}
              className="font-mono text-xs text-ink-dim border border-panel-border px-3 py-1.5 hover:border-accent hover:text-ink transition"
            >
              Sorting →
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Title block */}
        <div className="border border-panel-border bg-panel p-5 font-mono text-xs text-ink-faint grid grid-cols-4 gap-x-4 gap-y-3 max-w-xl mb-10">
          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">Algorithm</b>
            <span className="text-ink text-[13px]">{algoInfo.name}</span>
          </div>
          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">Complexity</b>
            <span className="text-ink text-[13px]">{algoInfo.timeComplexity}</span>
          </div>
          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">Shortest Path</b>
            <span className={algoInfo.guaranteesShortestPath ? 'text-accent-2 text-[13px]' : 'text-red-400 text-[13px]'}>
              {algoInfo.guaranteesShortestPath ? 'Guaranteed' : 'Not guaranteed'}
            </span>
          </div>
          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">Status</b>
            <span className={`text-[13px] ${
              isDone
                ? isFound ? 'text-accent-2' : 'text-red-400'
                : isPlaying ? 'text-accent' : 'text-ink-dim'
            }`}>
              {isDone
                ? isFound ? 'Path found' : 'No path'
                : isPlaying ? 'Running' : 'Idle'}
            </span>
          </div>
        </div>

        {/* Heading + dropdown */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-semibold text-4xl mb-2">
              Graph <span className="text-accent">Visualizer</span>
            </h1>
            <p className="text-ink-dim max-w-lg text-sm">
              {algoInfo.description}
            </p>
            <div className="flex gap-3 mt-3 flex-wrap">
              {[
                { key: 'Space', label: hasRun ? 'play / pause' : 'run' },
                { key: '→', label: 'step forward' },
                { key: '←', label: 'step back' },
                { key: 'R', label: 'reset' },
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

          {/* Algorithm dropdown */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] tracking-wide uppercase text-ink-dim">
              Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value as GraphAlgorithmKey)
                clearPath()
              }}
              className="bg-panel border border-panel-border text-ink font-mono text-sm px-4 py-2 focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="bfs">Breadth-First Search</option>
              <option value="dfs">Depth-First Search</option>
              <option value="dijkstra">Dijkstra's Algorithm</option>
            </select>
          </div>
        </div>

        {/* Grid panel with code panel */}
        <div className="border border-panel-border bg-panel relative">
          <div className="absolute -top-[11px] left-4 bg-bg px-2 font-mono text-[10px] tracking-wide text-accent">
            FIG. 02 — {algoInfo.name.toUpperCase()}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
            {/* Left: grid + controls */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-panel-border">
              <GridRenderer
                grid={displayGrid}
                onCellClick={handleCellClick}
                onCellDrag={handleCellDrag}
              />

              {/* Controls */}
              <div className="flex items-center gap-3 mt-5 font-mono text-sm flex-wrap">
                <button
                  onClick={resetAll}
                  className="w-9 h-9 border border-panel-border rounded hover:border-accent transition"
                  title="Reset all"
                >↺</button>

                <button
                  onClick={() => {
                    if (!hasRun) runAlgorithm()
                    else setIsPlaying(p => !p)
                  }}
                  className={`w-9 h-9 border rounded transition ${
                    isPlaying
                      ? 'bg-accent border-accent text-bg-deep'
                      : 'border-panel-border hover:border-accent'
                  }`}
                >{isPlaying ? '⏸' : '▶'}</button>

                <button
                  onClick={() => setCurrentStepIndex(p => Math.max(p - 1, 0))}
                  disabled={!hasRun}
                  className="w-9 h-9 border border-panel-border rounded hover:border-accent transition disabled:opacity-30"
                >⏮</button>

                <button
                  onClick={() => setCurrentStepIndex(p => Math.min(p + 1, steps.length - 1))}
                  disabled={!hasRun}
                  className="w-9 h-9 border border-panel-border rounded hover:border-accent transition disabled:opacity-30"
                >⏭</button>

                <label className="flex items-center gap-2 ml-2 text-ink-dim">
                  speed
                  <input
                    type="range" min={1} max={5} value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="accent-accent"
                  />
                </label>

                <button
                  onClick={clearPath}
                  className="ml-auto px-4 py-2 border border-panel-border rounded hover:border-accent-2 transition text-ink-dim hover:text-ink"
                >Clear Path</button>

                <button
                  onClick={() => { clearPath(); setTimeout(runAlgorithm, 50) }}
                  className="px-4 py-2 bg-accent text-bg-deep font-semibold rounded hover:opacity-90 transition"
                >Run →</button>
              </div>

              {/* Stats */}
              {hasRun && currentStep && (
                <div className="flex gap-7 mt-5 font-mono text-xs text-ink-dim">
                  <div>
                    <span className="block text-2xl font-display text-ink">{currentStep.visitedCount}</span>
                    cells visited
                  </div>
                  <div>
                    <span className="block text-2xl font-display text-ink">{currentStep.pathLength}</span>
                    path length
                  </div>
                  <div>
                    <span className="block text-2xl font-display text-ink">{currentStepIndex} / {steps.length - 1}</span>
                    step
                  </div>
                </div>
              )}

              {/* Instructions */}
              {!hasRun && (
                <p className="mt-4 font-mono text-xs text-ink-faint">
                  Click or drag on the grid to draw walls → then press Run or Space to start.
                </p>
              )}

              {/* Completion banner */}
              {isDone && (
                <div className={`mt-4 px-4 py-3 border font-mono text-sm ${
                  isFound
                    ? 'border-accent-2/40 bg-accent-2/10 text-accent-2'
                    : 'border-red-400/40 bg-red-400/10 text-red-400'
                }`}>
                  {isFound
                    ? `✓ Path found — ${currentStep?.pathLength} cells · ${currentStep?.visitedCount} visited`
                    : '✕ No path exists — the end node is completely blocked by walls'}
                </div>
              )}
            </div>

            {/* Right: code panel */}
            <GraphCodePanel
              algorithm={algorithm}
              currentStep={currentStep ?? null}
              totalSteps={steps.length}
              currentStepIndex={currentStepIndex}
            />
          </div>
        </div>

        {/* Algorithm reference cards */}
        <div className="border border-panel-border bg-panel relative mt-8">
          <div className="absolute -top-[11px] left-4 bg-bg px-2 font-mono text-[10px] tracking-wide text-accent">
            FIG. 03 — ALGORITHM REFERENCE
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-panel-border">
            {(Object.entries(GRAPH_ALGORITHMS) as [GraphAlgorithmKey, typeof GRAPH_ALGORITHMS[GraphAlgorithmKey]][]).map(([key, info]) => (
              <div
                key={key}
                className={`bg-bg p-6 cursor-pointer transition hover:bg-panel border-l-2 ${
                  algorithm === key ? 'border-accent' : 'border-transparent'
                }`}
                onClick={() => { setAlgorithm(key); clearPath() }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-[10px] text-ink-faint uppercase tracking-wide">
                    {info.weighted ? 'Weighted' : 'Unweighted'}
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 border ${
                    info.guaranteesShortestPath
                      ? 'text-accent-2 border-accent-2/30'
                      : 'text-red-400 border-red-400/30'
                  }`}>
                    {info.guaranteesShortestPath ? '✓ Shortest path' : '✕ No guarantee'}
                  </span>
                </div>

                <h3 className={`font-display font-semibold text-lg mb-2 ${
                  algorithm === key ? 'text-accent' : 'text-ink'
                }`}>
                  {info.name}
                </h3>

                <p className="text-ink-dim text-sm mb-4 leading-relaxed">
                  {info.description}
                </p>

                <div className="flex gap-4 font-mono text-xs text-ink-faint">
                  <div>
                    <b className="block text-[10px] uppercase tracking-wide text-ink-dim mb-1">Time</b>
                    {info.timeComplexity}
                  </div>
                  <div>
                    <b className="block text-[10px] uppercase tracking-wide text-ink-dim mb-1">Space</b>
                    {info.spaceComplexity}
                  </div>
                </div>

                {algorithm === key && (
                  <div className="mt-4 font-mono text-[11px] text-accent">
                    ← Currently selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}