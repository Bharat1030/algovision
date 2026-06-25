import type { Step } from '../types'

export function selectionSort(input: number[]): Step[] {
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
    let minIdx = i

    for (let j = i + 1; j < n; j++) {
      comparisons++
      steps.push({
        array: [...arr],
        comparing: [minIdx, j],
        swapping: null,
        sorted: [...sortedIndices],
        codeLine: 1,
        comparisons,
        swaps,
      })

      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({
          array: [...arr],
          comparing: [minIdx, j],
          swapping: null,
          sorted: [...sortedIndices],
          codeLine: 2,
          comparisons,
          swaps,
        })
      }
    }

    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      swaps++
      steps.push({
        array: [...arr],
        comparing: null,
        swapping: [i, minIdx],
        sorted: [...sortedIndices],
        codeLine: 3,
        comparisons,
        swaps,
      })
    }

    sortedIndices.push(i)
    steps.push({
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: [...sortedIndices],
      codeLine: 4,
      comparisons,
      swaps,
    })
  }

  sortedIndices.push(n - 1)
  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [...sortedIndices],
    codeLine: 5,
    comparisons,
    swaps,
  })

  return steps
}

export const selectionSortCode = [
  'function selectionSort(arr) {',
  '  find minimum in unsorted region',
  '  update minIdx if smaller found',
  '  swap minimum into position i',
  '  mark index i as sorted',
  '  return arr',
  '}',
]