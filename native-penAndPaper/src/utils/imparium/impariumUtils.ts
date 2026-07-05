import type {
  ImpariumCell,
  ImpariumCellState,
} from '@/components/svg/imparium/ImpariumBoardSvg'

export type ImpariumPlayer = 'player1' | 'player2'

export type ImpariumWinner =
  | ImpariumPlayer
  | 'draw'
  | null

export type ImpariumScore = {
  player1Score: number
  player2Score: number
}

export const IMPARIUM_BOARD_SIZE = 6

export const createImpariumCells = (): ImpariumCell[] => {
  const cells: ImpariumCell[] = []

  for (let row = 0; row < IMPARIUM_BOARD_SIZE; row++) {
    for (let col = 0; col < IMPARIUM_BOARD_SIZE; col++) {
      cells.push({
        id: `${row}-${col}`,
        row,
        col,
        state: 'empty',
      })
    }
  }

  return cells
}

export const getNextImpariumPlayer = (
  player: ImpariumPlayer,
): ImpariumPlayer => {
  return player === 'player1'
    ? 'player2'
    : 'player1'
}

export const getImpariumPlayerLabel = (
  player: ImpariumPlayer,
) => {
  return player === 'player1'
    ? 'Blue'
    : 'Red'
}

export const getCoveredState = (
  player: ImpariumPlayer,
): ImpariumCellState => {
  return player === 'player1'
    ? 'covered-player1'
    : 'covered-player2'
}

export const areOrthogonallyAdjacent = (
  a: ImpariumCell,
  b: ImpariumCell,
) => {
  const rowDiff = Math.abs(a.row - b.row)
  const colDiff = Math.abs(a.col - b.col)

  return rowDiff + colDiff === 1
}

export const getOrthogonalNeighbors = (
  cell: ImpariumCell,
  cells: ImpariumCell[],
) => {
  return cells.filter((otherCell) =>
    areOrthogonallyAdjacent(cell, otherCell)
  )
}

export const isClaimableRegionSize = (
  size: number,
) => {
  return (
    size % 2 === 1 &&
    size <= 9
  )
}

export const findEmptyRegions = (
  cells: ImpariumCell[],
) => {
  const visitedCellIds = new Set<string>()
  const regions: ImpariumCell[][] = []

  for (const cell of cells) {
    if (cell.state !== 'empty') continue
    if (visitedCellIds.has(cell.id)) continue

    const region: ImpariumCell[] = []
    const stack: ImpariumCell[] = [cell]

    visitedCellIds.add(cell.id)

    while (stack.length > 0) {
      const currentCell = stack.pop()

      if (!currentCell) continue

      region.push(currentCell)

      const neighbors = getOrthogonalNeighbors(
        currentCell,
        cells,
      )

      neighbors.forEach((neighbor) => {
        if (neighbor.state !== 'empty') return
        if (visitedCellIds.has(neighbor.id)) return

        visitedCellIds.add(neighbor.id)
        stack.push(neighbor)
      })
    }

    regions.push(region)
  }

  return regions
}

export const claimNewClosedRegions = (
  cells: ImpariumCell[],
  player: ImpariumPlayer,
) => {
  const emptyRegions = findEmptyRegions(cells)

  const claimableRegions = emptyRegions.filter((region) =>
    isClaimableRegionSize(region.length)
  )

  if (claimableRegions.length === 0) {
    return cells
  }

  const claimableCellIds = new Set(
    claimableRegions.flatMap((region) =>
      region.map((cell) => cell.id)
    ),
  )

  return cells.map((cell) => {
    if (!claimableCellIds.has(cell.id)) {
      return cell
    }

    return {
      ...cell,
      state: player,
    }
  })
}

export const hasAvailableDominoMove = (
  cells: ImpariumCell[],
) => {
  return cells.some((cell) => {
    if (cell.state !== 'empty') return false

    const hasEmptyNeighbor = getOrthogonalNeighbors(
      cell,
      cells,
    ).some((neighbor) =>
      neighbor.state === 'empty'
    )

    return hasEmptyNeighbor
  })
}

export const countImpariumClaimedCells = (
  cells: ImpariumCell[],
): ImpariumScore => {
  const player1Score = cells.filter((cell) =>
    cell.state === 'player1'
  ).length

  const player2Score = cells.filter((cell) =>
    cell.state === 'player2'
  ).length

  return {
    player1Score,
    player2Score,
  }
}

export const calculateImpariumWinner = (
  cells: ImpariumCell[],
): ImpariumWinner => {
  const {
    player1Score,
    player2Score,
  } = countImpariumClaimedCells(cells)

  if (player1Score > player2Score) return 'player1'
  if (player2Score > player1Score) return 'player2'

  return 'draw'
}