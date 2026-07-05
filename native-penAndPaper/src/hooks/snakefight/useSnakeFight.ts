import {
  useEffect,
  useState,
} from 'react'

import type {
  SnakeFightPlayer,
  SnakeFightSegment,
} from '@/components/svg/snakefight/SnakeFightBoardSvg'

import {
  calculateSnakeFightWinner,
  countEnemyCrossings,
  createSnakeFightDots,
  createSnakeFightSegmentId,
  getDotById,
  getLegalMovesForPlayer,
  getNextSnakeFightPlayer,
  getSnakeFightPlayerLabel,
  getSnakeFightWinnerText,
  isValidSnakeFightMove,
} from '@/utils/snakefight/snakeFightUtils'

import type {
  SnakeFightScore,
  SnakeFightWinner,
} from '@/utils/snakefight/snakeFightUtils'

import {
  suggestSnakeFightMove,
} from '@/utils/snakefight/suggestSnakeFightMove'

export type SnakeFightMove = {
  fromDotId: string
  toDotId: string
}

type UseSnakeFightParams = {
  enableAi?: boolean
}

export const useSnakeFight = ({
  enableAi = true,
}: UseSnakeFightParams = {}) => {
  const [dots] = useState(createSnakeFightDots)

  const [segments, setSegments] =
    useState<SnakeFightSegment[]>([])

  const [currentPlayer, setCurrentPlayer] =
    useState<SnakeFightPlayer>('player1')

  const [player1HeadDotId, setPlayer1HeadDotId] =
    useState('0-0')

  const [player2HeadDotId, setPlayer2HeadDotId] =
    useState('4-4')

  const [score, setScore] =
    useState<SnakeFightScore>({
      player1: 0,
      player2: 0,
    })

  const [gameOver, setGameOver] =
    useState(false)

  const [winner, setWinner] =
    useState<SnakeFightWinner>(null)

  const [isPlayer2Ai, setIsPlayer2Ai] =
    useState(false)

  const resetGame = () => {
    setSegments([])
    setCurrentPlayer('player1')
    setPlayer1HeadDotId('0-0')
    setPlayer2HeadDotId('4-4')
    setScore({
      player1: 0,
      player2: 0,
    })
    setGameOver(false)
    setWinner(null)
  }

  const finishGame = (
    finalScore: SnakeFightScore,
  ) => {
    setGameOver(true)
    setWinner(
      calculateSnakeFightWinner(finalScore),
    )
  }

  const applyMove = (
    move: SnakeFightMove,
    player: SnakeFightPlayer,
  ) => {
    if (gameOver) return false

    const fromDot = getDotById(
      dots,
      move.fromDotId,
    )

    const toDot = getDotById(
      dots,
      move.toDotId,
    )

    if (!fromDot || !toDot) return false

    const currentHeadDotId =
      player === 'player1'
        ? player1HeadDotId
        : player2HeadDotId

    const enemyHeadDotId =
      player === 'player1'
        ? player2HeadDotId
        : player1HeadDotId

    if (move.fromDotId !== currentHeadDotId) {
      console.log('not current head')
      return false
    }

    const isValidMove =
      isValidSnakeFightMove({
        dots,
        segments,
        fromDot,
        toDot,
        player,
      })

    if (!isValidMove) {
      console.log('invalid snake fight move')
      return false
    }

    const crossings = countEnemyCrossings({
      dots,
      fromDot,
      toDot,
      segments,
      player,
      enemyHeadDotId,
    })

    const nextScore: SnakeFightScore = {
      ...score,
      [player]: score[player] + crossings,
    }

    const newSegment: SnakeFightSegment = {
      id: createSnakeFightSegmentId(),
      fromDotId: move.fromDotId,
      toDotId: move.toDotId,
      player,
    }

    const nextSegments = [
      ...segments,
      newSegment,
    ]

    const nextPlayer =
      getNextSnakeFightPlayer(player)

    const nextPlayer1HeadDotId =
      player === 'player1'
        ? move.toDotId
        : player1HeadDotId

    const nextPlayer2HeadDotId =
      player === 'player2'
        ? move.toDotId
        : player2HeadDotId

    setSegments(nextSegments)
    setScore(nextScore)

    if (player === 'player1') {
      setPlayer1HeadDotId(move.toDotId)
    } else {
      setPlayer2HeadDotId(move.toDotId)
    }

    const nextPlayerLegalMoves =
      getLegalMovesForPlayer({
        dots,
        segments: nextSegments,
        player: nextPlayer,
        player1HeadDotId: nextPlayer1HeadDotId,
        player2HeadDotId: nextPlayer2HeadDotId,
      })

    if (nextPlayerLegalMoves.length > 0) {
      setCurrentPlayer(nextPlayer)
      return true
    }

    const currentPlayerLegalMoves =
      getLegalMovesForPlayer({
        dots,
        segments: nextSegments,
        player,
        player1HeadDotId: nextPlayer1HeadDotId,
        player2HeadDotId: nextPlayer2HeadDotId,
      })

    if (currentPlayerLegalMoves.length > 0) {
      setCurrentPlayer(player)
      return true
    }

    finishGame(nextScore)
    return true
  }

  const handleMoveAttempt = (
    fromDotId: string,
    toDotId: string,
  ) => {
    return applyMove(
      {
        fromDotId,
        toDotId,
      },
      currentPlayer,
    )
  }

  useEffect(() => {
    if (!enableAi) return
    if (!isPlayer2Ai) return
    if (gameOver) return
    if (currentPlayer !== 'player2') return

    const timeoutId = setTimeout(() => {
      const suggestedMove = suggestSnakeFightMove({
        dots,
        segments,
        player: 'player2',
        player1HeadDotId,
        player2HeadDotId,
      })

      if (!suggestedMove) return

      applyMove(
        {
          fromDotId: suggestedMove.fromDotId,
          toDotId: suggestedMove.toDotId,
        },
        'player2',
      )
    }, 650)

    return () => clearTimeout(timeoutId)
  }, [
    enableAi,
    isPlayer2Ai,
    gameOver,
    currentPlayer,
    segments,
    player1HeadDotId,
    player2HeadDotId,
  ])

  const turnText = gameOver
    ? getSnakeFightWinnerText(winner)
    : enableAi &&
        isPlayer2Ai &&
        currentPlayer === 'player2'
      ? 'Red AI thinking...'
      : `${getSnakeFightPlayerLabel(currentPlayer)}: extend your snake`

  return {
    dots,
    segments,

    currentPlayer,
    player1HeadDotId,
    player2HeadDotId,

    score,
    gameOver,
    winner,
    turnText,

    isPlayer2Ai,
    setIsPlayer2Ai,

    applyMove,
    handleMoveAttempt,
    resetGame,
  }
}