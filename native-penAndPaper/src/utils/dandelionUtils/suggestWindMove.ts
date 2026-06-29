// src/utils/dandelionsUtils/suggestWindMove.ts

import type {
  DandelionCell,
  Direction,
} from '@/types/dandelion.types'

import { blowDandelionSeeds } from './blowDandelionSeeds'
import { checkDandelionsWinner } from './checkDandelionsWinner'

type SuggestedWindMove = {
  direction: Direction
  score: number
}

const ALL_DIRECTIONS: Direction[] = [
  'N',
  'NE',
  'E',
  'SE',
  'S',
  'SW',
  'W',
  'NW',
]

const countEmptyCells = (cells: DandelionCell[]) => {
  return cells.filter((cell) =>
    !cell.hasDandelion && !cell.hasSeed
  ).length
}

const countNewSeeds = (
  beforeCells: DandelionCell[],
  afterCells: DandelionCell[],
) => {
  return afterCells.filter((afterCell) => {
    const beforeCell = beforeCells.find((cell) =>
      cell.id === afterCell.id
    )

    if (!beforeCell) {
      return false
    }

    return !beforeCell.hasSeed && afterCell.hasSeed
  }).length
}

export const suggestWindMove = (
  cells: DandelionCell[],
  usedDirections: Direction[],
): SuggestedWindMove | null => {
  const availableDirections = ALL_DIRECTIONS.filter((direction) =>
    !usedDirections.includes(direction)
  )

  if (availableDirections.length === 0) {
    return null
  }

  const scoredMoves = availableDirections.map((direction) => {
    const cellsAfterWind = blowDandelionSeeds(
      cells,
      direction,
    )

    const newUsedDirections = [
      ...usedDirections,
      direction,
    ]

    const winner = checkDandelionsWinner(
      cellsAfterWind,
      newUsedDirections,
    )

    if (winner === 'wind') {
      return {
        direction,
        score: 100000,
      }
    }

    if (winner === 'dandelion') {
      return {
        direction,
        score: -100000,
      }
    }

    const emptyCells = countEmptyCells(cellsAfterWind)
    const newSeeds = countNewSeeds(
      cells,
      cellsAfterWind,
    )

    // Wind θέλει να μείνουν κενά κελιά.
    // Άρα όσο περισσότερα empty μένουν, τόσο καλύτερα.
    // Και όσο λιγότερα νέα seeds βάζει, τόσο καλύτερα.
    const score =
      emptyCells * 100 -
      newSeeds * 10

    return {
      direction,
      score,
    }
  })

  scoredMoves.sort((a, b) => b.score - a.score)

  return scoredMoves[0]
}