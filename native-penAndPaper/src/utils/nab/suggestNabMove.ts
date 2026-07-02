import { getAllAvailableNabMoves } from './nabGameUtils'
import type { NabCell } from './nabSvgUtils'

export type SuggestedNabMove = {
  fromCellId: number
  toCellId: number
  usedCellIds: number[]
}

type SuggestNabMoveParams = {
  cells: NabCell[]
  usedCellIds: number[]
}

export const suggestNabMove = ({
  cells,
  usedCellIds,
}: SuggestNabMoveParams): SuggestedNabMove | null => {
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

    // Καλό: αφήνω 1 κύκλο, άρα ο άλλος αναγκάζεται να πάρει τον τελευταίο.
    if (remainingCells === 1) {
      score += 1000
    }

    // Κακό: παίρνω εγώ τον τελευταίο.
    if (remainingCells === 0) {
      score -= 1000
    }

    // Προτίμηση σε λίγο μεγαλύτερες κινήσεις.
    score += newUsedCellIds.length * 8

    // Randomness για να μη γίνεται πάντα ίδια επιλογή.
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