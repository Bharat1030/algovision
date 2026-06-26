import { create } from 'zustand'
import type { Step } from '../types'
import { bubbleSort } from '../algorithms/BubbleSort'
import { selectionSort } from '../algorithms/SelectionSort'
import { mergeSort } from '../algorithms/MergeSort'
import { quickSort } from '../algorithms/QuickSort'
import { insertionSort } from '../algorithms/InsertionSort'
import { heapSort } from '../algorithms/HeapSort'

export type AlgorithmKey = 'bubble' | 'selection' | 'merge' | 'quick' | 'insertion' | 'heap'

export interface RunRecord {
  algorithm: AlgorithmKey
  algorithmName: string
  arraySize: number
  comparisons: number
  swaps: number
  totalOps: number
}

export const ALGORITHMS: Record<AlgorithmKey, {
  name: string
  complexity: string
  fn: (arr: number[]) => Step[]
  code: string[]
}> = {
  bubble: {
    name: 'Bubble Sort',
    complexity: 'O(n²)',
    fn: bubbleSort,
    code: [
      'function bubbleSort(arr) {',
      '  if (arr[j] > arr[j + 1])',
      '    swap(arr[j], arr[j + 1])',
      '  // mark index sorted',
      '  return arr',
      '}',
    ],
  },
  selection: {
    name: 'Selection Sort',
    complexity: 'O(n²)',
    fn: selectionSort,
    code: [
      'function selectionSort(arr) {',
      '  find minimum in unsorted region',
      '  if (arr[j] < arr[minIdx]) minIdx = j',
      '  swap(arr[i], arr[minIdx])',
      '  mark index i as sorted',
      '  return arr',
      '}',
    ],
  },
  insertion: {
    name: 'Insertion Sort',
    complexity: 'O(n²)',
    fn: insertionSort,
    code: [
      'function insertionSort(arr) {',
      '  compare arr[j] with arr[j-1]',
      '  swap if arr[j] < arr[j-1]',
      '  mark current index as sorted',
      '  return arr',
      '}',
    ],
  },
  merge: {
    name: 'Merge Sort',
    complexity: 'O(n log n)',
    fn: mergeSort,
    code: [
      'function mergeSort(arr) {',
      '  compare left[i] and right[j]',
      '  place smaller element into arr',
      '  merge halves back together',
      '  return sorted arr',
      '}',
    ],
  },
  quick: {
    name: 'Quick Sort',
    complexity: 'O(n log n)',
    fn: quickSort,
    code: [
      'function quickSort(arr) {',
      '  compare arr[j] with pivot',
      '  swap arr[i] and arr[j]',
      '  place pivot in correct position',
      '  pivot is now sorted',
      '  return sorted arr',
      '}',
    ],
  },
  heap: {
    name: 'Heap Sort',
    complexity: 'O(n log n)',
    fn: heapSort,
    code: [
      'function heapSort(arr) {',
      '  compare parent with children',
      '  swap to maintain heap property',
      '  max heap built successfully',
      '  extract max and heapify',
      '  return sorted arr',
      '}',
    ],
  },
}

function randomArray(size: number, max: number): number[] {
  return Array.from({ length: size }, () => 8 + Math.floor(Math.random() * max))
}

interface VisualizerState {
  steps: Step[]
  currentStepIndex: number
  isPlaying: boolean
  speed: number
  arraySize: number
  currentAlgorithm: AlgorithmKey
  runHistory: RunRecord[]

  setAlgorithm: (key: AlgorithmKey) => void
  generateNewArray: (size?: number) => void
  loadCustomArray: (arr: number[]) => void
  setArraySize: (size: number) => void
  recordRun: () => void
  clearHistory: () => void
  play: () => void
  pause: () => void
  stepForward: () => void
  stepBackward: () => void
  restart: () => void
  setSpeed: (speed: number) => void
}

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  steps: bubbleSort(randomArray(16, 95)),
  currentStepIndex: 0,
  isPlaying: false,
  speed: 3,
  arraySize: 16,
  currentAlgorithm: 'bubble',
  runHistory: [],

  setAlgorithm: (key: AlgorithmKey) => {
    const { arraySize } = get()
    const arr = randomArray(arraySize, 95)
    const newSteps = ALGORITHMS[key].fn(arr)
    set({
      currentAlgorithm: key,
      steps: newSteps,
      currentStepIndex: 0,
      isPlaying: false,
    })
  },

  generateNewArray: (size?: number) => {
    const { currentAlgorithm, arraySize } = get()
    const finalSize = size ?? arraySize
    const arr = randomArray(finalSize, 95)
    const newSteps = ALGORITHMS[currentAlgorithm].fn(arr)
    set({ steps: newSteps, currentStepIndex: 0, isPlaying: false })
  },

  setArraySize: (size: number) => {
    const { currentAlgorithm } = get()
    const arr = randomArray(size, 95)
    const newSteps = ALGORITHMS[currentAlgorithm].fn(arr)
    set({
      arraySize: size,
      steps: newSteps,
      currentStepIndex: 0,
      isPlaying: false,
    })
  },

  loadCustomArray: (arr: number[]) => {
    const { currentAlgorithm } = get()
    const newSteps = ALGORITHMS[currentAlgorithm].fn(arr)
    set({ steps: newSteps, currentStepIndex: 0, isPlaying: false })
  },

  recordRun: () => {
    const { steps, currentAlgorithm, arraySize, runHistory } = get()
    const lastStep = steps[steps.length - 1]
    if (!lastStep) return
    const record: RunRecord = {
      algorithm: currentAlgorithm,
      algorithmName: ALGORITHMS[currentAlgorithm].name,
      arraySize,
      comparisons: lastStep.comparisons,
      swaps: lastStep.swaps,
      totalOps: lastStep.comparisons + lastStep.swaps,
    }
    set({ runHistory: [...runHistory, record] })
  },

  clearHistory: () => set({ runHistory: [] }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  stepForward: () => {
    const { currentStepIndex, steps } = get()
    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 })
    } else {
      set({ isPlaying: false })
    }
  },

  stepBackward: () => {
    const { currentStepIndex } = get()
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 })
    }
  },

  restart: () => set({ currentStepIndex: 0, isPlaying: false }),
  setSpeed: (speed) => set({ speed }),
}))