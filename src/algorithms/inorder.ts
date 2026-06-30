import type { TreeNode, TreeStep } from '../types/treeTypes'

export function inorder(root: TreeNode): TreeStep[] {
  const steps: TreeStep[] = []
  const visitedOrder: number[] = []

  function traverse(node: TreeNode | null) {
    if (node === null) return

    steps.push({
      visitedOrder: [...visitedOrder],
      current: node.id,
      codeLine: 2,
    })

    traverse(node.left)

    visitedOrder.push(node.id)
    steps.push({
      visitedOrder: [...visitedOrder],
      current: node.id,
      codeLine: 3,
    })

    traverse(node.right)
  }

  traverse(root)

  steps.push({
    visitedOrder: [...visitedOrder],
    current: null,
    codeLine: -1,
  })

  return steps
}