import {
  areNabCellsAligned,
  getNabCellsInLine,
} from './nabSvgUtils'
import type {
  NabCell,
} from './nabSvgUtils'

export type NabPlayer = 'player1' | 'player2'

export const getNextNabPlayer = (
  player: NabPlayer,
): NabPlayer => {
  return player === 'player1'
    ? 'player2'
    : 'player1'
}

export const getNabPlayerLabel = (
  player: NabPlayer,
) => {
  return player === 'player1'
    ? 'Blue'
    : 'Red'
}

export const hasAvailableNabMove = (
  cells: NabCell[],
  usedCellIds: number[],
) => {
  const availableCells = cells.filter(
    (cell) => !usedCellIds.includes(cell.id),
  )

  // Αν υπάρχει έστω ένας ελεύθερος κύκλος,
  // υπάρχει πάντα κίνηση μήκους ενός κύκλου.
  if (availableCells.length > 0) {
    return true
  }

  return false
}

export const getAllAvailableNabMoves = (
  cells: NabCell[],
  usedCellIds: number[],
) => {
  const moves: {
    fromCellId: number
    toCellId: number
    usedCellIds: number[]
  }[] = []

  for (const startCell of cells) {
    if (usedCellIds.includes(startCell.id)) {
      continue
    }

    for (const endCell of cells) {
      if (usedCellIds.includes(endCell.id)) {
        continue
      }

      const isSingleCellMove =
        startCell.id === endCell.id

      const isAlignedMove =
        areNabCellsAligned(startCell, endCell)

      if (!isSingleCellMove && !isAlignedMove) {
        continue
      }

      const lineCells = getNabCellsInLine(
        startCell,
        endCell,
        cells,
      )

      const lineCellIds = lineCells.map(
        (cell) => cell.id,
      )

      const passesThroughUsedCell =
        lineCellIds.some((cellId) =>
          usedCellIds.includes(cellId),
        )

      if (passesThroughUsedCell) {
        continue
      }

      moves.push({
        fromCellId: startCell.id,
        toCellId: endCell.id,
        usedCellIds: lineCellIds,
      })
    }
  }

  return moves
}