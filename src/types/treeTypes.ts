export interface TreeNode {
  id: number
  value: number
  left: TreeNode | null
  right: TreeNode | null
  x: number
  y: number
}

export type NodeState = 'idle' | 'visiting' | 'visited'

export interface TreeStep {
  visitedOrder: number[]
  current: number | null
  codeLine: number
}

export type TraversalKey = 'inorder' | 'preorder' | 'postorder'

export interface TraversalInfo {
  name: string
  description: string
  order: string
  timeComplexity: string
  spaceComplexity: string
  code: string[]
}

export const TRAVERSALS: Record<TraversalKey, TraversalInfo> = {
  inorder: {
    name: 'In-order Traversal',
    description: 'Visits the left subtree, then the root, then the right subtree. On a binary search tree, this produces values in sorted order.',
    order: 'Left → Root → Right',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    code: [
      'function inorder(node) {',
      '  if (node === null) return',
      '  inorder(node.left)',
      '  visit(node)',
      '  inorder(node.right)',
      '}',
    ],
  },
  preorder: {
    name: 'Pre-order Traversal',
    description: 'Visits the root first, then the left subtree, then the right subtree. Useful for copying or serializing a tree.',
    order: 'Root → Left → Right',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    code: [
      'function preorder(node) {',
      '  if (node === null) return',
      '  visit(node)',
      '  preorder(node.left)',
      '  preorder(node.right)',
      '}',
    ],
  },
  postorder: {
    name: 'Post-order Traversal',
    description: 'Visits the left subtree, then the right subtree, then the root. Useful for safely deleting a tree, since children are processed before parents.',
    order: 'Left → Right → Root',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    code: [
      'function postorder(node) {',
      '  if (node === null) return',
      '  postorder(node.left)',
      '  postorder(node.right)',
      '  visit(node)',
      '}',
    ],
  },
}

let nodeIdCounter = 0

function insertBST(root: TreeNode | null, value: number): TreeNode {
  if (root === null) {
    return { id: nodeIdCounter++, value, left: null, right: null, x: 0, y: 0 }
  }
  if (value < root.value) {
    root.left = insertBST(root.left, value)
  } else if (value > root.value) {
    root.right = insertBST(root.right, value)
  }
  // duplicates are ignored
  return root
}

function getHeight(node: TreeNode | null): number {
  if (!node) return 0
  return 1 + Math.max(getHeight(node.left), getHeight(node.right))
}

// Assigns x positions using in-order index, y positions using depth
function assignPositions(node: TreeNode | null, depth: number, counter: { x: number }, totalLeaves: number, maxDepth: number) {
  if (!node) return
  assignPositions(node.left, depth + 1, counter, totalLeaves, maxDepth)

  node.x = (counter.x / Math.max(totalLeaves - 1, 1)) * 86 + 7
  node.y = (depth / Math.max(maxDepth - 1, 1)) * 50 + 8
  counter.x++

  assignPositions(node.right, depth + 1, counter, totalLeaves, maxDepth)
}

function countNodes(node: TreeNode | null): number {
  if (!node) return 0
  return 1 + countNodes(node.left) + countNodes(node.right)
}

export function buildBST(values: number[]): TreeNode | null {
  nodeIdCounter = 0
  let root: TreeNode | null = null
  for (const v of values) {
    root = insertBST(root, v)
  }
  if (!root) return null

  const totalNodes = countNodes(root)
  const maxDepth = getHeight(root)
  assignPositions(root, 0, { x: 0 }, totalNodes, maxDepth)

  return root
}

export function buildSampleTree(): TreeNode {
  return buildBST([50, 30, 70, 20, 40, 60, 80])!
}