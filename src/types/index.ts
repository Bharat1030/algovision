export interface Step {
  array: number[]
  comparing: [number, number] | null
  swapping: [number, number] | null
  sorted: number[]
  codeLine: number
  comparisons: number
  swaps: number
}

export interface AlgorithmInfo {
  id: string
  name: string
  category: 'sorting' | 'searching' | 'graph'
  timeComplexity: string
  spaceComplexity: string
  code: string[]
}