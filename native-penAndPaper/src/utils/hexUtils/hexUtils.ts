export type HexPlayer = 'player1' | 'player2'

export type HexCell = {
  id: number
  row: number
  col: number
  owner: HexPlayer | null
}

export const createHexCells = (
  boardSize: number,
): HexCell[] => {
  return Array.from(
    { length: boardSize * boardSize },
    (_, index) => {
      const row = Math.floor(index / boardSize)
      const col = index % boardSize

      return {
        id: index + 1,
        row,
        col,
        owner: null,
      }
    },
  )
}

export const getNextHexPlayer = (
  currentPlayer: HexPlayer,
): HexPlayer => {
  if (currentPlayer === 'player1') {
    return 'player2'
  }

  return 'player1'
}

export const getHexNeighbors = (
  cell: HexCell,
  cells: HexCell[],
) => {
  const neighborPositions = [
    { row: cell.row - 1, col: cell.col },
    { row: cell.row - 1, col: cell.col + 1 },
    { row: cell.row, col: cell.col - 1 },
    { row: cell.row, col: cell.col + 1 },
    { row: cell.row + 1, col: cell.col - 1 },
    { row: cell.row + 1, col: cell.col },
  ]

  return neighborPositions
    .map((position) =>
      cells.find((candidate) =>
        candidate.row === position.row &&
        candidate.col === position.col
      )
    )
    .filter((candidate): candidate is HexCell => candidate !== undefined)
}

export const checkHexWinner = ({
  cells,
  player,
  boardSize,
}: {
  cells: HexCell[]
  player: HexPlayer
  boardSize: number
}) => {
  const visited = new Set<number>()
  const queue: HexCell[] = []

  if (player === 'player1') {
    const startCells = cells.filter((cell) =>
      cell.owner === player &&
      cell.col === 0
    )

    queue.push(...startCells)
  }

  if (player === 'player2') {
    const startCells = cells.filter((cell) =>
      cell.owner === player &&
      cell.row === 0
    )

    queue.push(...startCells)
  }

  while (queue.length > 0) {
    const currentCell = queue.shift()

    if (!currentCell) continue
    if (visited.has(currentCell.id)) continue

    visited.add(currentCell.id)

    if (
      player === 'player1' &&
      currentCell.col === boardSize - 1
    ) {
      return true
    }

    if (
      player === 'player2' &&
      currentCell.row === boardSize - 1
    ) {
      return true
    }

    const neighbors = getHexNeighbors(
      currentCell,
      cells,
    ).filter((neighbor) =>
      neighbor.owner === player &&
      !visited.has(neighbor.id)
    )

    queue.push(...neighbors)
  }

  return false
}