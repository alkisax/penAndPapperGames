import type {
  CollectorCell,
} from '@/components/svg/collector/CollectorCellsLayer'

import {
  areAdjacent,
} from '@/utils/collector/collectorUtils'

import type {
  CollectorPlayer,
} from '@/utils/collector/collectorUtils'

export type CollectorSuggestedMove = {
  markCellId: string
  blockCellId: string
}

type ScoredMove = CollectorSuggestedMove & {
  score: number
}

const getOpponent = (
  player: CollectorPlayer,
): CollectorPlayer => {
  return player === 'player1'
    ? 'player2'
    : 'player1'
}

const getEmptyCells = (
  cells: CollectorCell[],
) => {
  return cells.filter((cell) =>
    cell.state === 'empty'
  )
}

const getPlayerCells = (
  cells: CollectorCell[],
  player: CollectorPlayer,
) => {
  return cells.filter((cell) =>
    cell.state === player
  )
}

const getAdjacentCells = (
  targetCell: CollectorCell,
  cells: CollectorCell[],
) => {
  return cells.filter((cell) =>
    areAdjacent(targetCell, cell)
  )
}

const countAdjacentPlayerCells = (
  targetCell: CollectorCell,
  cells: CollectorCell[],
  player: CollectorPlayer,
) => {
  return getAdjacentCells(targetCell, cells)
    .filter((cell) =>
      cell.state === player
    )
    .length
}

const getLegalMoves = (
  cells: CollectorCell[],
): CollectorSuggestedMove[] => {
  const emptyCells = getEmptyCells(cells)

  const moves: CollectorSuggestedMove[] = []

  emptyCells.forEach((markCell) => {
    emptyCells.forEach((blockCell) => {
      if (markCell.id === blockCell.id) return
      if (!areAdjacent(markCell, blockCell)) return

      moves.push({
        markCellId: markCell.id,
        blockCellId: blockCell.id,
      })
    })
  })

  return moves
}

const getCellById = (
  cells: CollectorCell[],
  cellId: string,
) => {
  return cells.find((cell) =>
    cell.id === cellId
  )
}

const scoreMove = (
  move: CollectorSuggestedMove,
  cells: CollectorCell[],
  player: CollectorPlayer,
) => {
  const opponent = getOpponent(player)

  const markCell = getCellById(
    cells,
    move.markCellId,
  )

  const blockCell = getCellById(
    cells,
    move.blockCellId,
  )

  if (!markCell || !blockCell) return -999

  let score = 0

  const ownAdjacentCount =
    countAdjacentPlayerCells(
      markCell,
      cells,
      player,
    )

  const opponentAdjacentToBlockCount =
    countAdjacentPlayerCells(
      blockCell,
      cells,
      opponent,
    )

  const opponentAdjacentToMarkCount =
    countAdjacentPlayerCells(
      markCell,
      cells,
      opponent,
    )

  const ownAdjacentToBlockCount =
    countAdjacentPlayerCells(
      blockCell,
      cells,
      player,
    )

  // Προτιμά να βάζει τελεία κοντά στις δικές του.
  score += ownAdjacentCount * 5

  // Προτιμά να μπλοκάρει κελιά κοντά στον αντίπαλο.
  score += opponentAdjacentToBlockCount * 4

  // Λίγο αποφεύγει να δώσει χώρο δίπλα στον αντίπαλο.
  score -= opponentAdjacentToMarkCount * 2

  // Λίγο αποφεύγει να καίει δικό του χώρο.
  score -= ownAdjacentToBlockCount * 1

  // Μικρή τυχαιότητα για να μην παίζει πάντα ίδιο move.
  score += Math.random() * 3

  return score
}

export const suggestCollectorMove = (
  cells: CollectorCell[],
  player: CollectorPlayer,
): CollectorSuggestedMove | null => {
  const legalMoves = getLegalMoves(cells)

  if (legalMoves.length === 0) {
    return null
  }

  const scoredMoves: ScoredMove[] = legalMoves.map((move) => {
    return {
      ...move,
      score: scoreMove(
        move,
        cells,
        player,
      ),
    }
  })

  scoredMoves.sort((a, b) =>
    b.score - a.score
  )

  // Παίρνουμε ένα από τα top moves, όχι πάντα το πρώτο.
  const topMoves = scoredMoves.slice(0, 5)

  const randomIndex = Math.floor(
    Math.random() * topMoves.length,
  )

  return topMoves[randomIndex]
}