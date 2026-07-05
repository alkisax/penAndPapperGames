import { useRef, useState } from 'react'
import {
  PanResponder,
  View,
} from 'react-native'
import Svg, {
  Circle,
  Line,
  Rect,
} from 'react-native-svg'
import {
  areSnakeFightDotsAligned,
} from '@/utils/snakefight/snakeFightUtils'

export type SnakeFightPlayer = 'player1' | 'player2'

export type SnakeFightDot = {
  id: string
  row: number
  col: number
}

export type SnakeFightSegment = {
  id: string
  fromDotId: string
  toDotId: string
  player: SnakeFightPlayer
}

type Props = {
  dots: SnakeFightDot[]
  segments: SnakeFightSegment[]
  currentPlayer: SnakeFightPlayer
  player1HeadDotId: string
  player2HeadDotId: string
  gameOver?: boolean
  boardBackground: string
  boardLine: string
  dotColor: string
  player1Color: string
  player2Color: string
  onMoveAttempt: (
    fromDotId: string,
    toDotId: string,
  ) => void
}

const BOARD_SIZE = 5
const SPACING = 56
const PADDING = 32
const DOT_RADIUS = 6
const HEAD_RADIUS = 12

const SVG_SIZE =
  PADDING * 2 + (BOARD_SIZE - 1) * SPACING

export const getSnakeFightDotPosition = (
  dot: SnakeFightDot,
) => {
  return {
    x: PADDING + dot.col * SPACING,
    y: PADDING + dot.row * SPACING,
  }
}

const getNearestSnakeFightDot = (
  x: number,
  y: number,
  dots: SnakeFightDot[],
): SnakeFightDot | null => {
  let nearestDot: SnakeFightDot | null = null
  let nearestDistance = Number.POSITIVE_INFINITY

  dots.forEach((dot) => {
    const position = getSnakeFightDotPosition(dot)

    const dx = x - position.x
    const dy = y - position.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestDot = dot
    }
  })

  if (nearestDistance > SPACING * 0.45) {
    return null
  }

  return nearestDot
}

const getNearestAlignedSnakeFightDot = (
  x: number,
  y: number,
  startDot: SnakeFightDot,
  dots: SnakeFightDot[],
): SnakeFightDot | null => {
  let nearestDot: SnakeFightDot | null = null
  let nearestDistance = Number.POSITIVE_INFINITY

  dots.forEach((dot) => {
    const isSameDot = dot.id === startDot.id
    const isAligned =
      areSnakeFightDotsAligned(startDot, dot)

    if (isSameDot || !isAligned) return

    const position = getSnakeFightDotPosition(dot)

    const dx = x - position.x
    const dy = y - position.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestDot = dot
    }
  })

  if (nearestDistance > SPACING * 0.45) {
    return null
  }

  return nearestDot
}

const SnakeFightBoardSvg = ({
  dots,
  segments,
  currentPlayer,
  player1HeadDotId,
  player2HeadDotId,
  gameOver = false,
  boardBackground,
  boardLine,
  dotColor,
  player1Color,
  player2Color,
  onMoveAttempt,
}: Props) => {
  const [dragStartDot, setDragStartDot] =
    useState<SnakeFightDot | null>(null)

  const [dragX, setDragX] = useState(0)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const dragStartDotRef =
    useRef<SnakeFightDot | null>(null)

  const currentHeadDotId =
    currentPlayer === 'player1'
      ? player1HeadDotId
      : player2HeadDotId

  const currentPlayerColor =
    currentPlayer === 'player1'
      ? player1Color
      : player2Color

  const getDotById = (dotId: string) => {
    return dots.find((dot) => dot.id === dotId)
  }

  const clearDrag = () => {
    dragStartDotRef.current = null
    setDragStartDot(null)
    setDragX(0)
    setDragY(0)
    setIsDragging(false)
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !gameOver,
    onMoveShouldSetPanResponder: () => !gameOver,

    onPanResponderGrant: (event) => {
      if (gameOver) return

      const { locationX, locationY } =
        event.nativeEvent

      const startDot = getNearestSnakeFightDot(
        locationX,
        locationY,
        dots,
      )

      if (!startDot) return

      if (startDot.id !== currentHeadDotId) {
        return
      }

      const startPosition =
        getSnakeFightDotPosition(startDot)

      dragStartDotRef.current = startDot
      setDragStartDot(startDot)
      setDragX(startPosition.x)
      setDragY(startPosition.y)
      setIsDragging(true)
    },

    onPanResponderMove: (event) => {
      const startDot = dragStartDotRef.current

      if (!startDot) return

      const { locationX, locationY } =
        event.nativeEvent

      const nearestAlignedDot =
        getNearestAlignedSnakeFightDot(
          locationX,
          locationY,
          startDot,
          dots,
        )

      if (!nearestAlignedDot) {
        setDragX(locationX)
        setDragY(locationY)
        return
      }

      const snappedPosition =
        getSnakeFightDotPosition(nearestAlignedDot)

      setDragX(snappedPosition.x)
      setDragY(snappedPosition.y)
    },

    onPanResponderRelease: (event) => {
      const startDot = dragStartDotRef.current

      if (!startDot) {
        clearDrag()
        return
      }

      const { locationX, locationY } =
        event.nativeEvent

      const endDot =
        getNearestAlignedSnakeFightDot(
          locationX,
          locationY,
          startDot,
          dots,
        )

      if (!endDot) {
        clearDrag()
        return
      }

      onMoveAttempt(
        startDot.id,
        endDot.id,
      )

      clearDrag()
    },

    onPanResponderTerminate: () => {
      clearDrag()
    },
  })

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        width: SVG_SIZE,
        height: SVG_SIZE,
      }}
    >
      <Svg
        width={SVG_SIZE}
        height={SVG_SIZE}
      >
        <Rect
          x={0}
          y={0}
          width={SVG_SIZE}
          height={SVG_SIZE}
          fill='transparent'
        />

        <Rect
          x={PADDING}
          y={PADDING}
          width={(BOARD_SIZE - 1) * SPACING}
          height={(BOARD_SIZE - 1) * SPACING}
          fill={boardBackground}
          stroke={boardLine}
          strokeWidth={2}
          opacity={0.25}
        />

        {segments.map((segment) => {
          const fromDot = getDotById(segment.fromDotId)
          const toDot = getDotById(segment.toDotId)

          if (!fromDot || !toDot) return null

          const from =
            getSnakeFightDotPosition(fromDot)

          const to =
            getSnakeFightDotPosition(toDot)

          return (
            <Line
              key={segment.id}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={
                segment.player === 'player1'
                  ? player1Color
                  : player2Color
              }
              strokeWidth={5}
              strokeLinecap='round'
              opacity={0.9}
            />
          )
        })}

        {isDragging && dragStartDot && (
          <Line
            x1={getSnakeFightDotPosition(dragStartDot).x}
            y1={getSnakeFightDotPosition(dragStartDot).y}
            x2={dragX}
            y2={dragY}
            stroke={currentPlayerColor}
            strokeWidth={5}
            strokeLinecap='round'
            opacity={0.45}
          />
        )}

        {dots.map((dot) => {
          const { x, y } =
            getSnakeFightDotPosition(dot)

          const isPlayer1Head =
            dot.id === player1HeadDotId

          const isPlayer2Head =
            dot.id === player2HeadDotId

          if (isPlayer1Head) {
            return (
              <Circle
                key={dot.id}
                cx={x}
                cy={y}
                r={HEAD_RADIUS}
                fill={player1Color}
                stroke={boardLine}
                strokeWidth={2}
              />
            )
          }

          if (isPlayer2Head) {
            return (
              <Circle
                key={dot.id}
                cx={x}
                cy={y}
                r={HEAD_RADIUS}
                fill={player2Color}
                stroke={boardLine}
                strokeWidth={2}
              />
            )
          }

          return (
            <Circle
              key={dot.id}
              cx={x}
              cy={y}
              r={DOT_RADIUS}
              fill={dotColor}
            />
          )
        })}
      </Svg>
    </View>
  )
}

export default SnakeFightBoardSvg