// native-penAndPaper\src\utils\blackHoleUtils\suggestMove.ts

import type { Cell } from '@/types/blackHole.types'
import { getNeighbors } from './createBoard'

/*
  Greedy idea για τον Player 2:

  Δεν ψάχνουμε απλώς "ποιο κελί να παίξει".
  Πρώτα υποθέτουμε ότι κάθε empty cell μπορεί να γίνει το τελικό black hole.

  Για κάθε πιθανό black hole υπολογίζουμε:
  - πόσο score θα πάρει ο Player 1
  - πόσο score θα πάρει ο Player 2
  - πόσο score θα πάρει ο Player 3

  Επειδή στο Black Hole κερδίζει το μικρότερο score:
  - βρίσκουμε ποιο empty cell θα ήταν ΚΑΛΟ να μείνει black hole για τον Player 2
  - ΔΕΝ παίζουμε εκεί
  - μετά παίζουμε το πιο επικίνδυνο empty cell για τον Player 2,
    ώστε να το αφαιρέσουμε από τα πιθανά black holes
*/

type Props = {
  cells: Cell[]
}

type BlackHoleEvaluation = {
  blackHoleId: number
  player1Score: number
  player2Score: number
  player3Score: number
  neighborCount: number
}

export const evaluateBlackHoleCandidate = (
  candidate: Cell,
  cells: Cell[],
): BlackHoleEvaluation => {
  // Βρίσκουμε τους γείτονες του κελιού,
  // σαν να ήταν αυτό το τελικό black hole.
  const neighbors = getNeighbors(candidate, cells)

  let player1Score = 0
  let player2Score = 0
  let player3Score = 0

  // Το score κάθε παίκτη είναι το άθροισμα των δικών του γειτονικών αριθμών.
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

  return {
    blackHoleId: candidate.id,
    player1Score,
    player2Score,
    player3Score,
    neighborCount: neighbors.length,
  }
}

export const suggestMove = ({
  cells,
}: Props): number | null => {
  console.log('Next move for Player 2')

  // Παίρνουμε μόνο τα κελιά που δεν έχουν παιχτεί ακόμα.
  const emptyCells = cells.filter(
    (cell) => cell.owner === null,
  )

  // Αν έχει μείνει 0 ή 1 empty cell, δεν έχει νόημα suggestion.
  if (emptyCells.length <= 1) {
    console.log('suggested move👉👉 none')
    return null
  }

  // Κάνουμε simulation:
  // "Αν αυτό το empty cell ήταν το black hole, τι score θα έπαιρνε κάθε παίκτης;"
  const evaluations = emptyCells.map((cell) => {
    return evaluateBlackHoleCandidate(
      cell,
      cells,
    )
  })

  console.log('Evaluations:', evaluations)

  // Βρίσκουμε ποιο πιθανό black hole είναι καλύτερο για τον Player 2.
  // Καλύτερο = μικρότερο Player 2 score.
  const bestBlackHoleForPlayer2 =
    evaluations.reduce((best, current) => {
      if (current.player2Score < best.player2Score) {
        return current
      }

      return best
    })

  console.log(
    'Best black hole for Player 2:',
    bestBlackHoleForPlayer2.blackHoleId,
  )

  // Δεν παίζουμε το κελί που θέλουμε να μείνει black hole.
  // Το αφαιρούμε από τις πιθανές κινήσεις.
  const possibleMoves = evaluations.filter(
    (evaluation) =>
      evaluation.blackHoleId !==
      bestBlackHoleForPlayer2.blackHoleId,
  )

  if (possibleMoves.length === 0) {
    console.log('suggested move👉👉 none')
    return null
  }

  // Από τα υπόλοιπα empty cells, παίζουμε αυτό που θα ήταν πιο κακό
  // αν έμενε black hole για τον Player 2.
  // Δηλαδή αφαιρούμε το μεγαλύτερο Player 2 risk.
  const mostDangerousBlackHoleForPlayer2 =
    possibleMoves.reduce((worst, current) => {
      if (current.player2Score > worst.player2Score) {
        return current
      }

      return worst
    })

  console.log(
    `suggested move👉👉 ${mostDangerousBlackHoleForPlayer2.blackHoleId}`,
  )

  return mostDangerousBlackHoleForPlayer2.blackHoleId
}