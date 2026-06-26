import type { Step } from '../types'

export function mergeSort(input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = []
  let comparisons = 0
  let swaps = 0

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [],
    codeLine: 0,
    comparisons,
    swaps,
  })

  function mergeSortHelper(arr: number[], left: number, right: number) {
    if (left >= right) return

    const mid = Math.floor((left + right) / 2)
    mergeSortHelper(arr, left, mid)
    mergeSortHelper(arr, mid + 1, right)
    merge(arr, left, mid, right)
  }

  function merge(arr: number[], left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)

    let i = 0, j = 0, k = left

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++
      steps.push({
        array: [...arr],
        comparing: [left + i, mid + 1 + j],
        swapping: null,
        sorted: [],
        codeLine: 1,
        comparisons,
        swaps,
      })

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        i++
      } else {
        arr[k] = rightArr[j]
        j++
        swaps++
        steps.push({
          array: [...arr],
          comparing: null,
          swapping: [k, mid + 1 + j - 1],
          sorted: [],
          codeLine: 2,
          comparisons,
          swaps,
        })
      }
      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      i++
      k++
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      j++
      k++
    }

    steps.push({
      array: [...arr],
      comparing: null,
      swapping: null,
      sorted: [],
      codeLine: 3,
      comparisons,
      swaps,
    })
  }

  mergeSortHelper(arr, 0, arr.length - 1)

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: Array.from({ length: arr.length }, (_, i) => i),
    codeLine: 4,
    comparisons,
    swaps,
  })

  return steps
}