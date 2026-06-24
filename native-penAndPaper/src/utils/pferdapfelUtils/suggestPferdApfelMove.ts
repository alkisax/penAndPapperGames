// native-penAndPaper\src\utils\pferdapfelUtils\suggestPferdApfelMove.ts
import {
  getRemainingMoves,
  isSamePosition,
} from '@/utils/pferdapfelUtils/pferdApfelUtils'

import type {
  BlockedCell,
  Position,
} from '@/utils/pferdapfelUtils/pferdApfelUtils'

type Props = {
  currentPosition: Position
  opponentPosition: Position
  blockedCells: BlockedCell[]
}

const getDistance = (
  a: Position,
  b: Position,
) => {
  const rowDiff = a.row - b.row
  const colDiff = a.col - b.col

  return Math.sqrt(
    rowDiff * rowDiff +
    colDiff * colDiff,
  )
}

export const suggestPferdApfelMove = ({
  currentPosition,
  opponentPosition,
  blockedCells,
}: Props): Position | null => {
  const legalMoves = getRemainingMoves(
    currentPosition,
    blockedCells,
  )

  if (legalMoves.length === 0) {
    return null
  }

  // 1. Αν υπάρχει άμεσο capture, παίξ' το.
  const captureMove = legalMoves.find((move) =>
    isSamePosition(move, opponentPosition)
  )

  if (captureMove) {
    return captureMove
  }

  // 2. Αλλιώς παίξε την κίνηση που φέρνει το άλογο πιο κοντά στον αντίπαλο.
  const bestMove = legalMoves.reduce((best, current) => {
    const bestDistance = getDistance(
      best,
      opponentPosition,
    )

    const currentDistance = getDistance(
      current,
      opponentPosition,
    )

    if (currentDistance < bestDistance) {
      return current
    }

    return best
  })

  return bestMove
}