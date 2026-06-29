// src/utils/dandelionsUtils/createDandelionBoard.ts

import type { DandelionCell } from '@/types/dandelion.types'

export const DANDELION_BOARD_SIZE = 6

export const createDandelionBoard = (): DandelionCell[] => {
  return Array.from(
    { length: DANDELION_BOARD_SIZE * DANDELION_BOARD_SIZE },
    (_, index) => {
      const row = Math.floor(index / DANDELION_BOARD_SIZE)
      const col = index % DANDELION_BOARD_SIZE

      return {
        id: index + 1,
        row,
        col,
        hasDandelion: false,
        hasSeed: false,
      }
    },
  )
}