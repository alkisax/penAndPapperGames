// native-penAndPaper\src\utils\nab\nabGameUtils.ts
import { areNabCellsAligned, getNabCellsInLine } from './nabSvgUtils'
import type { NabCell } from './nabSvgUtils'

export type NabPlayer = 'player1' | 'player2'

export type NabMove = {
  fromCellId: number
  toCellId: number
  usedCellIds: number[]
}

type GetValidNabMoveParams = {
  fromCellId: number
  toCellId: number
  cells: NabCell[]
  usedCellIds: number[]
}

export const getNextNabPlayer = (player: NabPlayer): NabPlayer => {
  return player === 'player1'
    ? 'player2'
    : 'player1'
}

export const getNabPlayerLabel = (player: NabPlayer) => {
  return player === 'player1'
    ? 'Blue'
    : 'Red'
}

export const getNabPlayerColor = (player: NabPlayer) => {
  return player === 'player1'
    ? 'blue'
    : 'red'
}

export const mergeNabUsedCellIds = (
  currentUsedCellIds: number[],
  newUsedCellIds: number[],
) => {
  const nextUsedCellIds = [...currentUsedCellIds]

  newUsedCellIds.forEach((cellId) => {
    if (!nextUsedCellIds.includes(cellId)) {
      nextUsedCellIds.push(cellId)
    }
  })

  return nextUsedCellIds
}

export const hasAvailableNabMove = (
  cells: NabCell[],
  usedCellIds: number[],
) => {
  // Επειδή επιτρέπουμε και κίνηση μήκους ενός κύκλου,
  // υπάρχει διαθέσιμη κίνηση αν υπάρχει έστω ένας unused κύκλος.
  return cells.some((cell) => !usedCellIds.includes(cell.id))
}

export const getValidNabMove = ({
  fromCellId,
  toCellId,
  cells,
  usedCellIds,
}: GetValidNabMoveParams): NabMove | null => {
  const startCell = cells.find((cell) => cell.id === fromCellId)
  const endCell = cells.find((cell) => cell.id === toCellId)

  if (!startCell || !endCell) return null

  if (usedCellIds.includes(startCell.id)) return null
  if (usedCellIds.includes(endCell.id)) return null

  const isSingleCellMove = startCell.id === endCell.id
  const isAlignedMove = areNabCellsAligned(startCell, endCell)

  if (!isSingleCellMove && !isAlignedMove) return null

  const lineCells = getNabCellsInLine(
    startCell,
    endCell,
    cells,
  )

  const lineCellIds = lineCells.map((cell) => cell.id)

  const passesThroughUsedCell =
    lineCellIds.some((cellId) =>
      usedCellIds.includes(cellId),
    )

  if (passesThroughUsedCell) return null

  return {
    fromCellId: startCell.id,
    toCellId: endCell.id,
    usedCellIds: lineCellIds,
  }
}

export const getAllAvailableNabMoves = (
  cells: NabCell[],
  usedCellIds: number[],
) => {
  const moves: NabMove[] = []

  for (const startCell of cells) {
    for (const endCell of cells) {
      const move = getValidNabMove({
        fromCellId: startCell.id,
        toCellId: endCell.id,
        cells,
        usedCellIds,
      })

      if (move) {
        moves.push(move)
      }
    }
  }

  return moves
}