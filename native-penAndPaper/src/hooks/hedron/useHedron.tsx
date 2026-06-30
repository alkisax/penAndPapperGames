// native-penAndPaper/src/hooks/hedron/useHedron.tsx

import { useEffect, useMemo, useState } from 'react'

import {
  calculateHedronRegionOwners,
  calculateHedronScoreResult,
} from '@/utils/hedronUtils/hedronRules'

import type {
  EdgeOwner,
  HedronPlayer,
} from '@/utils/hedronUtils/hedronRules'

import {
  suggestHedronMove,
} from '@/utils/hedronUtils/suggestHedronMove'

type Props = {
  isPlayer2Ai?: boolean
}

export const useHedron = ({
  isPlayer2Ai = false,
}: Props = {}) => {
  const [currentPlayer, setCurrentPlayer] =
    useState<HedronPlayer>('player1')

  const [ownersByEdgeId, setOwnersByEdgeId] =
    useState<Record<string, EdgeOwner>>({})

  const ownersByRegionId = useMemo(() => {
    return calculateHedronRegionOwners(ownersByEdgeId)
  }, [ownersByEdgeId])

  const scoreResult = useMemo(() => {
    return calculateHedronScoreResult(ownersByRegionId)
  }, [ownersByRegionId])

  const applyEdgeMove = (edgeId: string) => {
    if (scoreResult.gameOver) return false

    if (ownersByEdgeId[edgeId]) return false

    setOwnersByEdgeId((prev) => ({
      ...prev,
      [edgeId]: currentPlayer,
    }))

    setCurrentPlayer((prev) =>
      prev === 'player1'
        ? 'player2'
        : 'player1',
    )

    return true
  }

  const handleEdgePress = (edgeId: string) => {
    return applyEdgeMove(edgeId)
  }

  const handleRemoteEdgePress = (edgeId: string) => {
    return applyEdgeMove(edgeId)
  }

  useEffect(() => {
    if (!isPlayer2Ai) return
    if (scoreResult.gameOver) return
    if (currentPlayer !== 'player2') return

    const timeoutId = setTimeout(() => {
      const suggestedMove = suggestHedronMove({
        ownersByEdgeId,
        currentPlayer: 'player2',
      })

      if (!suggestedMove) return

      console.log('Hedron AI move:', suggestedMove)

      handleEdgePress(suggestedMove.edgeId)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [
    isPlayer2Ai,
    scoreResult.gameOver,
    currentPlayer,
    ownersByEdgeId,
  ])

  const clearGame = () => {
    setOwnersByEdgeId({})
    setCurrentPlayer('player1')
  }

  return {
    currentPlayer,
    ownersByEdgeId,
    ownersByRegionId,
    scoreResult,
    handleEdgePress,
    handleRemoteEdgePress,
    clearGame,
  }
}