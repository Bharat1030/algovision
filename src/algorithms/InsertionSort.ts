import type { Step } from '../types'

export function insertionSort(input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = []
  let comparisons = 0
  let swaps = 0
  const sortedIndices: number[] = [0]

  steps.push({
    array: [...arr],
    comparing: null,
    swapping: null,
    sorted: [...sortedIndices],
    codeLine: 0,
    comparisons,
    swaps,
  })

  for (let i = 1; i < arr.length; i++) {
    let j = i

    while (j > 0) {
      comparisons++
      steps.push({
        array: [...arr],
        comparing: [j, j - 1],
        swapping: null,
        sorted: [...sortedIndices],
        codeLine: 1,
        comparisons,
        swaps,
      })

      if (arr[j] < arr[j - 1]) {
        ;[arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
        swaps++
        steps.push({
          array: [...arr],
          comparing: null,
          swapping: [j, j - 1],
          sorted: [...sortedIndices],
          codeLine: 2,
          comparisons,
          swaps,
        })
        j--
      } else {
        break
      }
    }

    sortedIndices.push(i)
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