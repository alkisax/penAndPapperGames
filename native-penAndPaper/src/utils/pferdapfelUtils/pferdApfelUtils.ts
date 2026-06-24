// native-penAndPaper\src\utils\pferdapfelUtils\pferdApfelUtils.ts
export type PlayerColor = 'blue' | 'red'

export type Position = {
  row: number
  col: number
}

export type BlockedCell = {
  id: string
  row: number
  col: number
  color: PlayerColor
}

export type Knight = {
  id: string
  row: number
  col: number
  color: PlayerColor
}

export const BOARD_SIZE = 8

export const KNIGHT_MOVES = [
  { row: -2, col: -1 },
  { row: -2, col: 1 },
  { row: -1, col: -2 },
  { row: -1, col: 2 },
  { row: 1, col: -2 },
  { row: 1, col: 2 },
  { row: 2, col: -1 },
  { row: 2, col: 1 },
]

export const getNextPlayer = (
  currentPlayer: PlayerColor,
): PlayerColor => {
  if (currentPlayer === 'blue') {
    return 'red'
  }

  return 'blue'
}

export const isLegalKnightMove = (
  from: Position,
  to: Position,
) => {
  const rowDiff = Math.abs(from.row - to.row)
  const colDiff = Math.abs(from.col - to.col)

  return (
    rowDiff === 2 &&
    colDiff === 1
  ) || (
    rowDiff === 1 &&
    colDiff === 2
  )
}

export const isBlockedCell = (
  blockedCells: BlockedCell[],
  position: Position,
) => {
  return blockedCells.some((cell) =>
    cell.row === position.row &&
    cell.col === position.col
  )
}

export const isInsideBoard = (
  position: Position,
) => {
  return (
    position.row >= 0 &&
    position.row < BOARD_SIZE &&
    position.col >= 0 &&
    position.col < BOARD_SIZE
  )
}

export const getRemainingMoves = (
  from: Position,
  blockedCells: BlockedCell[],
) => {
  return KNIGHT_MOVES
    .map((move) => ({
      row: from.row + move.row,
      col: from.col + move.col,
    }))
    .filter((targetPosition) => {
      if (!isInsideBoard(targetPosition)) return false

      return !isBlockedCell(
        blockedCells,
        targetPosition,
      )
    })
}

export const isSamePosition = (
  a: Position,
  b: Position,
) => {
  return (
    a.row === b.row &&
    a.col === b.col
  )
}