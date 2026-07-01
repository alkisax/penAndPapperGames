import type {
  CollectorCell,
  CollectorCellState,
} from '@/components/svg/collector/CollectorCellsLayer'

export type CollectorPlayer = 'player1' | 'player2'

export type CollectorWinner =
  | CollectorPlayer
  | 'draw'
  | null

export type CollectorConnectionLine = {
  id: string
  fromCellId: string
  toCellId: string
  player: CollectorPlayer
}

export const BOARD_SIZE = 6

export const createCollectorCells = (): CollectorCell[] => {
  return Array.from(
    { length: BOARD_SIZE * BOARD_SIZE },
    (_, index): CollectorCell => {
      const row = Math.floor(index / BOARD_SIZE)
      const col = index % BOARD_SIZE

      return {
        id: `cell-${row}-${col}`,
        row,
        col,
        state: 'empty',
      }
    },
  )
}

export const getNextPlayer = (
  currentPlayer: CollectorPlayer,
): CollectorPlayer => {
  if (currentPlayer === 'player1') {
    return 'player2'
  }

  return 'player1'
}

export const getBlockedState = (
  player: CollectorPlayer,
): CollectorCellState => {
  if (player === 'player1') {
    return 'blocked-player1'
  }

  return 'blocked-player2'
}

export const areAdjacent = (
  first: CollectorCell,
  second: CollectorCell,
) => {
  const rowDiff = Math.abs(first.row - second.row)
  const colDiff = Math.abs(first.col - second.col)

  return (
    rowDiff <= 1 &&
    colDiff <= 1 &&
    !(rowDiff === 0 && colDiff === 0)
  )
}

export const getAdjacentEmptyCells = (
  targetCell: CollectorCell,
  cells: CollectorCell[],
) => {
  return cells.filter((cell) => {
    if (cell.state !== 'empty') return false

    return areAdjacent(targetCell, cell)
  })
}

export const hasLegalTurn = (
  cells: CollectorCell[],
) => {
  const emptyCells = cells.filter((cell) =>
    cell.state === 'empty'
  )

  return emptyCells.some((cell) =>
    getAdjacentEmptyCells(cell, cells).length > 0
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

const getLargestGroupSize = (
  cells: CollectorCell[],
  player: CollectorPlayer,
) => {
  const playerCells = getPlayerCells(
    cells,
    player,
  )

  const visited = new Set<string>()

  let largestGroupSize = 0

  playerCells.forEach((startCell) => {
    if (visited.has(startCell.id)) return

    const queue: CollectorCell[] = [startCell]
    let groupSize = 0

    while (queue.length > 0) {
      const currentCell = queue.shift()

      if (!currentCell) continue
      if (visited.has(currentCell.id)) continue

      visited.add(currentCell.id)
      groupSize += 1

      const neighbors = playerCells.filter((cell) => {
        if (visited.has(cell.id)) return false

        return areAdjacent(currentCell, cell)
      })

      queue.push(...neighbors)
    }

    if (groupSize > largestGroupSize) {
      largestGroupSize = groupSize
    }
  })

  return largestGroupSize
}

export const isCollectorPlayer = (
  state: CollectorCellState,
): state is CollectorPlayer => {
  return (
    state === 'player1' ||
    state === 'player2'
  )
}

export const createAllConnectionLines = (
  cells: CollectorCell[],
): CollectorConnectionLine[] => {
  const playerCells = cells.filter((cell) =>
    isCollectorPlayer(cell.state)
  )

  const lines: CollectorConnectionLine[] = []

  playerCells.forEach((cell) => {
    playerCells.forEach((otherCell) => {
      if (cell.id >= otherCell.id) return
      if (cell.state !== otherCell.state) return
      if (!areAdjacent(cell, otherCell)) return
      if (!isCollectorPlayer(cell.state)) return

      lines.push({
        id: `line-${cell.id}-${otherCell.id}`,
        fromCellId: cell.id,
        toCellId: otherCell.id,
        player: cell.state,
      })
    })
  })

  return lines
}

export const calculateWinner = (
  cells: CollectorCell[],
): {
  winner: CollectorWinner
  player1LargestGroup: number
  player2LargestGroup: number
} => {
  const player1LargestGroup = getLargestGroupSize(
    cells,
    'player1',
  )

  const player2LargestGroup = getLargestGroupSize(
    cells,
    'player2',
  )

  if (player1LargestGroup > player2LargestGroup) {
    return {
      winner: 'player1',
      player1LargestGroup,
      player2LargestGroup,
    }
  }

  if (player2LargestGroup > player1LargestGroup) {
    return {
      winner: 'player2',
      player1LargestGroup,
      player2LargestGroup,
    }
  }

  return {
    winner: 'draw',
    player1LargestGroup,
    player2LargestGroup,
  }
}