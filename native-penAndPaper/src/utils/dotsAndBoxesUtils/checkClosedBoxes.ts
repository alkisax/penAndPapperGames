export type DotsAndBoxesEdge = {
  id: string
  row: number
  col: number
  orientation: 'horizontal' | 'vertical'
  color: string
  isVisible: boolean
}

export type DotsAndBoxesBox = {
  id: string
  row: number
  col: number
}

const getEdgeById = (
  edges: DotsAndBoxesEdge[],
  edgeId: string,
) => {
  return edges.find((edge) => edge.id === edgeId)
}

const isEdgeVisible = (
  edges: DotsAndBoxesEdge[],
  edgeId: string,
) => {
  const edge = getEdgeById(edges, edgeId)

  return edge?.isVisible === true
}

const isBoxClosed = ({
  edges,
  row,
  col,
}: {
  edges: DotsAndBoxesEdge[]
  row: number
  col: number
}) => {
  const topEdgeId = `h-${row}-${col}`
  const bottomEdgeId = `h-${row + 1}-${col}`
  const leftEdgeId = `v-${row}-${col}`
  const rightEdgeId = `v-${row}-${col + 1}`

  return (
    isEdgeVisible(edges, topEdgeId) &&
    isEdgeVisible(edges, bottomEdgeId) &&
    isEdgeVisible(edges, leftEdgeId) &&
    isEdgeVisible(edges, rightEdgeId)
  )
}

export const checkClosedBoxesAfterEdge = ({
  edges,
  edge,
  boxRows,
  boxCols,
}: {
  edges: DotsAndBoxesEdge[]
  edge: DotsAndBoxesEdge
  boxRows: number
  boxCols: number
}): DotsAndBoxesBox[] => {
  const candidateBoxes: DotsAndBoxesBox[] = []

  if (edge.orientation === 'horizontal') {
    const boxAbove = {
      row: edge.row - 1,
      col: edge.col,
    }

    const boxBelow = {
      row: edge.row,
      col: edge.col,
    }

    candidateBoxes.push(
      {
        id: `box-${boxAbove.row}-${boxAbove.col}`,
        row: boxAbove.row,
        col: boxAbove.col,
      },
      {
        id: `box-${boxBelow.row}-${boxBelow.col}`,
        row: boxBelow.row,
        col: boxBelow.col,
      },
    )
  }

  if (edge.orientation === 'vertical') {
    const boxLeft = {
      row: edge.row,
      col: edge.col - 1,
    }

    const boxRight = {
      row: edge.row,
      col: edge.col,
    }

    candidateBoxes.push(
      {
        id: `box-${boxLeft.row}-${boxLeft.col}`,
        row: boxLeft.row,
        col: boxLeft.col,
      },
      {
        id: `box-${boxRight.row}-${boxRight.col}`,
        row: boxRight.row,
        col: boxRight.col,
      },
    )
  }

  return candidateBoxes
    .filter((box) =>
      box.row >= 0 &&
      box.row < boxRows &&
      box.col >= 0 &&
      box.col < boxCols
    )
    .filter((box) =>
      isBoxClosed({
        edges,
        row: box.row,
        col: box.col,
      })
    )
}