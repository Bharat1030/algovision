import { useNavigate, useLocation } from 'react-router-dom'

const PAGES = [
  { path: '/visualizer', label: 'Sorting' },
  { path: '/graph', label: 'Pathfinding' },
  { path: '/tree', label: 'Tree Traversal' },
]

export function AppNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="border-b border-panel-border sticky top-0 z-50 backdrop-blur-sm bg-bg/80">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/')}
          className="font-mono font-semibold text-sm flex items-center gap-2 hover:text-accent transition shrink-0"
        >
          <span className="w-2 h-2 bg-accent rotate-45 inline-block" />
          ALGOVISION
        </button>

        <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {PAGES.map((page) => {
            const isActive = location.pathname === page.path
            return (
              <button
                key={page.path}
                onClick={() => navigate(page.path)}
                className={`font-mono text-xs px-3 py-1.5 whitespace-nowrap border rounded-sm transition shrink-0 ${
                  isActive
                    ? 'bg-accent text-bg-deep border-accent font-semibold'
                    : 'text-ink-dim border-panel-border hover:border-accent hover:text-ink'
                }`}
              >
                {page.label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}