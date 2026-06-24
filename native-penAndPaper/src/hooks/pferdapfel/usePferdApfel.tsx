// native-penAndPaper/src/hooks/pferdapfel/usePferdApfel.tsx

import { useState } from 'react'

import {
  getNextPlayer,
  getRemainingMoves,
  isBlockedCell,
  isLegalKnightMove,
  isSamePosition,
} from '@/utils/pferdapfelUtils/pferdApfelUtils'

import type {
  BlockedCell,
  Knight,
  PlayerColor,
  Position,
} from '@/utils/pferdapfelUtils/pferdApfelUtils'

export const usePferdApfel = () => {
  const [currentPlayer, setCurrentPlayer] =
    useState<PlayerColor>('blue')

  const [bluePosition, setBluePosition] =
    useState<Position>({
      row: 7,
      col: 0,
    })

  const [redPosition, setRedPosition] =
    useState<Position>({
      row: 0,
      col: 7,
    })

  const [blockedCells, setBlockedCells] =
    useState<BlockedCell[]>([])

  const [winner, setWinner] =
    useState<PlayerColor | null>(null)

  const [gameOver, setGameOver] =
    useState(false)

  const knights: Knight[] = [
    {
      id: 'player-1',
      row: bluePosition.row,
      col: bluePosition.col,
      color: 'blue',
    },
    {
      id: 'player-2',
      row: redPosition.row,
      col: redPosition.col,
      color: 'red',
    },
  ]

  const handleCellPress = (
    row: number,
    col: number,
    id: number,
  ) => {
    if (gameOver) return

    const currentPosition =
      currentPlayer === 'blue'
        ? bluePosition
        : redPosition

    const opponentPosition =
      currentPlayer === 'blue'
        ? redPosition
        : bluePosition

    const targetPosition = {
      row,
      col,
    }

    if (isBlockedCell(blockedCells, targetPosition)) {
      console.log('illegal move - blocked cell:', {
        id,
        currentPlayer,
        to: targetPosition,
      })

      return
    }

    const legalMove = isLegalKnightMove(
      currentPosition,
      targetPosition,
    )

    if (!legalMove) {
      console.log('illegal move:', {
        id,
        currentPlayer,
        from: currentPosition,
        to: targetPosition,
      })

      return
    }

    const isCapture = isSamePosition(
      targetPosition,
      opponentPosition,
    )

    console.log('legal move:', {
      id,
      currentPlayer,
      from: currentPosition,
      to: targetPosition,
    })

    const newBlockedCell: BlockedCell = {
      id: `blocked-${Date.now()}`,
      row: currentPosition.row,
      col: currentPosition.col,
      color: currentPlayer,
    }

    const nextBlockedCells = [
      ...blockedCells,
      newBlockedCell,
    ]

    setBlockedCells(nextBlockedCells)

    if (currentPlayer === 'blue') {
      setBluePosition(targetPosition)
    } else {
      setRedPosition(targetPosition)
    }

    if (isCapture) {
      console.log('capture:', {
        winner: currentPlayer,
        capturedAt: targetPosition,
      })

      setWinner(currentPlayer)
      setGameOver(true)
      return
    }

    const nextPlayer = getNextPlayer(currentPlayer)

    const nextPlayerPosition =
      nextPlayer === 'blue'
        ? bluePosition
        : redPosition

    const remainingMoves = getRemainingMoves(
      nextPlayerPosition,
      nextBlockedCells,
    )

    if (remainingMoves.length === 0) {
      setWinner(currentPlayer)
      setGameOver(true)
      return
    }

    setCurrentPlayer(nextPlayer)
  }

  const restartGame = () => {
    setCurrentPlayer('blue')

    setBluePosition({
      row: 7,
      col: 0,
    })

    setRedPosition({
      row: 0,
      col: 7,
    })

    setBlockedCells([])
    setWinner(null)
    setGameOver(false)
  }

  return {
    currentPlayer,
    knights,
    blockedCells,
    winner,
    gameOver,
    handleCellPress,
    restartGame,
  }
}