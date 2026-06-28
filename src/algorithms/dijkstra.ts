import type { Cell, GraphStep } from '../types/graphTypes'

function cloneGrid(grid: Cell[][]): Cell[][] {
  return grid.map(row => row.map(cell => ({ ...cell })))
}

export function dijkstra(
  initialGrid: Cell[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): GraphStep[] {
  const steps: GraphStep[] = []
  const grid = cloneGrid(initialGrid)
  const rows = grid.length
  const cols = grid[0].length

  const dist: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity))
  const parent: ([number, number] | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null))
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false))

  dist[startRow][startCol] = 0
  const pq: [number, number, number][] = []
  pq.push([0, startRow, startCol])

  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  let found = false
  let visitedCount = 0

  steps.push({ grid: cloneGrid(grid), visitedCount: 0, pathLength: 0, current: [startRow, startCol], done: false, found: false, codeLine: 0 })

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0])
    const [d, row, col] = pq.shift()!

    if (visited[row][col]) continue
    visited[row][col] = true

    steps.push({ grid: cloneGrid(grid), visitedCount, pathLength: 0, current: [row, col], done: false, found: false, codeLine: 4 })

    if (row === endRow && col === endCol) {
      found = true
      steps.push({ grid: cloneGrid(grid), visitedCount, pathLength: 0, current: [row, col], done: false, found: true, codeLine: 5 })
      break
    }

    if (grid[row][col].type !== 'start' && grid[row][col].type !== 'end') {
      grid[row][col].type = 'visited'
      visitedCount++
    }

    steps.push({ grid: cloneGrid(grid), visitedCount, pathLength: 0, current: [row, col], done: false, found: false, codeLine: 6 })

    for (const [dr, dc] of directions) {
      const nr = row + dr
      const nc = col + dc

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc].type !== 'wall') {
        const weight = grid[nr][nc].weight ?? 1
        const newDist = d + weight

        if (newDist < dist[nr][nc]) {
          dist[nr][nc] = newDist
          parent[nr][nc] = [row, col]
          if (grid[nr][nc].type !== 'end') grid[nr][nc].type = 'visiting'
          pq.push([newDist, nr, nc])
          steps.push({ grid: cloneGrid(grid), visitedCount, pathLength: 0, current: [nr, nc], done: false, found: false, codeLine: 10 })
        }
      }
    }
  }

  let pathLength = 0
  if (found) {
    let cur: [number, number] | null = [endRow, endCol]
    const path: [number, number][] = []
    while (cur) { path.unshift(cur); cur = parent[cur[0]][cur[1]] }

    for (const [r, c] of path) {
      if (grid[r][c].type !== 'start' && grid[r][c].type !== 'end') {
        grid[r][c].type = 'path'
        pathLength++
      }
      steps.push({ grid: cloneGrid(grid), visitedCount, pathLength, current: [r, c], done: false, found: true, codeLine: 12 })
    }
  }

  steps.push({ grid: cloneGrid(grid), visitedCount, pathLength, current: null, done: true, found, codeLine: 13 })
  return steps
}