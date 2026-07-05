import type {
  ImpariumCell,
} from '@/components/svg/imparium/ImpariumBoardSvg'

import {
  areOrthogonallyAdjacent,
  claimNewClosedRegions,
  countImpariumClaimedCells,
  getCoveredState,
} from '@/utils/imparium/impariumUtils'

import type {
  ImpariumPlayer,
} from '@/utils/imparium/impariumUtils'

export type ImpariumSuggestedMove = {
  firstCellId: string
  secondCellId: string
}

type SuggestImpariumMoveParams = {
  cells: ImpariumCell[]
  player: ImpariumPlayer
}

const getAllLegalImpariumMoves = (
  cells: ImpariumCell[],
): ImpariumSuggestedMove[] => {
  const moves: ImpariumSuggestedMove[] = []

  const emptyCells = cells.filter((cell) =>
    cell.state === 'empty'
  )

  for (const firstCell of emptyCells) {
    for (const secondCell of emptyCells) {
      if (firstCell.id === secondCell.id) continue

      if (
        !areOrthogonallyAdjacent(
          firstCell,
          secondCell,
        )
      ) {
        continue
      }

      // Για να μην έχουμε διπλά:
      // A-B και B-A είναι το ίδιο domino.
      if (firstCell.id > secondCell.id) continue

      moves.push({
        firstCellId: firstCell.id,
        secondCellId: secondCell.id,
      })
    }
  }

  return moves
}

const simulateImpariumMove = ({
  cells,
  move,
  player,
}: {
  cells: ImpariumCell[]
  move: ImpariumSuggestedMove
  player: ImpariumPlayer
}) => {
  const cellsAfterDomino: ImpariumCell[] = cells.map((cell) => {
    if (
      cell.id === move.firstCellId ||
      cell.id === move.secondCellId
    ) {
      return {
        ...cell,
        state: getCoveredState(player),
      }
    }

    return cell
  })

  return claimNewClosedRegions(
    cellsAfterDomino,
    player,
  )
}

export const suggestImpariumMove = ({
  cells,
  player,
}: SuggestImpariumMoveParams): ImpariumSuggestedMove | null => {
  const legalMoves = getAllLegalImpariumMoves(cells)

  if (legalMoves.length === 0) {
    return null
  }

  const currentScore =
    countImpariumClaimedCells(cells)

  const currentPlayerScore =
    player === 'player1'
      ? currentScore.player1Score
      : currentScore.player2Score

  const scoredMoves = legalMoves.map((move) => {
    const simulatedCells = simulateImpariumMove({
      cells,
      move,
      player,
    })

    const nextScore =
      countImpariumClaimedCells(simulatedCells)

    const nextPlayerScore =
      player === 'player1'
        ? nextScore.player1Score
        : nextScore.player2Score

    const gainedCells =
      nextPlayerScore - currentPlayerScore

    let score = 0

    // Πρώτη προτεραιότητα: πάρε odd περιοχή.
    score += gainedCells * 100

    // Μικρό random για να μην παίζει πάντα ακριβώς ίδια.
    score += Math.random() * 10

    return {
      move,
      score,
    }
  })

  scoredMoves.sort((a, b) =>
    b.score - a.score
  )

  const topMoves = scoredMoves.slice(0, 4)

  const randomIndex = Math.floor(
    Math.random() * topMoves.length,
  )

  return topMoves[randomIndex].move
}