// src/utils/dandelionsUtils/checkDandelionsWinner.ts

import type {
  DandelionCell,
  Direction,
} from '@/types/dandelion.types'

export type DandelionsWinner =
  | 'dandelion'
  | 'wind'
  | null

const MAX_WIND_MOVES = 7

export const checkDandelionsWinner = (
  cells: DandelionCell[],
  usedDirections: Direction[],
): DandelionsWinner => {
  const isBoardFull = cells.every((cell) =>
    cell.hasDandelion || cell.hasSeed
  )

  if (isBoardFull) {
    return 'dandelion'
  }

  if (usedDirections.length >= MAX_WIND_MOVES) {
    return 'wind'
  }

  return null
}