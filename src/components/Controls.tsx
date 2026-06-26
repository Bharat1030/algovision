import { useState } from 'react'
import { useVisualizerStore } from '../store/useVisualizerStore'

export function Controls() {
  const isPlaying = useVisualizerStore((state) => state.isPlaying)
  const speed = useVisualizerStore((state) => state.speed)
  const arraySize = useVisualizerStore((state) => state.arraySize)
  const play = useVisualizerStore((state) => state.play)
  const pause = useVisualizerStore((state) => state.pause)
  const stepForward = useVisualizerStore((state) => state.stepForward)
  const stepBackward = useVisualizerStore((state) => state.stepBackward)
  const restart = useVisualizerStore((state) => state.restart)
  const setSpeed = useVisualizerStore((state) => state.setSpeed)
  const generateNewArray = useVisualizerStore((state) => state.generateNewArray)
  const loadCustomArray = useVisualizerStore((state) => state.loadCustomArray)
  const setArraySize = useVisualizerStore((state) => state.setArraySize)

  const [customInput, setCustomInput] = useState('')

  function handleLoadCustomArray() {
    const parsed = customInput
      .split(',')
      .map((n) => Number(n.trim()))
      .filter((n) => !isNaN(n) && n >= 0 && n <= 100)

    if (parsed.length >= 2) {
      loadCustomArray(parsed)
      setCustomInput('')
    }
  }

  return (
    <div className="flex flex-col gap-4 mt-4">

      {/* Row 1: playback buttons + speed */}
      <div className="flex items-center gap-3 font-mono text-sm">
        <button
          onClick={restart}
          className="w-9 h-9 border border-panel-border rounded hover:border-accent transition"
          title="Restart"
        >
          ↺
        </button>

        <button
          onClick={() => (isPlaying ? pause() : play())}
          className={`w-9 h-9 border rounded transition ${
            isPlaying
              ? 'bg-accent border-accent text-bg-deep'
              : 'border-panel-border hover:border-accent'
          }`}
          title="Play / Pause"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button
          onClick={stepBackward}
          className="w-9 h-9 border border-panel-border rounded hover:border-accent transition"
          title="Step back"
        >
          ⏮
        </button>

        <button
          onClick={stepForward}
          className="w-9 h-9 border border-panel-border rounded hover:border-accent transition"
          title="Step forward"
        >
          ⏭
        </button>

        <label className="flex items-center gap-2 ml-2 text-ink-dim">
          speed
          <input
            type="range"
            min={1}
            max={5}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="accent-accent"
          />
        </label>

        <button
          onClick={() => generateNewArray()}
          className="ml-auto px-4 py-2 border border-panel-border rounded hover:border-accent-2 transition text-ink-dim hover:text-ink"
        >
          New Array
        </button>
      </div>

      {/* Row 2: array size slider */}
      <div className="flex items-center gap-4 font-mono text-sm text-ink-dim">
        <span className="shrink-0">size</span>
        <input
          type="range"
          min={4}
          max={40}
          value={arraySize}
          onChange={(e) => setArraySize(Number(e.target.value))}
          className="flex-1 accent-accent"
        />
        <span className="w-6 text-right text-ink">{arraySize}</span>
      </div>

      {/* Row 3: custom array input */}
      <div className="flex flex-col gap-1.5 w-full font-mono text-sm">
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. 40, 10, 90, 25, 60"
            className="flex-1 bg-bg-deep border border-panel-border rounded px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
          />
          <button
            onClick={handleLoadCustomArray}
            className="px-4 py-2 border border-panel-border rounded hover:border-accent-2 transition text-ink-dim hover:text-ink"
          >
            Load Array
          </button>
        </div>
        <p className="text-xs text-ink-faint">
          Accepts comma-separated integers, range 0–100. Out-of-range values are dropped automatically.
        </p>
      </div>

    </div>
  )
}