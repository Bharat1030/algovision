export type CellType =
  | 'empty'
  | 'wall'
  | 'start'
  | 'end'
  | 'visited'
  | 'path'
  | 'visiting'

export interface Cell {
  row: number
  col: number
  type: CellType
  distance: number
  weight: number
}

export interface GraphStep {
  grid: Cell[][]
  visitedCount: number
  pathLength: number
  current: [number, number] | null
  done: boolean
  found: boolean
  codeLine: number
}

export type GraphAlgorithmKey = 'bfs' | 'dfs' | 'dijkstra'

export interface GraphAlgorithmInfo {
  name: string
  description: string
  weighted: boolean
  guaranteesShortestPath: boolean
  timeComplexity: string
  spaceComplexity: string
  code: string[]
}

export const GRAPH_ALGORITHMS: Record<GraphAlgorithmKey, GraphAlgorithmInfo> = {
  bfs: {
    name: 'Breadth-First Search',
    description: 'Explores all neighbors at the current depth before moving deeper. Guarantees the shortest path on unweighted graphs.',
    weighted: false,
    guaranteesShortestPath: true,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    code: [
      'function bfs(grid, start, end) {',
      '  queue.enqueue(start)',
      '  while queue is not empty {',
      '  current = queue.dequeue()',
      '  if current === end → found!',
      '  mark current as visited',
      '  enqueue unvisited neighbors',
      '  }',
      '  traceback path from end → start',
      '  return path',
      '}',
    ],
  },
  dfs: {
    name: 'Depth-First Search',
    description: 'Explores as far as possible along each branch before backtracking. Does not guarantee the shortest path.',
    weighted: false,
    guaranteesShortestPath: false,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    code: [
      'function dfs(grid, start, end) {',
      '  stack.push(start)',
      '  while stack is not empty {',
      '  current = stack.pop()',
      '  if current === end → found!',
      '  mark current as visited',
      '  push unvisited neighbors',
      '  }',
      '  traceback path from end → start',
      '  return path',
      '}',
    ],
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    description: 'Finds the shortest path between nodes using a priority queue. Guarantees the shortest path on weighted graphs.',
    weighted: true,
    guaranteesShortestPath: true,
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    code: [
      'function dijkstra(grid, start, end) {',
      '  dist[start] = 0, all others = ∞',
      '  pq.enqueue(start, priority=0)',
      '  while pq is not empty {',
      '  current = pq.dequeue() // min dist',
      '  if current === end → found!',
      '  mark current as visited',
      '  for each neighbor of current {',
      '  newDist = dist[current] + weight',
      '  if newDist < dist[neighbor]',
      '    update dist, enqueue neighbor',
      '  } }',
      '  traceback path from end → start',
      '}',
    ],
  },
}