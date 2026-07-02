import {
  useEffect,
  useState,
} from 'react'

import { createNabCells } from '@/utils/nab/nabSvgUtils'
import {
  getNabPlayerLabel,
  getNextNabPlayer,
  hasAvailableNabMove,
} from '@/utils/nab/nabGameUtils'
import type { NabPlayer } from '@/utils/nab/nabGameUtils'
import {
  suggestNabMove,
} from '@/utils/nab/suggestNabMove'

export type ExternalNabMove = {
  fromCellId: number
  toCellId: number
  usedCellIds: number[]
  player: NabPlayer
}

export const useNab = () => {
  const [currentPlayer, setCurrentPlayer] = useState<NabPlayer>('player1')
  const [winner, setWinner] = useState<NabPlayer | null>(null)
  const [usedCellIds, setUsedCellIds] = useState<number[]>([])
  const [resetVersion, setResetVersion] = useState(0)
  const [isPlayer2Ai, setIsPlayer2Ai] = useState(false)
  const [externalMove, setExternalMove] = useState<ExternalNabMove | null>(null)
  const [externalMoveVersion, setExternalMoveVersion] = useState(0)

  const cells = createNabCells()

  const gameOver = winner !== null

  const applyMove = (
    moveUsedCellIds: number[],
    player: NabPlayer,
  ) => {
    if (gameOver) return

    const nextUsedCellIds = [...usedCellIds]

    moveUsedCellIds.forEach((cellId) => {
      if (!nextUsedCellIds.includes(cellId)) {
        nextUsedCellIds.push(cellId)
      }
    })

    setUsedCellIds(nextUsedCellIds)

    const hasMoveAfterThis = hasAvailableNabMove(
      cells,
      nextUsedCellIds,
    )

    if (!hasMoveAfterThis) {
      setWinner(getNextNabPlayer(player))
      return
    }

    setCurrentPlayer(getNextNabPlayer(player))
  }

  const handleValidMove = (moveUsedCellIds: number[]) => {
    applyMove(moveUsedCellIds, currentPlayer)
  }

  useEffect(() => {
    if (!isPlayer2Ai) return
    if (gameOver) return
    if (currentPlayer !== 'player2') return

    const timeoutId = setTimeout(() => {
      const suggestedMove = suggestNabMove({
        cells,
        usedCellIds,
      })

      if (!suggestedMove) return

      setExternalMove({
        ...suggestedMove,
        player: 'player2',
      })

      setExternalMoveVersion((prev) => prev + 1)
      applyMove(suggestedMove.usedCellIds, 'player2')
    }, 600)

    return () => clearTimeout(timeoutId)
  }, [
    isPlayer2Ai,
    gameOver,
    currentPlayer,
    usedCellIds,
  ])

  const handleResetGame = () => {
    setCurrentPlayer('player1')
    setWinner(null)
    setUsedCellIds([])
    setExternalMove(null)
    setExternalMoveVersion(0)
    setResetVersion((prev) => prev + 1)
  }

  const turnText = winner
    ? `Winner: ${getNabPlayerLabel(winner)}`
    : isPlayer2Ai && currentPlayer === 'player2'
      ? 'Red AI thinking...'
      : `Turn: ${getNabPlayerLabel(currentPlayer)}`

  return {
    currentPlayer,
    winner,
    gameOver,
    usedCellIds,
    resetVersion,
    turnText,

    isPlayer2Ai,
    setIsPlayer2Ai,

    externalMove,
    externalMoveVersion,

    handleValidMove,
    handleResetGame,
  }
}