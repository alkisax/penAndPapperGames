export type HedronPlayer = 'player1' | 'player2'

export type EdgeOwner = HedronPlayer | null

export type RegionOwner = HedronPlayer | 'mixed' | null

export const HEDRON_REGION_EDGES: Record<string, string[]> = {
  outer: [
    'edge-1',
    'edge-15',
    'edge-14',
    'edge-12',
    'edge-6',
  ],

  top: [
    'edge-1',
    'edge-2',
    'edge-3',
    'edge-4',
    'edge-5',
  ],

  left: [
    'edge-6',
    'edge-5',
    'edge-9',
    'edge-8',
    'edge-7',
  ],

  right: [
    'edge-2',
    'edge-20',
    'edge-19',
    'edge-16',
    'edge-15',
  ],

  'bottom-left': [
    'edge-7',
    'edge-10',
    'edge-11',
    'edge-13',
    'edge-12',
  ],

  'bottom-right': [
    'edge-16',
    'edge-18',
    'edge-17',
    'edge-13',
    'edge-14',
  ],

  'inner-left': [
    'edge-21',
    'edge-26',
    'edge-25',
    'edge-10',
    'edge-8',
  ],

  'inner-right': [
    'edge-23',
    'edge-29',
    'edge-24',
    'edge-18',
    'edge-19',
  ],

  'inner-top-left': [
    'edge-4',
    'edge-22',
    'edge-27',
    'edge-21',
    'edge-9',
  ],

  'inner-top-right': [
    'edge-3',
    'edge-20',
    'edge-23',
    'edge-28',
    'edge-22',
  ],

  center: [
    'edge-27',
    'edge-28',
    'edge-29',
    'edge-30',
    'edge-26',
  ],

  'inner-bottom': [
    'edge-30',
    'edge-24',
    'edge-17',
    'edge-11',
    'edge-25',
  ],
}

export const calculateHedronRegionOwners = (
  ownersByEdgeId: Record<string, EdgeOwner>,
): Record<string, RegionOwner> => {
  const ownersByRegionId: Record<string, RegionOwner> = {}

  Object.entries(HEDRON_REGION_EDGES).forEach(([
    regionId,
    edgeIds,
  ]) => {
    const player1Count = edgeIds.filter((edgeId) =>
      ownersByEdgeId[edgeId] === 'player1'
    ).length

    const player2Count = edgeIds.filter((edgeId) =>
      ownersByEdgeId[edgeId] === 'player2'
    ).length

    if (player1Count >= 3) {
      ownersByRegionId[regionId] = 'player1'
      return
    }

    if (player2Count >= 3) {
      ownersByRegionId[regionId] = 'player2'
      return
    }

    ownersByRegionId[regionId] = null
  })

  return ownersByRegionId
}

import { HEDRON_REGIONS } from '@/components/svg/hedron/HedronRegionsLayer'

export type HedronScoreResult = {
  gameOver: boolean
  winner: HedronPlayer | 'draw' | null
  player1Values: number[]
  player2Values: number[]
  player1Total: number
  player2Total: number
  player1Expression: string
  player2Expression: string
  unownedRegionIds: string[]
}

const createScoreExpression = (
  values: number[],
) => {
  if (values.length === 0) {
    return '0'
  }

  const total = values.reduce((sum, value) => {
    return sum + value
  }, 0)

  return `${values.join('+')}=${total}`
}

export const calculateHedronScoreResult = (
  ownersByRegionId: Record<string, RegionOwner>,
): HedronScoreResult => {
  const player1Values: number[] = []
  const player2Values: number[] = []
  const unownedRegionIds: string[] = []

  HEDRON_REGIONS.forEach((region) => {
    const owner = ownersByRegionId[region.id] ?? null

    if (owner === 'player1') {
      player1Values.push(region.value)
      return
    }

    if (owner === 'player2') {
      player2Values.push(region.value)
      return
    }

    unownedRegionIds.push(region.id)
  })

  const player1Total = player1Values.reduce((sum, value) => {
    return sum + value
  }, 0)

  const player2Total = player2Values.reduce((sum, value) => {
    return sum + value
  }, 0)

  const gameOver = unownedRegionIds.length === 0

  let winner: HedronPlayer | 'draw' | null = null

  if (gameOver) {
    if (player1Total > player2Total) {
      winner = 'player1'
    } else if (player2Total > player1Total) {
      winner = 'player2'
    } else {
      winner = 'draw'
    }
  }

  return {
    gameOver,
    winner,
    player1Values,
    player2Values,
    player1Total,
    player2Total,
    player1Expression: createScoreExpression(player1Values),
    player2Expression: createScoreExpression(player2Values),
    unownedRegionIds,
  }
}