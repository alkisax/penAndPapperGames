// src/utils/dandelionsUtils/dandelionDirections.ts

import type { Direction } from '@/types/dandelion.types'

export const DIRECTION_DELTAS: Record<Direction, { row: number, col: number }> = {
  N: { row: -1, col: 0 },
  NE: { row: -1, col: 1 },
  E: { row: 0, col: 1 },
  SE: { row: 1, col: 1 },
  S: { row: 1, col: 0 },
  SW: { row: 1, col: -1 },
  W: { row: 0, col: -1 },
  NW: { row: -1, col: -1 },
}