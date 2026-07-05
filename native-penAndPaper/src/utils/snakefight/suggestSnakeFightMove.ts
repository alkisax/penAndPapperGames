import type {
  SnakeFightDot,
  SnakeFightPlayer,
  SnakeFightSegment,
} from '@/components/svg/snakefight/SnakeFightBoardSvg'

import {
  countEnemyCrossings,
  getDotById,
  getLegalMovesForPlayer,
  isValidSnakeFightMove,
} from '@/utils/snakefight/snakeFightUtils'

export type SnakeFightSuggestedMove = {
  fromDotId: string
  toDotId: string
}

type SuggestSnakeFightMoveParams = {
  dots: SnakeFightDot[]
  segments: SnakeFightSegment[]
  player: SnakeFightPlayer
  player1HeadDotId: string
  player2HeadDotId: string
}

const getEnemyHeadDotId = ({
  player,
  player1HeadDotId,
  player2HeadDotId,
}: {
  player: SnakeFightPlayer
  player1HeadDotId: string
  player2HeadDotId: string
}) => {
  return player === 'player1'
    ? player2HeadDotId
    : player1HeadDotId
}

const getOpponent = (
  player: SnakeFightPlayer,
): SnakeFightPlayer => {
  return player === 'player1'
    ? 'player2'
    : 'player1'
}

const getMoveDistance = (
  fromDot: SnakeFightDot,
  toDot: SnakeFightDot,
) => {
  const rowDiff = Math.abs(fromDot.row - toDot.row)
  const colDiff = Math.abs(fromDot.col - toDot.col)

  return Math.max(rowDiff, colDiff)
}

export const suggestSnakeFightMove = ({
  dots,
  segments,
  player,
  player1HeadDotId,
  player2HeadDotId,
}: SuggestSnakeFightMoveParams): SnakeFightSuggestedMove | null => {
  const legalToDots = getLegalMovesForPlayer({
    dots,
    segments,
    player,
    player1HeadDotId,
    player2HeadDotId,
  })

  if (legalToDots.length === 0) {
    return null
  }

  const fromDotId =
    player === 'player1'
      ? player1HeadDotId
      : player2HeadDotId

  const fromDot = getDotById(dots, fromDotId)

  if (!fromDot) return null

  const enemyHeadDotId = getEnemyHeadDotId({
    player,
    player1HeadDotId,
    player2HeadDotId,
  })

  const opponent = getOpponent(player)

  const scoredMoves = legalToDots.map((toDot) => {
    const crossings = countEnemyCrossings({
      dots,
      fromDot,
      toDot,
      segments,
      player,
      enemyHeadDotId,
    })

    const nextSegments: SnakeFightSegment[] = [
      ...segments,
      {
        id: `simulated-${fromDot.id}-${toDot.id}`,
        fromDotId: fromDot.id,
        toDotId: toDot.id,
        player,
      },
    ]

    const nextPlayer1HeadDotId =
      player === 'player1'
        ? toDot.id
        : player1HeadDotId

    const nextPlayer2HeadDotId =
      player === 'player2'
        ? toDot.id
        : player2HeadDotId

    const opponentLegalMoves = getLegalMovesForPlayer({
      dots,
      segments: nextSegments,
      player: opponent,
      player1HeadDotId: nextPlayer1HeadDotId,
      player2HeadDotId: nextPlayer2HeadDotId,
    })

    const ownLegalMovesAfter = getLegalMovesForPlayer({
      dots,
      segments: nextSegments,
      player,
      player1HeadDotId: nextPlayer1HeadDotId,
      player2HeadDotId: nextPlayer2HeadDotId,
    })

    const distance = getMoveDistance(fromDot, toDot)

    let score = 0

    // Πρώτη προτεραιότητα: πέρνα πάνω από enemy snake.
    score += crossings * 120

    // Καλό να αφήνεις λιγότερες επιλογές στον αντίπαλο.
    score -= opponentLegalMoves.length * 4

    // Καλό να μη φυλακίζεσαι τελείως.
    score += ownLegalMovesAfter.length * 2

    // Λίγο bonus για μεγαλύτερες κινήσεις.
    score += distance * 3

    // Αν ο αντίπαλος δεν έχει κίνηση μετά, καλό.
    if (opponentLegalMoves.length === 0) {
      score += 40
    }

    // Αν και εσύ μετά δεν έχεις κίνηση, κακό.
    if (ownLegalMovesAfter.length === 0) {
      score -= 50
    }

    // Random για να μη φαίνεται ρομπότ.
    score += Math.random() * 12

    return {
      move: {
        fromDotId: fromDot.id,
        toDotId: toDot.id,
      },
      score,
    }
  })

  scoredMoves.sort((a, b) => b.score - a.score)

  const topMoves = scoredMoves.slice(0, 4)

  const randomIndex = Math.floor(
    Math.random() * topMoves.length,
  )

  return topMoves[randomIndex].move
}