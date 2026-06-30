// native-penAndPaper/src/hooks/hedron/useHedron.tsx

import { useMemo, useState } from 'react'

import {
  calculateHedronRegionOwners,
  calculateHedronScoreResult,
} from '@/utils/hedronUtils/hedronRules'

import type {
  EdgeOwner,
  HedronPlayer,
} from '@/utils/hedronUtils/hedronRules'

export const useHedron = () => {
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

  const handleEdgePress = (edgeId: string) => {
    if (scoreResult.gameOver) return

    setOwnersByEdgeId((prev) => {
      if (prev[edgeId]) return prev

      return {
        ...prev,
        [edgeId]: currentPlayer,
      }
    })

    setCurrentPlayer((prev) =>
      prev === 'player1'
        ? 'player2'
        : 'player1',
    )
  }

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
    clearGame,
  }
}