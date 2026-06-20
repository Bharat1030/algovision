# AlgoVision

An interactive algorithm visualizer that shows step-by-step how sorting algorithms work — built for programmers who want to actually see what their code is doing, not just read about it.

## What it does

- Watch a bubble sort run on a randomized array, one comparison and swap at a time
- Play, pause, step forward/backward through the algorithm
- Adjust playback speed
- Load your own custom array (0–100, comma-separated) to test specific cases
- Live stats: comparison count, swap count, current step

## Built with

- React + TypeScript — UI and logic
- Vite — build tooling and dev server
- Tailwind CSS v4 — styling
- Zustand — state management for the visualizer engine

## How it's structured

The core idea: every algorithm is a pure function that takes an input and returns an array of Step objects — one snapshot per comparison/swap. The UI just plays through that array. This keeps the algorithm logic completely separate from rendering, so adding a new algorithm later means writing one new function, not touching the UI.

src/
├── algorithms/    -> step-generator functions (e.g. bubbleSort.ts)
├── components/    -> BarChart, Controls
├── store/         -> Zustand store driving playback state
├── types/         -> shared Step type

## Running it locally

npm install
npm run dev

Then open the local URL it gives you (usually http://localhost:5173).

## Roadmap

- [ ] Synced code panel showing the active line as the algorithm runs
- [ ] More algorithms: selection sort, quick sort, merge sort
- [ ] Graph algorithms (BFS, DFS, Dijkstra) with an interactive grid editor
- [ ] Algorithm picker / dropdown

## License

MIT