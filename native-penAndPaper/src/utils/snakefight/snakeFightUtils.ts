import type {
  SnakeFightDot,
  SnakeFightPlayer,
  SnakeFightSegment,
} from '@/components/svg/snakefight/SnakeFightBoardSvg'

export type SnakeFightScore = {
  player1: number
  player2: number
}

export type SnakeFightWinner =
  | SnakeFightPlayer
  | 'draw'
  | null

export const SNAKE_FIGHT_BOARD_SIZE = 5

export const createSnakeFightDots = (): SnakeFightDot[] => {
  const dots: SnakeFightDot[] = []

  for (let row = 0; row < SNAKE_FIGHT_BOARD_SIZE; row++) {
    for (let col = 0; col < SNAKE_FIGHT_BOARD_SIZE; col++) {
      dots.push({
        id: `${row}-${col}`,
        row,
        col,
      })
    }
  }

  return dots
}

export const getNextSnakeFightPlayer = (
  player: SnakeFightPlayer,
): SnakeFightPlayer => {
  return player === 'player1'
    ? 'player2'
    : 'player1'
}

export const getSnakeFightPlayerLabel = (
  player: SnakeFightPlayer,
) => {
  return player === 'player1'
    ? 'Blue'
    : 'Red'
}

export const createSnakeFightSegmentId = () => {
  return `snake-segment-${Date.now()}-${Math.random()}`
}

export const getDotById = (
  dots: SnakeFightDot[],
  dotId: string,
) => {
  return dots.find((dot) => dot.id === dotId)
}

export const areSnakeFightDotsAligned = (
  a: SnakeFightDot,
  b: SnakeFightDot,
) => {
  const rowDiff = Math.abs(a.row - b.row)
  const colDiff = Math.abs(a.col - b.col)

  if (rowDiff === 0 && colDiff === 0) {
    return false
  }

  const sameRow = a.row === b.row
  const sameCol = a.col === b.col
  const diagonal = rowDiff === colDiff

  return sameRow || sameCol || diagonal
}

export const getSegmentDots = (
  dots: SnakeFightDot[],
  segment: Pick<SnakeFightSegment, 'fromDotId' | 'toDotId'>,
) => {
  const fromDot = getDotById(dots, segment.fromDotId)
  const toDot = getDotById(dots, segment.toDotId)

  if (!fromDot || !toDot) return null

  return {
    fromDot,
    toDot,
  }
}

export const orientation = (
  a: SnakeFightDot,
  b: SnakeFightDot,
  c: SnakeFightDot,
) => {
  const value =
    (b.col - a.col) * (c.row - a.row) -
    (b.row - a.row) * (c.col - a.col)

  if (value === 0) return 0

  return value > 0 ? 1 : -1
}

export const isPointOnSegment = (
  point: SnakeFightDot,
  a: SnakeFightDot,
  b: SnakeFightDot,
) => {
  const isCollinear =
    orientation(a, b, point) === 0

  if (!isCollinear) return false

  return (
    point.row >= Math.min(a.row, b.row) &&
    point.row <= Math.max(a.row, b.row) &&
    point.col >= Math.min(a.col, b.col) &&
    point.col <= Math.max(a.col, b.col)
  )
}

export const doSegmentsIntersect = (
  a1: SnakeFightDot,
  a2: SnakeFightDot,
  b1: SnakeFightDot,
  b2: SnakeFightDot,
) => {
  const o1 = orientation(a1, a2, b1)
  const o2 = orientation(a1, a2, b2)
  const o3 = orientation(b1, b2, a1)
  const o4 = orientation(b1, b2, a2)

  if (o1 !== o2 && o3 !== o4) {
    return true
  }

  if (o1 === 0 && isPointOnSegment(b1, a1, a2)) {
    return true
  }

  if (o2 === 0 && isPointOnSegment(b2, a1, a2)) {
    return true
  }

  if (o3 === 0 && isPointOnSegment(a1, b1, b2)) {
    return true
  }

  if (o4 === 0 && isPointOnSegment(a2, b1, b2)) {
    return true
  }

  return false
}

export const doSegmentsOverlapOnSameLine = (
  a1: SnakeFightDot,
  a2: SnakeFightDot,
  b1: SnakeFightDot,
  b2: SnakeFightDot,
) => {
  const sameLine =
    orientation(a1, a2, b1) === 0 &&
    orientation(a1, a2, b2) === 0

  if (!sameLine) return false

  const useRowProjection =
    a1.row !== a2.row ||
    b1.row !== b2.row

  const aStart = useRowProjection
    ? Math.min(a1.row, a2.row)
    : Math.min(a1.col, a2.col)

  const aEnd = useRowProjection
    ? Math.max(a1.row, a2.row)
    : Math.max(a1.col, a2.col)

  const bStart = useRowProjection
    ? Math.min(b1.row, b2.row)
    : Math.min(b1.col, b2.col)

  const bEnd = useRowProjection
    ? Math.max(b1.row, b2.row)
    : Math.max(b1.col, b2.col)

  const overlapStart = Math.max(aStart, bStart)
  const overlapEnd = Math.min(aEnd, bEnd)

  // Αν overlapStart === overlapEnd,
  // ακουμπάνε μόνο σε endpoint.
  // Αυτό επιτρέπεται.
  return overlapStart < overlapEnd
}

export const shareOnlyAllowedStartPoint = ({
  newFrom,
  newTo,
  oldFrom,
  oldTo,
}: {
  newFrom: SnakeFightDot
  newTo: SnakeFightDot
  oldFrom: SnakeFightDot
  oldTo: SnakeFightDot
}) => {
  const newStartsAtOldFrom =
    newFrom.id === oldFrom.id

  const newStartsAtOldTo =
    newFrom.id === oldTo.id

  const newEndsAtOldFrom =
    newTo.id === oldFrom.id

  const newEndsAtOldTo =
    newTo.id === oldTo.id

  return (
    (newStartsAtOldFrom || newStartsAtOldTo) &&
    !newEndsAtOldFrom &&
    !newEndsAtOldTo
  )
}

export const isSameOrReverseSegment = (
  a: Pick<SnakeFightSegment, 'fromDotId' | 'toDotId'>,
  b: Pick<SnakeFightSegment, 'fromDotId' | 'toDotId'>,
) => {
  const sameDirection =
    a.fromDotId === b.fromDotId &&
    a.toDotId === b.toDotId

  const reverseDirection =
    a.fromDotId === b.toDotId &&
    a.toDotId === b.fromDotId

  return sameDirection || reverseDirection
}

export const isMoveOnBorder = (
  fromDot: SnakeFightDot,
  toDot: SnakeFightDot,
) => {
  const topBorder =
    fromDot.row === 0 &&
    toDot.row === 0

  const bottomBorder =
    fromDot.row === SNAKE_FIGHT_BOARD_SIZE - 1 &&
    toDot.row === SNAKE_FIGHT_BOARD_SIZE - 1

  const leftBorder =
    fromDot.col === 0 &&
    toDot.col === 0

  const rightBorder =
    fromDot.col === SNAKE_FIGHT_BOARD_SIZE - 1 &&
    toDot.col === SNAKE_FIGHT_BOARD_SIZE - 1

  return (
    topBorder ||
    bottomBorder ||
    leftBorder ||
    rightBorder
  )
}

const getIntersectionPointKey = (
  a1: SnakeFightDot,
  a2: SnakeFightDot,
  b1: SnakeFightDot,
  b2: SnakeFightDot,
) => {
  const x1 = a1.col
  const y1 = a1.row
  const x2 = a2.col
  const y2 = a2.row

  const x3 = b1.col
  const y3 = b1.row
  const x4 = b2.col
  const y4 = b2.row

  const denominator =
    (x1 - x2) * (y3 - y4) -
    (y1 - y2) * (x3 - x4)

  // Παράλληλα / collinear.
  // Για scoring δεν το μετράμε σαν crossing.
  // Το same-path έχει ήδη απαγορευτεί στο validation.
  if (denominator === 0) {
    return null
  }

  const px =
    ((x1 * y2 - y1 * x2) * (x3 - x4) -
      (x1 - x2) * (x3 * y4 - y3 * x4)) /
    denominator

  const py =
    ((x1 * y2 - y1 * x2) * (y3 - y4) -
      (y1 - y2) * (x3 * y4 - y3 * x4)) /
    denominator

  return `${px.toFixed(3)}-${py.toFixed(3)}`
}

const getDotPointKey = (
  dot: SnakeFightDot,
) => {
  return `${dot.col.toFixed(3)}-${dot.row.toFixed(3)}`
}

export const countEnemyCrossings = ({
  dots,
  fromDot,
  toDot,
  segments,
  player,
  enemyHeadDotId,
}: {
  dots: SnakeFightDot[]
  fromDot: SnakeFightDot
  toDot: SnakeFightDot
  segments: SnakeFightSegment[]
  player: SnakeFightPlayer
  enemyHeadDotId: string
}) => {
  const crossingPointKeys = new Set<string>()

  segments.forEach((segment) => {
    if (segment.player === player) return

    const segmentDots = getSegmentDots(
      dots,
      segment,
    )

    if (!segmentDots) return

    const intersects =
      doSegmentsIntersect(
        fromDot,
        toDot,
        segmentDots.fromDot,
        segmentDots.toDot,
      )

    if (!intersects) return

    const intersectionPointKey =
      getIntersectionPointKey(
        fromDot,
        toDot,
        segmentDots.fromDot,
        segmentDots.toDot,
      )

    if (intersectionPointKey) {
      crossingPointKeys.add(intersectionPointKey)
    }
  })

  const enemyHeadDot =
    getDotById(dots, enemyHeadDotId)

  if (
    enemyHeadDot &&
    isPointOnSegment(enemyHeadDot, fromDot, toDot)
  ) {
    crossingPointKeys.add(
      getDotPointKey(enemyHeadDot),
    )
  }

  return crossingPointKeys.size
}

export const isValidSnakeFightMove = ({
  dots,
  segments,
  fromDot,
  toDot,
  player,
}: {
  dots: SnakeFightDot[]
  segments: SnakeFightSegment[]
  fromDot: SnakeFightDot
  toDot: SnakeFightDot
  player: SnakeFightPlayer
}) => {
  if (!areSnakeFightDotsAligned(fromDot, toDot)) {
    return false
  }

  if (isMoveOnBorder(fromDot, toDot)) {
    return false
  }

  const newSegment = {
    fromDotId: fromDot.id,
    toDotId: toDot.id,
  }

  for (const existingSegment of segments) {
    const existingDots = getSegmentDots(
      dots,
      existingSegment,
    )

    if (!existingDots) continue

    if (
      isSameOrReverseSegment(
        newSegment,
        existingSegment,
      )
    ) {
      return false
    }

    const overlapsSamePath =
      doSegmentsOverlapOnSameLine(
        fromDot,
        toDot,
        existingDots.fromDot,
        existingDots.toDot,
      )

    // Δεν επιτρέπεται να χρησιμοποιηθεί ίδιο path,
    // ούτε ολόκληρο ούτε μερικώς.
    // Αυτό ισχύει και για τα δύο snakes.
    if (overlapsSamePath) {
      return false
    }

    const intersects =
      doSegmentsIntersect(
        fromDot,
        toDot,
        existingDots.fromDot,
        existingDots.toDot,
      )

    if (!intersects) continue

    const fromOnExisting =
      isPointOnSegment(
        fromDot,
        existingDots.fromDot,
        existingDots.toDot,
      )

    const toOnExisting =
      isPointOnSegment(
        toDot,
        existingDots.fromDot,
        existingDots.toDot,
      )

    if (fromOnExisting && toOnExisting) {
      return false
    }

    if (existingSegment.player === player) {
      const allowedStartTouch =
        shareOnlyAllowedStartPoint({
          newFrom: fromDot,
          newTo: toDot,
          oldFrom: existingDots.fromDot,
          oldTo: existingDots.toDot,
        })

      if (!allowedStartTouch) {
        return false
      }
    }
  }

  return true
}

export const getLegalMovesForPlayer = ({
  dots,
  segments,
  player,
  player1HeadDotId,
  player2HeadDotId,
}: {
  dots: SnakeFightDot[]
  segments: SnakeFightSegment[]
  player: SnakeFightPlayer
  player1HeadDotId: string
  player2HeadDotId: string
}) => {
  const headDotId =
    player === 'player1'
      ? player1HeadDotId
      : player2HeadDotId

  const headDot = getDotById(dots, headDotId)

  if (!headDot) return []

  return dots
    .filter((dot) => dot.id !== headDot.id)
    .filter((dot) =>
      isValidSnakeFightMove({
        dots,
        segments,
        fromDot: headDot,
        toDot: dot,
        player,
      }),
    )
}

export const calculateSnakeFightWinner = (
  score: SnakeFightScore,
): SnakeFightWinner => {
  if (score.player1 > score.player2) {
    return 'player1'
  }

  if (score.player2 > score.player1) {
    return 'player2'
  }

  return 'draw'
}

export const getSnakeFightWinnerText = (
  winner: SnakeFightWinner,
) => {
  if (winner === 'draw') return 'Draw'
  if (winner === 'player1') return 'Blue wins'
  if (winner === 'player2') return 'Red wins'

  return ''
}