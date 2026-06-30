import {
  checkClosedBoxesAfterEdge,
} from '@/utils/dotsAndBoxesUtils/checkClosedBoxes'

import type {
  DotsAndBoxesEdge,
} from '@/components/svg/dotsAndBoxes/DotsAndBoxesBoardSvg'

type Props = {
  edges: DotsAndBoxesEdge[]
  boxRows: number
  boxCols: number
}

type CandidateMove = {
  edgeId: string
  score: number
  reason: string
}

const getRandomItem = <T,>(
  items: T[],
): T => {
  const index = Math.floor(Math.random() * items.length)

  return items[index]
}

const getEdgeScore = ({
  edges,
  edge,
  boxRows,
  boxCols,
}: {
  edges: DotsAndBoxesEdge[]
  edge: DotsAndBoxesEdge
  boxRows: number
  boxCols: number
}) => {
  const nextEdges = edges.map((currentEdge) => {
    if (currentEdge.id !== edge.id) return currentEdge

    return {
      ...currentEdge,
      isVisible: true,
    }
  })

  const closedBoxes = checkClosedBoxesAfterEdge({
    edges: nextEdges,
    edge,
    boxRows,
    boxCols,
  })

  if (closedBoxes.length > 0) {
    return {
      score: 1000 + closedBoxes.length * 100,
      reason: 'closes box',
    }
  }

  const opponentDangerEdges = nextEdges
    .filter((currentEdge) => !currentEdge.isVisible)
    .filter((currentEdge) => {
      const opponentNextEdges = nextEdges.map((maybeEdge) => {
        if (maybeEdge.id !== currentEdge.id) return maybeEdge

        return {
          ...maybeEdge,
          isVisible: true,
        }
      })

      const opponentClosedBoxes = checkClosedBoxesAfterEdge({
        edges: opponentNextEdges,
        edge: currentEdge,
        boxRows,
        boxCols,
      })

      return opponentClosedBoxes.length > 0
    })

  if (opponentDangerEdges.length === 0) {
    return {
      score: 100,
      reason: 'safe move',
    }
  }

  return {
    score: -opponentDangerEdges.length * 50,
    reason: 'least dangerous move',
  }
}

export const suggestDotsAndBoxesMove = ({
  edges,
  boxRows,
  boxCols,
}: Props): CandidateMove | null => {
  const emptyEdges = edges.filter((edge) =>
    !edge.isVisible
  )

  if (emptyEdges.length === 0) {
    return null
  }

  const candidates = emptyEdges.map((edge) => {
    const result = getEdgeScore({
      edges,
      edge,
      boxRows,
      boxCols,
    })

    return {
      edgeId: edge.id,
      score: result.score,
      reason: result.reason,
    }
  })

  const bestScore = Math.max(
    ...candidates.map((candidate) => candidate.score),
  )

  const bestCandidates = candidates.filter((candidate) =>
    candidate.score === bestScore
  )

  return getRandomItem(bestCandidates)
}