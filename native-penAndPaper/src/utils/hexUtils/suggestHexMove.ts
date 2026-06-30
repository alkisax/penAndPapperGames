import {
  checkHexWinner,
  getHexNeighbors,
} from '@/utils/hexUtils/hexUtils'

import type {
  HexCell,
  HexPlayer,
} from '@/utils/hexUtils/hexUtils'

type Props = {
  cells: HexCell[]
  aiPlayer: HexPlayer
  boardSize: number
}

type CandidateMove = {
  cellId: number
  score: number
  reason: string
}

const INF = Number.POSITIVE_INFINITY

const getOpponent = (
  player: HexPlayer,
): HexPlayer => {
  if (player === 'player1') {
    return 'player2'
  }

  return 'player1'
}

const getCellCost = (
  cell: HexCell,
  player: HexPlayer,
) => {
  // Δικό μου cell:
  // είναι ήδη μέρος της αλυσίδας μου, άρα κόστος 0.
  if (cell.owner === player) {
    return 0
  }

  // Άδειο cell:
  // μπορώ να το πάρω με μία μελλοντική κίνηση, άρα κόστος 1.
  if (cell.owner === null) {
    return 1
  }

  // Cell αντιπάλου:
  // δεν μπορώ ποτέ να το χρησιμοποιήσω, άρα είναι τοίχος.
  return INF
}

const getConnectionDistance = ({
  cells,
  player,
  boardSize,
}: {
  cells: HexCell[]
  player: HexPlayer
  boardSize: number
}) => {
  // Αυτός ο αλγόριθμος απαντά:
  // "πόσες επιπλέον πέτρες περίπου χρειάζεται ο player
  // για να ενώσει τις δύο πλευρές του;"
  //
  // Δικά του cells = κόστος 0
  // Άδεια cells = κόστος 1
  // Αντίπαλα cells = απαγορευμένα

  const distances = new Map<number, number>()

  const queue: HexCell[] = []

  const startCells = cells.filter((cell) => {
    if (player === 'player1') {
      return cell.col === 0
    }

    return cell.row === 0
  })

  startCells.forEach((cell) => {
    const cost = getCellCost(cell, player)

    if (cost === INF) return

    distances.set(cell.id, cost)
    queue.push(cell)
  })

  while (queue.length > 0) {
    // Για μικρό board 7x7 / 9x9 αυτό είναι απολύτως οκ.
    // Δεν χρειαζόμαστε ακόμα priority queue.
    queue.sort((a, b) => {
      const distanceA = distances.get(a.id) ?? INF
      const distanceB = distances.get(b.id) ?? INF

      return distanceA - distanceB
    })

    const currentCell = queue.shift()

    if (!currentCell) continue

    const currentDistance =
      distances.get(currentCell.id) ?? INF

    const hasReachedTarget =
      player === 'player1'
        ? currentCell.col === boardSize - 1
        : currentCell.row === boardSize - 1

    if (hasReachedTarget) {
      return currentDistance
    }

    const neighbors = getHexNeighbors(
      currentCell,
      cells,
    )

    neighbors.forEach((neighbor) => {
      const neighborCost = getCellCost(
        neighbor,
        player,
      )

      if (neighborCost === INF) return

      const nextDistance =
        currentDistance + neighborCost

      const oldDistance =
        distances.get(neighbor.id) ?? INF

      if (nextDistance >= oldDistance) return

      distances.set(neighbor.id, nextDistance)
      queue.push(neighbor)
    })
  }

  return INF
}

const applyMove = ({
  cells,
  cellId,
  player,
}: {
  cells: HexCell[]
  cellId: number
  player: HexPlayer
}) => {
  return cells.map((cell) => {
    if (cell.id !== cellId) return cell

    return {
      ...cell,
      owner: player,
    }
  })
}

const getCenterBonus = (
  cell: HexCell,
  boardSize: number,
) => {
  // Μικρό bonus για πιο κεντρικές θέσεις.
  // Στο Hex το κέντρο συνήθως έχει περισσότερες δυνατότητες σύνδεσης.
  const center = (boardSize - 1) / 2

  const rowDistance = Math.abs(cell.row - center)
  const colDistance = Math.abs(cell.col - center)

  return boardSize - rowDistance - colDistance
}

const getNeighborBonus = ({
  cell,
  cells,
  aiPlayer,
}: {
  cell: HexCell
  cells: HexCell[]
  aiPlayer: HexPlayer
}) => {
  // Μικρό bonus αν το move ακουμπάει ήδη δικά μου stones.
  // Αυτό ενθαρρύνει το AI να χτίζει αλυσίδες αντί να παίζει τελείως random.
  const neighbors = getHexNeighbors(
    cell,
    cells,
  )

  const ownNeighbors = neighbors.filter((neighbor) =>
    neighbor.owner === aiPlayer
  ).length

  return ownNeighbors * 3
}

const getImmediateOpponentWinningCells = ({
  cells,
  opponent,
  boardSize,
}: {
  cells: HexCell[]
  opponent: HexPlayer
  boardSize: number
}) => {
  // Βρίσκουμε όλα τα άδεια cells όπου αν παίξει ο αντίπαλος,
  // κερδίζει αμέσως στην επόμενη κίνηση.
  return cells
    .filter((cell) => cell.owner === null)
    .filter((cell) => {
      const nextCells = applyMove({
        cells,
        cellId: cell.id,
        player: opponent,
      })

      return checkHexWinner({
        cells: nextCells,
        player: opponent,
        boardSize,
      })
    })
    .map((cell) => cell.id)
}

export const suggestHexMove = ({
  cells,
  aiPlayer,
  boardSize,
}: Props): CandidateMove | null => {
  const opponent = getOpponent(aiPlayer)

  const emptyCells = cells.filter((cell) =>
    cell.owner === null
  )

  if (emptyCells.length === 0) {
    return null
  }

  const currentAiDistance = getConnectionDistance({
    cells,
    player: aiPlayer,
    boardSize,
  })

  const currentOpponentDistance = getConnectionDistance({
    cells,
    player: opponent,
    boardSize,
  })

  const immediateOpponentWinningCells =
    getImmediateOpponentWinningCells({
      cells,
      opponent,
      boardSize,
    })

  const candidates = emptyCells.map((cell) => {
    const nextCells = applyMove({
      cells,
      cellId: cell.id,
      player: aiPlayer,
    })

    const aiWinsNow = checkHexWinner({
      cells: nextCells,
      player: aiPlayer,
      boardSize,
    })

    const aiDistanceAfterMove = getConnectionDistance({
      cells: nextCells,
      player: aiPlayer,
      boardSize,
    })

    const opponentDistanceAfterMove = getConnectionDistance({
      cells: nextCells,
      player: opponent,
      boardSize,
    })

    // Αν η δική μου απόσταση πέφτει, αυτό είναι καλό.
    const ownProgress =
      currentAiDistance - aiDistanceAfterMove

    // Αν η απόσταση του αντιπάλου ανεβαίνει, αυτό είναι καλό.
    const opponentBlocked =
      opponentDistanceAfterMove - currentOpponentDistance

    const blocksImmediateWin =
      immediateOpponentWinningCells.includes(cell.id)

    const centerBonus = getCenterBonus(
      cell,
      boardSize,
    )

    const neighborBonus = getNeighborBonus({
      cell,
      cells,
      aiPlayer,
    })

    let score = 0

    if (aiWinsNow) {
      score += 10000
    }

    if (blocksImmediateWin) {
      score += 5000
    }

    score += ownProgress * 120
    score += opponentBlocked * 100
    score += centerBonus * 2
    score += neighborBonus

    let reason = 'best evaluated move'

    if (aiWinsNow) {
      reason = 'winning move'
    } else if (blocksImmediateWin) {
      reason = 'blocks opponent win'
    } else if (ownProgress > 0) {
      reason = 'improves own connection'
    } else if (opponentBlocked > 0) {
      reason = 'slows opponent connection'
    }

    return {
      cellId: cell.id,
      score,
      reason,
    }
  })

  return candidates.reduce((best, current) => {
    if (current.score > best.score) {
      return current
    }

    return best
  })
}