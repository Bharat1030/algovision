import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const NAV_LINKS = ['Algorithms', 'Documentation', 'Benchmarks', 'Community']

const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-time Execution',
    desc: 'See into the algorithm directly on the AST, reflecting every memory mutation and pointer move with millisecond precision.',
  },
  {
    icon: '🌐',
    title: 'Multi-lang Support',
    desc: 'Supports JS, Python, C++, and Rust. See how different languages handle the same logic under the hood.',
  },
  {
    icon: '🔢',
    title: 'Step-by-Step',
    desc: 'Go forward, backward, or jump to specific breakpoints in the execution timeline.',
  },
  {
    icon: '📊',
    title: 'Advanced Benchmarking',
    desc: 'Compare multiple algorithms side-by-side to understand trade-offs in time and space complexity with live data sets.',
  },
]

/* ---- Category visuals ---- */

function SortingPreview() {
  const [cmp, setCmp] = useState(0)
  const bars = [40, 70, 30, 85, 55, 65, 20, 90]
  useEffect(() => {
    const t = setInterval(() => setCmp((p) => (p + 1) % (bars.length - 1)), 400)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex items-end gap-[3px] h-14">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-sm transition-all duration-200 ${i === cmp || i === cmp + 1 ? 'bg-accent' : 'bg-ink-faint/40'}`}
          style={{
            height: `${h}%`,
            transform: i === cmp || i === cmp + 1 ? 'translateY(-4px)' : 'none',
            boxShadow: i === cmp || i === cmp + 1 ? '0 0 8px 2px rgba(232,121,249,0.5)' : 'none',
          }}
        />
      ))}
    </div>
  )
}

function PathfindingPreview() {
  const grid = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 2],
  ]
  const [step, setStep] = useState(0)
  const pathCells = [[1,1],[2,1],[3,1],[3,2],[3,3],[2,3],[1,3],[1,4],[1,5],[2,5],[3,5],[4,5],[4,6]]
  useEffect(() => {
    const t = setInterval(() => setStep((p) => (p + 1) % (pathCells.length + 4)), 300)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex flex-col gap-[3px] h-14">
      {grid.map((row, r) => (
        <div key={r} className="flex gap-[3px] flex-1">
          {row.map((cell, c) => {
            const isPath = pathCells.slice(0, step).some(([pr, pc]) => pr === r && pc === c)
            const isWall = cell === 1
            const isEnd = cell === 2
            return (
              <div
                key={c}
                className={`flex-1 rounded-sm transition-all duration-200 ${
                  isEnd ? 'bg-accent-2' :
                  isPath ? 'bg-blue-400' :
                  isWall ? 'bg-panel-border' :
                  'bg-ink-faint/20'
                }`}
                style={{
                  boxShadow: isPath ? '0 0 4px 1px rgba(96,165,250,0.5)' : 'none',
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function GraphPreview() {
  const [active, setActive] = useState(0)
  const nodes = [
    { x: 50, y: 20 },
    { x: 20, y: 60 },
    { x: 80, y: 60 },
    { x: 35, y: 90 },
    { x: 65, y: 90 },
  ]
  const edges = [[0,1],[0,2],[1,3],[2,4],[1,2]]
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % nodes.length), 600)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="h-14 relative">
      <svg viewBox="0 0 100 110" className="w-full h-full">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x} cy={n.y} r="6"
            fill={i === active ? 'rgba(52,211,153,1)' : 'rgba(255,255,255,0.15)'}
            style={{
              filter: i === active ? 'drop-shadow(0 0 4px rgba(52,211,153,0.8))' : 'none',
              transition: 'fill 0.3s ease',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

function TreePreview() {
  const [active, setActive] = useState(0)
  const nodes = [
    { x: 50, y: 15, label: '8' },
    { x: 25, y: 45, label: '3' },
    { x: 75, y: 45, label: '12' },
    { x: 12, y: 75, label: '1' },
    { x: 38, y: 75, label: '5' },
    { x: 88, y: 75, label: '15' },
  ]
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5]]
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % nodes.length), 500)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="h-14 relative">
      <svg viewBox="0 0 100 95" className="w-full h-full">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1.5"
          />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle
              cx={n.x} cy={n.y} r="8"
              fill={i === active ? 'rgba(251,146,60,1)' : 'rgba(255,255,255,0.1)'}
              stroke={i === active ? 'rgba(251,146,60,0.5)' : 'rgba(255,255,255,0.1)'}
              strokeWidth="1"
              style={{
                filter: i === active ? 'drop-shadow(0 0 4px rgba(251,146,60,0.8))' : 'none',
                transition: 'fill 0.3s ease',
              }}
            />
            <text
              x={n.x} y={n.y + 4}
              textAnchor="middle"
              fontSize="6"
              fill={i === active ? '#000' : 'rgba(255,255,255,0.4)'}
              fontFamily="JetBrains Mono"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

const CATEGORIES = [
  {
    name: 'Sorting',
    desc: 'Bubble, Selection, Merge, Heap and more',
    tag: 'O(n log n)',
    tagColor: 'text-accent border-accent/30',
    preview: <SortingPreview />,
  },
  {
    name: 'Pathfinding',
    desc: 'Dijkstra, A*, BFS, Bellman-Ford',
    tag: 'O(V + E)',
    tagColor: 'text-blue-400 border-blue-400/30',
    preview: <PathfindingPreview />,
  },
  {
    name: 'Graphs',
    desc: 'Trees, AVL, Network Flow, and more',
    tag: 'O(V log V)',
    tagColor: 'text-accent-2 border-accent-2/30',
    preview: <GraphPreview />,
  },
  {
    name: 'Data Structures',
    desc: 'Binary Search Trees, Heaps, Tries',
    tag: 'O(log n)',
    tagColor: 'text-orange-400 border-orange-400/30',
    preview: <TreePreview />,
  },
]

function HeroVisualizer() {
  const arr = useRef([65, 30, 80, 20, 55, 45, 75, 10, 90, 40, 60, 15, 70, 35, 50, 25])
  const [state, setState] = useState({ arr: [...arr.current], cmp: 0, comparisons: 0, swaps: 0 })
  const i = useRef(0)
  const j = useRef(0)
  const comparisons = useRef(0)
  const swaps = useRef(0)

  useEffect(() => {
    const n = arr.current.length
    const tick = () => {
      if (j.current < n - 1 - i.current) {
        comparisons.current++
        const newCmp = j.current
        if (arr.current[j.current] > arr.current[j.current + 1]) {
          ;[arr.current[j.current], arr.current[j.current + 1]] = [arr.current[j.current + 1], arr.current[j.current]]
          swaps.current++
        }
        j.current++
        setState({ arr: [...arr.current], cmp: newCmp, comparisons: comparisons.current, swaps: swaps.current })
      } else {
        i.current++
        j.current = 0
        if (i.current >= n - 1) {
          arr.current = [65, 30, 80, 20, 55, 45, 75, 10, 90, 40, 60, 15, 70, 35, 50, 25]
          i.current = 0
          comparisons.current = 0
          swaps.current = 0
        }
      }
    }
    const t = setInterval(tick, 100)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="border border-panel-border bg-panel relative">
      <div className="absolute -top-[11px] left-4 bg-bg px-2 font-mono text-[10px] text-accent tracking-wide">
        FIG. 01 — BUBBLE SORT, LIVE
      </div>
      <div className="grid grid-cols-3 border-b border-panel-border">
        <div className="p-4 border-r border-panel-border">
          <div className="font-mono text-[10px] text-ink-faint uppercase tracking-wide mb-1">Algorithm</div>
          <div className="font-mono text-sm text-ink">Bubble Sort</div>
        </div>
        <div className="p-4 border-r border-panel-border">
          <div className="font-mono text-[10px] text-ink-faint uppercase tracking-wide mb-1">Comparisons</div>
          <div className="font-mono text-sm text-accent">{state.comparisons}</div>
        </div>
        <div className="p-4">
          <div className="font-mono text-[10px] text-ink-faint uppercase tracking-wide mb-1">Complexity</div>
          <div className="font-mono text-sm text-accent-2">O(n²)</div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-end gap-[3px] h-40">
          {state.arr.map((v, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-sm transition-all duration-100 ${i === state.cmp || i === state.cmp + 1 ? 'bg-accent' : 'bg-ink-faint/50'}`}
              style={{
                height: `${v}%`,
                transform: i === state.cmp || i === state.cmp + 1 ? 'translateY(-4px)' : 'none',
                boxShadow: i === state.cmp || i === state.cmp + 1 ? '0 0 10px 2px rgba(232,121,249,0.5)' : 'none',
              }}
            />
          ))}
        </div>
        <div className="flex gap-4 mt-4 font-mono text-[11px] text-ink-faint">
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 bg-ink-faint/50 rounded-sm not-italic inline-block" />idle</span>
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 bg-accent rounded-sm not-italic inline-block" />comparing</span>
        </div>
      </div>
      <div className="border-t border-panel-border px-6 py-3 flex justify-between font-mono text-xs text-ink-faint">
        <span>swaps: <b className="text-ink">{state.swaps}</b></span>
        <span>n = 16</span>
      </div>
    </div>
  )
}

export function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen text-ink font-body">
      {/* Nav */}
      <header className="border-b border-panel-border sticky top-0 z-50 backdrop-blur-sm bg-bg/90">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="font-mono font-semibold text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rotate-45 inline-block" />
            AlgoVision
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" className="font-mono text-xs text-ink-dim hover:text-ink transition">{link}</a>
            ))}
          </nav>
          <button
            onClick={() => navigate('/visualizer')}
            className="font-mono text-xs bg-accent text-bg px-4 py-2 font-semibold hover:opacity-90 transition"
          >
            Launch Visualizer →
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="border-b border-panel-border py-24">
          <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="border border-panel-border bg-panel p-4 font-mono text-xs text-ink-faint grid grid-cols-3 gap-3 max-w-xs mb-10">
                <div><b className="block text-[10px] uppercase tracking-wide text-ink-dim mb-1">Version</b><span className="text-ink">1.0.0</span></div>
                <div><b className="block text-[10px] uppercase tracking-wide text-ink-dim mb-1">Algorithms</b><span className="text-ink">6</span></div>
                <div><b className="block text-[10px] uppercase tracking-wide text-ink-dim mb-1">Stack</b><span className="text-ink">React + TS</span></div>
              </div>
              <h1 className="font-display font-semibold text-5xl lg:text-6xl leading-[1.06] mb-6">
                Watch your<br />algorithms<br /><span className="text-accent italic">think.</span>
              </h1>
              <p className="text-ink-dim text-base max-w-md mb-10 leading-relaxed">
                A step-by-step algorithm visualizer for programmers who want to actually see what their code is doing — not just read about it.
              </p>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => navigate('/visualizer')}
                  className="font-mono text-sm bg-accent text-bg px-6 py-3 font-semibold hover:opacity-90 transition"
                >
                  See the Visualizer
                </button>
                <a href="#catalog" className="font-mono text-sm border border-panel-border text-ink-dim px-6 py-3 hover:border-ink-dim transition">
                  Browse Algorithms
                </a>
              </div>
            </div>
            <HeroVisualizer />
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-panel-border py-20">
          <div className="max-w-6xl mx-auto px-8">
            <div className="mb-12">
              <span className="font-mono text-[11px] text-accent tracking-widest uppercase">Index · 01</span>
              <h2 className="font-display font-semibold text-3xl mt-3">Engineered for Clarity</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-panel-border border border-panel-border">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-bg p-8 hover:bg-panel transition">
                  <div className="w-10 h-10 border border-panel-border flex items-center justify-center text-xl mb-6">
                    {f.icon}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3">{f.title}</h3>
                  <p className="text-ink-dim text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Algorithm Library */}
        <section className="border-b border-panel-border py-20" id="catalog">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="font-mono text-[11px] text-accent tracking-widest uppercase">Index · 02</span>
                <h2 className="font-display font-semibold text-3xl mt-3">Algorithm Library</h2>
              </div>
              <button
                onClick={() => navigate('/visualizer')}
                className="font-mono text-xs text-ink-dim border border-panel-border px-4 py-2 hover:border-accent hover:text-ink transition hidden sm:block"
              >
                See all →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-panel-border border border-panel-border">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.name}
                  className="bg-bg p-6 hover:bg-panel transition cursor-pointer group"
                  onClick={() => navigate('/visualizer')}
                >
                  {cat.preview}
                  <h3 className="font-display font-semibold text-lg mt-5 mb-1 group-hover:text-accent transition">
                    {cat.name}
                  </h3>
                  <p className="text-ink-dim text-xs mb-4">{cat.desc}</p>
                  <span className={`font-mono text-[10px] border px-2 py-1 ${cat.tagColor}`}>
                    {cat.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 border-b border-panel-border">
          <div className="max-w-6xl mx-auto px-8 text-center">
            <h2 className="font-display font-semibold text-4xl mb-4">Ready to visualize?</h2>
            <p className="text-ink-dim mb-10 max-w-md mx-auto">
              Join programmers using AlgoVision to master complex computer science concepts through interaction.
            </p>
            <button
              onClick={() => navigate('/visualizer')}
              className="font-mono text-sm bg-accent text-bg px-8 py-4 font-semibold hover:opacity-90 transition"
            >
              See the Visualizer →
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10 font-mono text-xs">
            <div>
              <div className="font-mono font-semibold text-sm flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-accent rotate-45 inline-block" />
                AlgoVision
              </div>
              <p className="text-ink-faint leading-relaxed">
                Built for people who like to see how things work.
              </p>
            </div>
            {[
              { title: 'Algorithms', links: ['Sorting', 'Pathfinding', 'Graphs', 'Data Structures'] },
              { title: 'Source Code', links: ['GitHub', 'Changelog', 'Roadmap'] },
              { title: 'System Status', links: ['Status Page', 'Engine 21.1'] },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-ink-dim uppercase tracking-wide text-[10px] mb-4">{col.title}</div>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="text-ink-faint hover:text-ink transition">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-panel-border pt-6 flex justify-between items-center font-mono text-[11px] text-ink-faint flex-wrap gap-4">
            <span>© 2026 AlgoVision. React + TypeScript · Tailwind CSS v4</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-ink transition">Architecture</a>
              <a href="#" className="hover:text-ink transition">Source Code</a>
              <a href="#" className="hover:text-ink transition">Privacy Protocol</a>
              <a href="#" className="hover:text-ink transition">System Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}