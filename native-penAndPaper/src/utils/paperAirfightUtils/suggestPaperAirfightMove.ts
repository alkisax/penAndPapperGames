import {
  PaperAirfightPiece,
  ShotResult,
} from '@/hooks/paperAirfight/usePaperAirfight'
import { lineHitsCircle } from '@/utils/lineCircleCollision'

type Props = {
  aiPlayer: 'x' | 'o'
  pieces: PaperAirfightPiece[]
  boardWidth: number
  boardHeight: number
  maxMoveDistance: number
}

type CandidateMove = {
  pieceId: string
  shot: ShotResult
  score: number
}

const POWER_OPTIONS = [
  40,
  60,
  80,
  100,
]

const ANGLE_OPTIONS = [
  0,
  30,
  45,
  60,
  90,
  120,
  135,
  150,
  180,
  210,
  225,
  240,
  270,
  300,
  315,
  330,
]

const clamp = (
  value: number,
  min: number,
  max: number,
) => {
  return Math.max(min, Math.min(value, max))
}

const getGoalCenter = (
  player: 'x' | 'o',
  boardWidth: number,
  boardHeight: number,
) => {
  if (player === 'x') {
    return {
      x: boardWidth / 2,
      y: 0,
    }
  }

  return {
    x: boardWidth / 2,
    y: boardHeight,
  }
}

const getDistance = (
  a: { x: number; y: number },
  b: { x: number; y: number },
) => {
  const dx = a.x - b.x
  const dy = a.y - b.y

  return Math.sqrt(dx * dx + dy * dy)
}

const getShotEndPosition = (
  piece: PaperAirfightPiece,
  shot: ShotResult,
  boardWidth: number,
  boardHeight: number,
  maxMoveDistance: number,
) => {
  const distance =
    (shot.power / 100) * maxMoveDistance

  const radians =
    shot.angle * Math.PI / 180

  const nextX = piece.x + Math.cos(radians) * distance
  const nextY = piece.y + Math.sin(radians) * distance

  return {
    x: clamp(nextX, 18, boardWidth - 18),
    y: clamp(nextY, 18, boardHeight - 18),
  }
}

const checkGoalWin = (
  player: 'x' | 'o',
  position: { x: number; y: number },
  boardWidth: number,
  boardHeight: number,
) => {
  const goalWidth = boardWidth * 0.2
  const goalHeight = 42
  const goalLeft = boardWidth / 2 - goalWidth / 2
  const goalRight = boardWidth / 2 + goalWidth / 2

  const isInsideGoalX =
    position.x >= goalLeft &&
    position.x <= goalRight

  if (player === 'x') {
    return isInsideGoalX && position.y <= goalHeight
  }

  return isInsideGoalX && position.y >= boardHeight - goalHeight
}

export const suggestPaperAirfightMove = ({
  aiPlayer,
  pieces,
  boardWidth,
  boardHeight,
  maxMoveDistance,
}: Props): CandidateMove | null => {
  const aiPieces = pieces.filter((piece) =>
    piece.isAlive &&
    piece.type === aiPlayer
  )

  const enemyPieces = pieces.filter((piece) =>
    piece.isAlive &&
    piece.type !== aiPlayer
  )

  if (aiPieces.length === 0) return null

  const goalCenter = getGoalCenter(
    aiPlayer,
    boardWidth,
    boardHeight,
  )

  const candidates: CandidateMove[] = []

  aiPieces.forEach((piece) => {
    ANGLE_OPTIONS.forEach((angle) => {
      POWER_OPTIONS.forEach((power) => {
        const shot = {
          power,
          angle,
        }

        const endPosition = getShotEndPosition(
          piece,
          shot,
          boardWidth,
          boardHeight,
          maxMoveDistance,
        )

        let score = 0

        const scoredGoal = checkGoalWin(
          aiPlayer,
          endPosition,
          boardWidth,
          boardHeight,
        )

        if (scoredGoal) {
          score += 1000
        }

        const hitCount = enemyPieces.filter((enemyPiece) =>
          lineHitsCircle(
            { x: piece.x, y: piece.y },
            endPosition,
            { x: enemyPiece.x, y: enemyPiece.y },
            enemyPiece.size,
          ),
        ).length

        score += hitCount * 200

        const oldDistance = getDistance(
          piece,
          goalCenter,
        )

        const newDistance = getDistance(
          endPosition,
          goalCenter,
        )

        score += oldDistance - newDistance

        candidates.push({
          pieceId: piece.id,
          shot,
          score,
        })
      })
    })
  })

  if (candidates.length === 0) return null

  return candidates.reduce((best, current) => {
    if (current.score > best.score) {
      return current
    }

    return best
  })
}