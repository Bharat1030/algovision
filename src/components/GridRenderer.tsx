import type { Cell, CellType } from '../types/graphTypes'

const CELL_COLORS: Record<CellType, string> = {
  empty: 'bg-bg-deep hover:bg-panel-border cursor-pointer',
  wall: 'bg-ink-faint cursor-pointer',
  start: 'bg-accent-2 cursor-pointer',
  end: 'bg-red-400 cursor-pointer',
  visited: 'bg-blue-900/60',
  visiting: 'bg-blue-400/40',
  path: 'bg-yellow-400',
}

const CELL_GLOW: Partial<Record<CellType, string>> = {
  start: '0 0 8px 2px rgba(52,211,153,0.6)',
  end: '0 0 8px 2px rgba(248,113,113,0.6)',
  path: '0 0 6px 2px rgba(250,204,21,0.4)',
}

interface GridRendererProps {
  grid: Cell[][]
  onCellClick: (row: number, col: number) => void
  onCellDrag: (row: number, col: number) => void
}

export function GridRenderer({ grid, onCellClick, onCellDrag }: GridRendererProps) {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0

  return (
    <div
      className="border border-panel-border bg-bg-deep p-2 rounded-sm select-none"
      onMouseLeave={() => {}}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '2px',
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`
                aspect-square rounded-sm transition-all duration-100
                ${CELL_COLORS[cell.type]}
              `}
              style={{
                boxShadow: CELL_GLOW[cell.type] ?? 'none',
                minWidth: '14px',
                minHeight: '14px',
              }}
              onMouseDown={() => onCellClick(r, c)}
              onMouseEnter={(e) => {
                if (e.buttons === 1) onCellDrag(r, c)
              }}
            />
          ))
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 font-mono text-[11px] text-ink-faint">
        {[
          { color: 'bg-accent-2', label: 'start' },
          { color: 'bg-red-400', label: 'end' },
          { color: 'bg-ink-faint', label: 'wall' },
          { color: 'bg-blue-900/60', label: 'visited' },
          { color: 'bg-yellow-400', label: 'path' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <i className={`w-2.5 h-2.5 rounded-sm not-italic inline-block ${color}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}