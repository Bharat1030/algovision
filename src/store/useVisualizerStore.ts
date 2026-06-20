import { create } from 'zustand'
import type { Step } from '../types'
import { bubbleSort } from '../algorithms/BubbleSort'

function randomArray(size: number, max: number): number[] {
  return Array.from({ length: size }, () => 8 + Math.floor(Math.random() * max))
}

interface VisualizerState {
  steps: Step[]
  currentStepIndex: number
  isPlaying: boolean
  speed: number // 1 (slow) to 5 (fast)

  // actions
  generateNewArray: (size?: number) => void
  loadCustomArray: (arr: number[]) => void
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

  generateNewArray: (size = 16) => {
    const newSteps = bubbleSort(randomArray(size, 95))
    set({ steps: newSteps, currentStepIndex: 0, isPlaying: false })
  },

  loadCustomArray: (arr: number[]) => {
    const newSteps = bubbleSort(arr)
    set({ steps: newSteps, currentStepIndex: 0, isPlaying: false })
  },

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