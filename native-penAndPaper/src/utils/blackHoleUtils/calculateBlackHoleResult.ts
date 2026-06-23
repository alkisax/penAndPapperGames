import type { Cell } from '@/types/blackHole.types'
import { getNeighbors } from '@/utils/blackHoleUtils/createBoard'

export type BlackHoleScores = {
  player1: number
  player2: number
  player3: number
}

export type BlackHoleResult = {
  scores: BlackHoleScores
  winners: number[]
}

export const calculateBlackHoleResult = (
  updatedCells: Cell[],
  numberOfPlayers: number,
): BlackHoleResult | null => {
  const blackHole = updatedCells.find((cell) => cell.isBlackHole)

  if (!blackHole) return null

  const neighbors = getNeighbors(blackHole, updatedCells)

  let player1Score = 0
  let player2Score = 0
  let player3Score = 0

  neighbors.forEach((cell) => {
    if (cell.owner === 1) {
      player1Score += cell.value ?? 0
    }

    if (cell.owner === 2) {
      player2Score += cell.value ?? 0
    }

    if (cell.owner === 3) {
      player3Score += cell.value ?? 0
    }
  })

  const scores = {
    player1: player1Score,
    player2: player2Score,
    player3: player3Score,
  }

  const minScore =
    numberOfPlayers === 2
      ? Math.min(player1Score, player2Score)
      : Math.min(player1Score, player2Score, player3Score)

  const winners: number[] = []

  if (player1Score === minScore) winners.push(1)
  if (player2Score === minScore) winners.push(2)

  if (numberOfPlayers === 3 && player3Score === minScore) {
    winners.push(3)
  }

  return {
    scores,
    winners,
  }
}