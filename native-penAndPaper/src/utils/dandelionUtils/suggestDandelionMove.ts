// src/utils/dandelionsUtils/suggestDandelionMove.ts

import type {
  DandelionCell,
  Direction,
} from '@/types/dandelion.types'

import { blowDandelionSeeds } from './blowDandelionSeeds'
import { checkDandelionsWinner } from './checkDandelionsWinner'

type SuggestedDandelionMove = {
  row: number
  col: number
  id: number
  score: number
}

const countFilledCells = (cells: DandelionCell[]) => {
  return cells.filter((cell) =>
    cell.hasDandelion || cell.hasSeed
  ).length
}

const getAvailableDirections = (
  usedDirections: Direction[],
): Direction[] => {
  const allDirections: Direction[] = [
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SW',
    'W',
    'NW',
  ]

  return allDirections.filter((direction) =>
    !usedDirections.includes(direction)
  )
}

export const suggestDandelionMove = (
  cells: DandelionCell[],
  usedDirections: Direction[],
): SuggestedDandelionMove | null => {
  const emptyCells = cells.filter((cell) =>
    !cell.hasDandelion && !cell.hasSeed
  )

  if (emptyCells.length === 0) {
    return null
  }

  const availableDirections =
    getAvailableDirections(usedDirections)

  const scoredMoves = emptyCells.map((cell) => {
    const cellsAfterMove = cells.map((currentCell) => {
      if (currentCell.id !== cell.id) {
        return currentCell
      }

      return {
        ...currentCell,
        hasDandelion: true,
      }
    })

    const winner = checkDandelionsWinner(
      cellsAfterMove,
      usedDirections,
    )

    if (winner === 'dandelion') {
      return {
        row: cell.row,
        col: cell.col,
        id: cell.id,
        score: 100000,
      }
    }

    const bestFutureFill = availableDirections.reduce(
      (bestScore, direction) => {
        const cellsAfterWind = blowDandelionSeeds(
          cellsAfterMove,
          direction,
        )

        const filledCells = countFilledCells(cellsAfterWind)

        return Math.max(
          bestScore,
          filledCells,
        )
      },
      countFilledCells(cellsAfterMove),
    )

    return {
      row: cell.row,
      col: cell.col,
      id: cell.id,
      score: bestFutureFill,
    }
  })

  scoredMoves.sort((a, b) => b.score - a.score)

  return scoredMoves[0]
}