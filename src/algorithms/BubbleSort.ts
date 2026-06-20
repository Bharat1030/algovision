import type { Step } from '../types'

export function bubbleSort(input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = []
  let comparisons = 0
  let swaps = 0
  const sortedIndices: number[] = []

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [],
    codeLine: 0,
    comparisons,
    swaps,
  })

  const n = arr.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: null,
        sorted: [...sortedIndices],
        codeLine: 1,
        comparisons,
        swaps,
      })

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swaps++
        steps.push({
          array: [...arr],
          comparing: null,
          swapping: [j, j + 1],
          sorted: [...sortedIndices],
          codeLine: 2,
          comparisons,
          swaps,
        })
      }
    }
    sortedIndices.unshift(n - 1 - i)
    steps.push({
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: [...sortedIndices],
      codeLine: 3,
      comparisons,
      swaps,
    })
  }

  sortedIndices.unshift(0)
  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [...sortedIndices],
    codeLine: 4,
    comparisons,
    swaps,
  })

  return steps
}

export const bubbleSortCode = [
  'function bubbleSort(arr) {',
  '  if (arr[j] > arr[j + 1])',
  '    swap(arr[j], arr[j + 1])',
  '  // mark index sorted',
  '  return arr',
  '}',
]