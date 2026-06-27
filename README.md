# AlgoVision

> A step-by-step algorithm visualizer for programmers who want to actually **see** what their code is doing — not just read about it.

**🔗 Live Demo:** https://algovision-omega.vercel.app/  
**📦 Repository:** https://github.com/Bharat1030/algovision

---

## Overview

AlgoVision is an interactive, production-grade algorithm visualizer built with React and TypeScript. It renders sorting algorithms as animated bar charts, stepping through every comparison and swap in real time — with a synced code panel, live performance stats, and a complexity comparison chart that records actual operation counts across multiple runs.

![AlgoVision](https://algovision-omega.vercel.app/)

---

## Features

- **Step-by-step playback** — play, pause, step forward/backward through every comparison and swap
- **6 sorting algorithms** — bubble, selection, insertion, merge, quick, and heap sort
- **Synced code panel** — active line highlights in real time as the algorithm executes
- **Live stats** — comparisons, swaps, and step count update on every frame
- **Complexity comparison chart** — records actual operation counts from completed runs and visualizes them side by side
- **Custom array input** — enter your own comma-separated values (0–100)
- **Array size slider** — from 4 to 40 elements
- **Speed control** — 5-level slider from slow (learning mode) to fast
- **Keyboard shortcuts** — `Space` play/pause · `→` step forward · `←` step back · `R` restart
- **Completion animation** — green border glow and banner when sort finishes
- **Blueprint aesthetic** — black theme with subtle grid, monospace typography, engineering-drawing panel labels

---

## Algorithms

| Algorithm | Best Case | Average Case | Worst Case | Space |
|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI library and component architecture |
| **TypeScript** | Type safety across the entire codebase |
| **Vite** | Build tooling and dev server |
| **Tailwind CSS v4** | Utility-first styling with CSS-based theme configuration |
| **Zustand** | Lightweight state management for playback engine |
| **React Router v6** | Client-side routing between landing page and visualizer |

---

## Architecture

The core design decision: every algorithm is a **pure function** that takes an input array and returns an array of `Step` objects — one snapshot per meaningful moment (each comparison, swap, or sorted-index update). The UI just plays through that array like a flipbook.

```ts
interface Step {
  array: number[]               // state of the array at this moment
  comparing: [number, number] | null   // indices being compared
  swapping: [number, number] | null    // indices being swapped
  sorted: number[]              // indices confirmed in final position
  codeLine: number              // which line of code this step maps to
  comparisons: number           // running total
  swaps: number                 // running total
}
```

**Why this matters:**
- Adding a new algorithm = writing one new function, zero UI changes
- Play/pause/step-back/speed control are trivially implemented — just move an index through the array
- Algorithm logic is fully decoupled from rendering and can be unit tested independently

### Project Structure

```
src/
├── algorithms/
│   ├── BubbleSort.ts         → generates Step[] for bubble sort
│   ├── SelectionSort.ts      → generates Step[] for selection sort
│   ├── InsertionSort.ts      → generates Step[] for insertion sort
│   ├── MergeSort.ts          → generates Step[] for merge sort
│   ├── QuickSort.ts          → generates Step[] for quick sort
│   └── HeapSort.ts           → generates Step[] for heap sort
├── components/
│   ├── BarChart.tsx          → renders the animated bar visualization
│   ├── Controls.tsx          → playback buttons, speed, size, custom input
│   ├── CodePanel.tsx         → synced code panel with line highlighting
│   └── ComplexityChart.tsx   → live operation count comparison chart
├── pages/
│   ├── Landing.tsx           → landing page with hero, features, catalog
│   └── Visualizer.tsx        → main visualizer page
├── store/
│   └── useVisualizerStore.ts → Zustand store: steps, playback state, history
└── types/
    └── index.ts              → shared Step and AlgorithmInfo types
```

### State Flow

```
User action (play/step/dropdown)
    ↓
Zustand store action
    ↓
Store updates currentStepIndex / steps / isPlaying
    ↓
React re-renders BarChart, CodePanel, Controls, ComplexityChart
    ↓
UI reflects new state
```

No prop drilling. No direct DOM manipulation. Pure unidirectional data flow.

---

## Running Locally

```bash
# Clone the repository
git clone https://github.com/Bharat1030/algovision.git
cd algovision

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `→` | Step forward |
| `←` | Step back |
| `R` | Restart |

---

## Roadmap

- [ ] Graph algorithm visualizer (BFS, DFS, Dijkstra) with interactive grid editor
- [ ] Documentation page with per-algorithm deep-dives and complexity guides
- [ ] Mobile responsiveness polish
- [ ] Share button — generate a URL with current algorithm + array encoded
- [ ] Export as GIF

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

[MIT](LICENSE)

---

<p align="center">Built by <a href="https://github.com/Bharat1030">Bharat</a> · <a href="https://algovision-omega.vercel.app/">Live Demo</a></p>
