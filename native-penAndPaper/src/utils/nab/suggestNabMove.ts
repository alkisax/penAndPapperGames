import { getAllAvailableNabMoves } from './nabGameUtils'
import type { NabMove } from './nabGameUtils'
import type { NabCell } from './nabSvgUtils'

type SuggestNabMoveParams = {
  cells: NabCell[]
  usedCellIds: number[]
}

export const suggestNabMove = ({
  cells,
  usedCellIds,
}: SuggestNabMoveParams): NabMove | null => {
  const availableMoves = getAllAvailableNabMoves(
    cells,
    usedCellIds,
  )

  if (availableMoves.length === 0) return null

  const totalCells = cells.length

  const scoredMoves = availableMoves.map((move) => {
    const newUsedCellIds = move.usedCellIds.filter(
      (cellId) => !usedCellIds.includes(cellId),
    )

    const nextUsedCount =
      usedCellIds.length + newUsedCellIds.length

    const remainingCells =
      totalCells - nextUsedCount

    let score = 0

    if (remainingCells === 1) {
      score += 1000
    }

    if (remainingCells === 0) {
      score -= 1000
    }

    score += newUsedCellIds.length * 8
    score += Math.random() * 25

    return {
      move,
      score,
    }
  })

  scoredMoves.sort((a, b) => b.score - a.score)

  const topMoves = scoredMoves.slice(0, 4)

  const randomIndex = Math.floor(
    Math.random() * topMoves.length,
  )

  return topMoves[randomIndex].move
}