import { useEffect, useState } from 'react'

import { createNabCells, createNabLineFromMove } from '@/utils/nab/nabSvgUtils'
import type { NabLine } from '@/utils/nab/nabSvgUtils'
import {
  getNabPlayerColor,
  getNabPlayerLabel,
  getNextNabPlayer,
  getValidNabMove,
  hasAvailableNabMove,
  mergeNabUsedCellIds,
} from '@/utils/nab/nabGameUtils'
import type { NabPlayer } from '@/utils/nab/nabGameUtils'
import { suggestNabMove } from '@/utils/nab/suggestNabMove'

type UseNabParams = {
  enableAi?: boolean
}

export const useNab = ({
  enableAi = true,
}: UseNabParams = {}) => {
  const [currentPlayer, setCurrentPlayer] = useState<NabPlayer>('player1')
  const [winner, setWinner] = useState<NabPlayer | null>(null)
  const [usedCellIds, setUsedCellIds] = useState<number[]>([])
  const [savedLines, setSavedLines] = useState<NabLine[]>([])
  const [resetVersion, setResetVersion] = useState(0)
  const [isPlayer2Ai, setIsPlayer2Ai] = useState(false)

  const cells = createNabCells()
  const gameOver = winner !== null

  const applyMove = (
    fromCellId: number,
    toCellId: number,
    player: NabPlayer,
  ) => {
    if (gameOver) return false

    const validMove = getValidNabMove({
      fromCellId,
      toCellId,
      cells,
      usedCellIds,
    })

    if (!validMove) {
      console.log('invalid nab move:', {
        fromCellId,
        toCellId,
      })

      return false
    }

    const newLine = createNabLineFromMove({
      fromCellId: validMove.fromCellId,
      toCellId: validMove.toCellId,
      cells,
      color: getNabPlayerColor(player),
    })

    if (!newLine) return false

    const nextUsedCellIds = mergeNabUsedCellIds(
      usedCellIds,
      validMove.usedCellIds,
    )

    setSavedLines((prev) => [
      ...prev,
      newLine,
    ])

    setUsedCellIds(nextUsedCellIds)

    const hasMoveAfterThis = hasAvailableNabMove(
      cells,
      nextUsedCellIds,
    )

    if (!hasMoveAfterThis) {
      setWinner(getNextNabPlayer(player))
      return true
    }

    setCurrentPlayer(getNextNabPlayer(player))
    return true
  }

  const handleMoveAttempt = (
    fromCellId: number,
    toCellId: number,
  ) => {
    return applyMove(
      fromCellId,
      toCellId,
      currentPlayer,
    )
  }

  useEffect(() => {
    if (!enableAi) return
    if (!isPlayer2Ai) return
    if (gameOver) return
    if (currentPlayer !== 'player2') return

    const timeoutId = setTimeout(() => {
      const suggestedMove = suggestNabMove({
        cells,
        usedCellIds,
      })

      if (!suggestedMove) return

      applyMove(
        suggestedMove.fromCellId,
        suggestedMove.toCellId,
        'player2',
      )
    }, 600)

    return () => clearTimeout(timeoutId)
  }, [
    enableAi,
    isPlayer2Ai,
    gameOver,
    currentPlayer,
    usedCellIds,
  ])

  const handleResetGame = () => {
    setCurrentPlayer('player1')
    setWinner(null)
    setUsedCellIds([])
    setSavedLines([])
    setResetVersion((prev) => prev + 1)
  }

  const turnText = winner
    ? `Winner: ${getNabPlayerLabel(winner)}`
    : enableAi && isPlayer2Ai && currentPlayer === 'player2'
      ? 'Red AI thinking...'
      : `Turn: ${getNabPlayerLabel(currentPlayer)}`

  return {
    cells,
    savedLines,
    usedCellIds,

    currentPlayer,
    winner,
    gameOver,
    resetVersion,
    turnText,

    isPlayer2Ai,
    setIsPlayer2Ai,

    applyMove,
    handleMoveAttempt,
    handleResetGame,
  }
}