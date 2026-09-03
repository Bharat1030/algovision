import { useState, useEffect } from 'react'
import { TreeRenderer } from '../components/TreeRenderer'
import { inorder } from '../algorithms/inorder'
import { preorder } from '../algorithms/preorder'
import { postorder } from '../algorithms/postorder'
import { buildSampleTree, buildBST, TRAVERSALS } from '../types/treeTypes'
import type { TreeStep, TraversalKey, TreeNode } from '../types/treeTypes'
import { AppNav } from '../components/AppNav'

const KEYWORDS = ['function', 'if', 'return', 'visit']

function highlightLine(line: string) {
  const parts = line.split(/(\s+)/)

  return parts.map((part, i) => {
    if (KEYWORDS.some(kw => part.startsWith(kw))) {
      return (
        <span key={i} className="text-accent">
          {part}
        </span>
      )
    }

    return <span key={i}>{part}</span>
  })
}

function findValue(node: TreeNode | null, id: number): number | null {
  if (!node) return null
  if (node.id === id) return node.value

  return findValue(node.left, id) ?? findValue(node.right, id)
}

export function TreePage() {
  const [tree, setTree] = useState<TreeNode>(() => buildSampleTree())
  const [customInput, setCustomInput] = useState('')

  const [traversal, setTraversal] =
    useState<TraversalKey>('inorder')

  const [steps, setSteps] = useState<TreeStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(3)
  const [hasRun, setHasRun] = useState(false)

  const info = TRAVERSALS[traversal]
  const currentStep = steps[currentStepIndex] ?? null

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return

    const delay = 700 - speed * 100

    const timer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false)
          return prev
        }

        return prev + 1
      })
    }, Math.max(delay, 50))

    return () => clearInterval(timer)
  }, [isPlaying, speed, steps])

  function run() {
    let newSteps: TreeStep[] = []

    if (traversal === 'inorder') {
      newSteps = inorder(tree)
    } else if (traversal === 'preorder') {
      newSteps = preorder(tree)
    } else {
      newSteps = postorder(tree)
    }

    setSteps(newSteps)
    setCurrentStepIndex(0)
    setHasRun(true)
    setIsPlaying(true)
  }

  function reset() {
    setSteps([])
    setCurrentStepIndex(0)
    setIsPlaying(false)
    setHasRun(false)
  }

  function handleLoadCustomTree() {
    const parsed = customInput
      .split(',')
      .map(n => Number(n.trim()))
      .filter(
        n => !isNaN(n) && n >= 1 && n <= 999
      )

    if (parsed.length >= 1 && parsed.length <= 15) {
      const newTree = buildBST(parsed)

      if (newTree) {
        setTree(newTree)
        reset()
        setCustomInput('')
      }
    }
  }

  function loadRandomTree() {
    const values = Array.from(
      {
        length: 7 + Math.floor(Math.random() * 4)
      },
      () => 1 + Math.floor(Math.random() * 99)
    )

    const newTree = buildBST(values)

    if (newTree) {
      setTree(newTree)
      reset()
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLInputElement
      ) {
        return
      }

      switch (e.key) {
        case ' ':
          e.preventDefault()

          if (!hasRun) {
            run()
          } else {
            setIsPlaying(p => !p)
          }

          break

        case 'ArrowRight':
          e.preventDefault()

          setCurrentStepIndex(p =>
            Math.min(p + 1, steps.length - 1)
          )

          break

        case 'ArrowLeft':
          e.preventDefault()

          setCurrentStepIndex(p =>
            Math.max(p - 1, 0)
          )

          break

        case 'r':
        case 'R':
          reset()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () =>
      window.removeEventListener('keydown', handleKeyDown)
  }, [hasRun, steps])

  const isComplete =
    hasRun &&
    steps.length > 0 &&
    currentStepIndex === steps.length - 1

  const activeLine = currentStep?.codeLine ?? -1

  return (
    <div className="min-h-screen text-ink font-body">
      <AppNav />

      <main className="max-w-6xl mx-auto px-8 py-12">

        {/* Title block */}
        <div className="border border-panel-border bg-panel p-5 font-mono text-xs text-ink-faint grid grid-cols-3 gap-x-4 gap-y-3 max-w-md mb-10">

          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">
              Traversal
            </b>

            <span className="text-ink text-[13px]">
              {info.name}
            </span>
          </div>

          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">
              Order
            </b>

            <span className="text-ink text-[13px]">
              {info.order}
            </span>
          </div>

          <div>
            <b className="block text-ink-dim text-[10px] tracking-wide uppercase mb-1">
              Status
            </b>

            <span className="text-accent-2 text-[13px]">
              {isComplete
                ? 'Complete'
                : isPlaying
                  ? 'Running'
                  : 'Idle'}
            </span>
          </div>
        </div>

        {/* Heading + dropdown */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">

          <div>
            <h1 className="font-display font-semibold text-4xl mb-2">
              Tree <span className="text-accent">Traversal</span>
            </h1>

            <p className="text-ink-dim max-w-md">
              {info.description}
            </p>

            <div className="flex gap-3 mt-3 flex-wrap">

              {[
                {
                  key: 'Space',
                  label: hasRun ? 'play / pause' : 'run'
                },
                {
                  key: '→',
                  label: 'step forward'
                },
                {
                  key: '←',
                  label: 'step back'
                },
                {
                  key: 'R',
                  label: 'reset'
                }
              ].map(({ key, label }) => (
                <span
                  key={key}
                  className="flex items-center gap-1.5 font-mono text-[11px] text-ink-faint"
                >
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
              Traversal
            </label>

            <select
              value={traversal}
              onChange={e => {
                setTraversal(
                  e.target.value as TraversalKey
                )
                reset()
              }}
              className="bg-panel border border-panel-border text-ink font-mono text-sm px-4 py-2 focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="inorder">
                In-order
              </option>

              <option value="preorder">
                Pre-order
              </option>

              <option value="postorder">
                Post-order
              </option>
            </select>

          </div>
        </div>

        {/* Visualizer panel */}
        <div className="border border-panel-border bg-panel relative">

          <div className="absolute -top-[11px] left-4 bg-bg px-2 font-mono text-[10px] tracking-wide text-accent">
            FIG. 04 — {info.name.toUpperCase()}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">

            {/* Left: tree + controls */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-panel-border">

              <TreeRenderer
                root={tree}
                currentStep={currentStep}
              />

              {/* Custom input row */}
              <div className="flex flex-col gap-1.5 mt-5 font-mono text-sm">

                <div className="flex gap-2 w-full flex-wrap">

                  <input
                    type="text"
                    value={customInput}
                    onChange={e =>
                      setCustomInput(e.target.value)
                    }
                    placeholder="e.g. 50, 30, 70, 20, 40, 60, 80"
                    className="flex-1 min-w-[180px] bg-bg-deep border border-panel-border rounded px-3 py-2 text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
                  />

                  <button
                    onClick={handleLoadCustomTree}
                    className="px-4 py-2 border border-panel-border rounded hover:border-accent-2 transition text-ink-dim hover:text-ink"
                  >
                    Build Tree
                  </button>

                  <button
                    onClick={loadRandomTree}
                    className="px-4 py-2 border border-panel-border rounded hover:border-accent transition text-ink-dim hover:text-ink"
                  >
                    Random
                  </button>

                </div>

                <p className="text-xs text-ink-faint">
                  Comma-separated integers, 1–999, up to 15
                  values. Inserted in order to form a binary
                  search tree. Duplicates are ignored.
                </p>

              </div>

              {/* Playback controls */}
              <div className="flex items-center gap-3 mt-4 font-mono text-sm flex-wrap">

                <button
                  onClick={reset}
                  className="w-9 h-9 border border-panel-border rounded hover:border-accent transition"
                >
                  ↺
                </button>

                <button
                  onClick={() => {
                    if (!hasRun) {
                      run()
                    } else {
                      setIsPlaying(p => !p)
                    }
                  }}
                  className={`w-9 h-9 border rounded transition ${
                    isPlaying
                      ? 'bg-accent border-accent text-bg-deep'
                      : 'border-panel-border hover:border-accent'
                  }`}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>

                <button
                  onClick={() =>
                    setCurrentStepIndex(p =>
                      Math.max(p - 1, 0)
                    )
                  }
                  disabled={!hasRun}
                  className="w-9 h-9 border border-panel-border rounded hover:border-accent transition disabled:opacity-30"
                >
                  ⏮
                </button>

                <button
                  onClick={() =>
                    setCurrentStepIndex(p =>
                      Math.min(
                        p + 1,
                        Math.max(steps.length - 1, 0)
                      )
                    )
                  }
                  disabled={!hasRun}
                  className="w-9 h-9 border border-panel-border rounded hover:border-accent transition disabled:opacity-30"
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
                    onChange={e =>
                      setSpeed(Number(e.target.value))
                    }
                    className="accent-accent"
                  />

                </label>

                <button
                  onClick={() => {
                    reset()
                    setTimeout(run, 50)
                  }}
                  className="ml-auto px-4 py-2 bg-accent text-bg-deep font-semibold rounded hover:opacity-90 transition"
                >
                  Run →
                </button>

              </div>

              {/* Statistics */}
              {hasRun && currentStep && (
                <div className="flex gap-7 mt-5 font-mono text-xs text-ink-dim">

                  <div>
                    <span className="block text-2xl font-display text-ink">
                      {currentStep.visitedOrder.length}
                    </span>

                    nodes visited
                  </div>

                  <div>
                    <span className="block text-2xl font-display text-ink">
                      {currentStepIndex} / {steps.length - 1}
                    </span>

                    step
                  </div>

                </div>
              )}

              {!hasRun && (
                <p className="mt-4 font-mono text-xs text-ink-faint">
                  Press Run or Space to start the traversal.
                </p>
              )}

              {/* Completion message */}
              {isComplete && (
                <div className="mt-4 px-4 py-3 border border-accent-2/40 bg-accent-2/10 text-accent-2 font-mono text-sm">
                  ✓ Traversal complete — order:{' '}
                  {currentStep?.visitedOrder
                    .map(id => findValue(tree, id))
                    .join(', ')}
                </div>
              )}

            </div>

            {/* Right: code panel */}
            <div className="flex flex-col h-full min-h-[400px]">

              <div className="flex items-center justify-between px-4 py-3 border-b border-panel-border bg-panel">

                <span className="font-mono text-[11px] tracking-widest uppercase text-ink-dim">
                  {info.name}
                </span>

                <span className="font-mono text-[10px] text-ink-faint">
                  line {activeLine + 1} / {info.code.length}
                </span>

              </div>

              <div className="flex-1 bg-bg-deep p-4 font-mono text-sm overflow-auto">

                {info.code.map((line, index) => {

                  const isActive =
                    index === activeLine

                  return (
                    <div
                      key={index}
                      className={`flex gap-4 px-3 py-1 transition-all duration-150 border-l-2 ${
                        isActive
                          ? 'bg-accent/10 border-accent'
                          : 'border-transparent hover:bg-panel/40'
                      }`}
                    >

                      <span
                        className={`select-none w-4 text-right shrink-0 text-xs mt-0.5 ${
                          isActive
                            ? 'text-accent'
                            : 'text-ink-faint'
                        }`}
                      >
                        {index + 1}
                      </span>

                      <span
                        className={
                          isActive
                            ? 'text-ink'
                            : 'text-ink-dim'
                        }
                      >
                        {highlightLine(line)}
                      </span>

                    </div>
                  )
                })}

              </div>

              <div className="px-4 py-3 border-t border-panel-border bg-panel min-h-[56px] flex items-center gap-3">

                <span className="w-1.5 h-1.5 rounded-full bg-accent-2 shrink-0 inline-block" />

                <p className="font-mono text-xs text-ink-dim leading-relaxed">

                  {!hasRun &&
                    'Press Run to begin the traversal.'}

                  {hasRun && currentStep && (
                    <>
                      Visiting node value{' '}
                      <b className="text-ink">
                        {currentStep.current !== null
                          ? findValue(
                              tree,
                              currentStep.current
                            )
                          : '—'}
                      </b>
                    </>
                  )}

                </p>

              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  )
}