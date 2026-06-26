import type { Step } from '../types'

export function heapSort(input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = []
  let comparisons = 0
  let swaps = 0
  const sortedIndices: number[] = []
  const n = arr.length

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [],
    codeLine: 0,
    comparisons,
    swaps,
  })

  function heapify(arr: number[], n: number, i: number) {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    if (left < n) {
      comparisons++
      steps.push({
        array: [...arr],
        comparing: [largest, left],
        swapping: null,
        sorted: [...sortedIndices],
        codeLine: 1,
        comparisons,
        swaps,
      })
      if (arr[left] > arr[largest]) largest = left
    }

    if (right < n) {
      comparisons++
      steps.push({
        array: [...arr],
        comparing: [largest, right],
        swapping: null,
        sorted: [...sortedIndices],
        codeLine: 1,
        comparisons,
        swaps,
      })
      if (arr[right] > arr[largest]) largest = right
    }

    if (largest !== i) {
      ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
      swaps++
      steps.push({
        array: [...arr],
        comparing: null,
        swapping: [i, largest],
        sorted: [...sortedIndices],
        codeLine: 2,
        comparisons,
        swaps,
      })
      heapify(arr, n, largest)
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i)
  }

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [...sortedIndices],
    codeLine: 3,
    comparisons,
    swaps,
  })

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    swaps++
    sortedIndices.unshift(i)
    steps.push({
      array: [...arr],
      comparing: null,
      swapping: [0, i],
      sorted: [...sortedIndices],
      codeLine: 4,
      comparisons,
      swaps,
    })
    heapify(arr, i, 0)
  }

  sortedIndices.unshift(0)
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