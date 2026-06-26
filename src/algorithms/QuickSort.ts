import type { Step } from '../types'

export function quickSort(input: number[]): Step[] {
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

  function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      comparisons++
      steps.push({
        array: [...arr],
        comparing: [j, high],
        swapping: null,
        sorted: [...sortedIndices],
        codeLine: 1,
        comparisons,
        swaps,
      })

      if (arr[j] <= pivot) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        swaps++
        steps.push({
          array: [...arr],
          comparing: null,
          swapping: [i, j],
          sorted: [...sortedIndices],
          codeLine: 2,
          comparisons,
          swaps,
        })
      }
    }

    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    swaps++
    steps.push({
      array: [...arr],
      comparing: null,
      swapping: [i + 1, high],
      sorted: [...sortedIndices],
      codeLine: 3,
      comparisons,
      swaps,
    })

    return i + 1
  }

  function quickSortHelper(arr: number[], low: number, high: number) {
    if (low < high) {
      const pivotIdx = partition(arr, low, high)
      sortedIndices.push(pivotIdx)
      steps.push({
        array: [...arr],
        comparing: null,
        swapping: null,
        sorted: [...sortedIndices],
        codeLine: 4,
        comparisons,
        swaps,
      })
      quickSortHelper(arr, low, pivotIdx - 1)
      quickSortHelper(arr, pivotIdx + 1, high)
    }
  }

  quickSortHelper(arr, 0, arr.length - 1)

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: Array.from({ length: arr.length }, (_, i) => i),
    codeLine: 5,
    comparisons,
    swaps,
  })

  return steps
} 