import type {
  DotsAndBoxesEdge,
} from '@/components/svg/dotsAndBoxes/DotsAndBoxesBoardSvg'

export const createDotsAndBoxesEdges = (
  rows: number,
  cols: number,
  lineColor: string,
): DotsAndBoxesEdge[] => {
  const edges: DotsAndBoxesEdge[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 1; col++) {
      edges.push({
        id: `h-${row}-${col}`,
        row,
        col,
        orientation: 'horizontal',
        color: lineColor,
        isVisible: false,
      })
    }
  }

  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols; col++) {
      edges.push({
        id: `v-${row}-${col}`,
        row,
        col,
        orientation: 'vertical',
        color: lineColor,
        isVisible: false,
      })
    }
  }

  return edges
}