// src/utils/dandelionsUtils/blowDandelionSeeds.ts


import { DandelionCell, Direction } from '@/types/dandelion.types'
import { DANDELION_BOARD_SIZE } from './createDandelionBoard'
import { DIRECTION_DELTAS } from './dandelionDirections'


export const blowDandelionSeeds = (
  cells: DandelionCell[],
  direction: Direction,
): DandelionCell[] => {
  const delta = DIRECTION_DELTAS[direction]

  const dandelions = cells.filter((cell) => cell.hasDandelion)

  const seedCellIds = new Set<number>()

  dandelions.forEach((dandelion) => {
    let nextRow = dandelion.row + delta.row
    let nextCol = dandelion.col + delta.col

    while (
      nextRow >= 0 &&
      nextRow < DANDELION_BOARD_SIZE &&
      nextCol >= 0 &&
      nextCol < DANDELION_BOARD_SIZE
    ) {
      const targetCell = cells.find((cell) =>
        cell.row === nextRow &&
        cell.col === nextCol
      )

      if (targetCell && !targetCell.hasDandelion) {
        seedCellIds.add(targetCell.id)
      }

      nextRow += delta.row
      nextCol += delta.col
    }
  })

  return cells.map((cell) => {
    if (!seedCellIds.has(cell.id)) {
      return cell
    }

    return {
      ...cell,
      hasSeed: true,
    }
  })
}