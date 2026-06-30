import {
  calculateHedronRegionOwners,
} from '@/utils/hedronUtils/hedronRules'

import type {
  EdgeOwner,
  HedronPlayer,
  RegionOwner,
} from '@/utils/hedronUtils/hedronRules'

import {
  HEDRON_REGIONS,
} from '@/components/svg/hedron/HedronRegionsLayer'

type Props = {
  ownersByEdgeId: Record<string, EdgeOwner>
  currentPlayer: HedronPlayer
}

type CandidateMove = {
  edgeId: string
  score: number
  ownGain: number
  opponentGainBlocked: number
  reason: string
}

const ALL_EDGE_IDS = Array.from(
  { length: 30 },
  (_, index) => `edge-${index + 1}`,
)

const getOpponent = (
  player: HedronPlayer,
): HedronPlayer => {
  if (player === 'player1') {
    return 'player2'
  }

  return 'player1'
}

const getPlayerScore = (
  ownersByRegionId: Record<string, RegionOwner>,
  player: HedronPlayer,
) => {
  return HEDRON_REGIONS
    .filter((region) =>
      ownersByRegionId[region.id] === player
    )
    .reduce((sum, region) => {
      return sum + region.value
    }, 0)
}

const applyEdgeMove = ({
  ownersByEdgeId,
  edgeId,
  player,
}: {
  ownersByEdgeId: Record<string, EdgeOwner>
  edgeId: string
  player: HedronPlayer
}) => {
  return {
    ...ownersByEdgeId,
    [edgeId]: player,
  }
}

const getBestImmediateGain = ({
  ownersByEdgeId,
  player,
}: {
  ownersByEdgeId: Record<string, EdgeOwner>
  player: HedronPlayer
}) => {
  const currentRegionOwners =
    calculateHedronRegionOwners(ownersByEdgeId)

  const currentScore = getPlayerScore(
    currentRegionOwners,
    player,
  )

  const emptyEdgeIds = ALL_EDGE_IDS.filter((edgeId) =>
    !ownersByEdgeId[edgeId]
  )

  if (emptyEdgeIds.length === 0) {
    return 0
  }

  return emptyEdgeIds.reduce((bestGain, edgeId) => {
    const nextEdgeOwners = applyEdgeMove({
      ownersByEdgeId,
      edgeId,
      player,
    })

    const nextRegionOwners =
      calculateHedronRegionOwners(nextEdgeOwners)

    const nextScore = getPlayerScore(
      nextRegionOwners,
      player,
    )

    const gain = nextScore - currentScore

    if (gain > bestGain) {
      return gain
    }

    return bestGain
  }, 0)
}

export const suggestHedronMove = ({
  ownersByEdgeId,
  currentPlayer,
}: Props): CandidateMove | null => {
  const opponent = getOpponent(currentPlayer)

  const emptyEdgeIds = ALL_EDGE_IDS.filter((edgeId) =>
    !ownersByEdgeId[edgeId]
  )

  if (emptyEdgeIds.length === 0) {
    return null
  }

  const currentRegionOwners =
    calculateHedronRegionOwners(ownersByEdgeId)

  const currentPlayerScore = getPlayerScore(
    currentRegionOwners,
    currentPlayer,
  )

  const currentOpponentBestGain =
    getBestImmediateGain({
      ownersByEdgeId,
      player: opponent,
    })

  const candidates = emptyEdgeIds.map((edgeId) => {
    const nextEdgeOwners = applyEdgeMove({
      ownersByEdgeId,
      edgeId,
      player: currentPlayer,
    })

    const nextRegionOwners =
      calculateHedronRegionOwners(nextEdgeOwners)

    const nextPlayerScore = getPlayerScore(
      nextRegionOwners,
      currentPlayer,
    )

    const ownGain =
      nextPlayerScore - currentPlayerScore

    const opponentBestGainAfterMove =
      getBestImmediateGain({
        ownersByEdgeId: nextEdgeOwners,
        player: opponent,
      })

    const opponentGainBlocked =
      currentOpponentBestGain - opponentBestGainAfterMove

    let score = 0

    score += ownGain * 120
    score += opponentGainBlocked * 100

    // Μικρό bonus για να μη διαλέγει τελείως random όταν όλα είναι 0.
    score += Math.random() * 0.01

    let reason = 'neutral move'

    if (ownGain > 0 && opponentGainBlocked > 0) {
      reason = 'scores and blocks'
    } else if (ownGain > 0) {
      reason = 'scores points'
    } else if (opponentGainBlocked > 0) {
      reason = 'blocks opponent points'
    }

    return {
      edgeId,
      score,
      ownGain,
      opponentGainBlocked,
      reason,
    }
  })

  return candidates.reduce((best, current) => {
    if (current.score > best.score) {
      return current
    }

    return best
  })
}