import { useState } from 'react'
import {
  PanResponder,
  View,
} from 'react-native'
import Svg, {
  Circle,
  Line,
} from 'react-native-svg'

export type SlingshotResult = {
  power: number
  angle: number
}

type Props = {
  originX: number
  originY: number
  width: number
  height: number
  circleColor: string
  lineColor: string
  onRelease: (result: SlingshotResult) => void
}

const MAX_PULL_DISTANCE = 100
const GHOST_RADIUS = 18

const SlingshotComponentSvg = ({
  originX,
  originY,
  width,
  height,
  circleColor,
  lineColor,
  onRelease,
}: Props) => {
  const [dragX, setDragX] = useState(originX)
  const [dragY, setDragY] = useState(originY)
  const [isDragging, setIsDragging] = useState(false)

  const clampToMaxDistance = (
    x: number,
    y: number,
  ) => {
    const dx = x - originX
    const dy = y - originY

    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= MAX_PULL_DISTANCE) {
      return {
        x,
        y,
      }
    }

    const ratio = MAX_PULL_DISTANCE / distance

    return {
      x: originX + dx * ratio,
      y: originY + dy * ratio,
    }
  }

  const calculateResult = (
    x: number,
    y: number,
  ): SlingshotResult => {
    const pullDx = x - originX
    const pullDy = y - originY

    const distance = Math.sqrt(
      pullDx * pullDx + pullDy * pullDy,
    )

    const power = Math.min(
      Math.round((distance / MAX_PULL_DISTANCE) * 100),
      100,
    )

    // Το shot πάει αντίθετα από το pull.
    const shotDx = originX - x
    const shotDy = originY - y

    const radians = Math.atan2(
      shotDy,
      shotDx,
    )

    let angle = radians * 180 / Math.PI

    if (angle < 0) {
      angle += 360
    }

    return {
      power,
      angle: Math.round(angle),
    }
  }

  const finishDrag = (
    x: number,
    y: number,
  ) => {
    const result = calculateResult(x, y)

    setDragX(originX)
    setDragY(originY)
    setIsDragging(false)

    // Αν απλώς πάτησε χωρίς να τραβήξει,
    // δεν κάνουμε shot.
    if (result.power <= 0) {
      return
    }

    onRelease(result)
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: () => {
      setIsDragging(true)
      setDragX(originX)
      setDragY(originY)
    },

    onPanResponderMove: (_, gestureState) => {
      const nextX = originX + gestureState.dx
      const nextY = originY + gestureState.dy

      const clampedPosition = clampToMaxDistance(
        nextX,
        nextY,
      )

      setDragX(clampedPosition.x)
      setDragY(clampedPosition.y)
    },

    onPanResponderRelease: (_, gestureState) => {
      const nextX = originX + gestureState.dx
      const nextY = originY + gestureState.dy

      const clampedPosition = clampToMaxDistance(
        nextX,
        nextY,
      )

      finishDrag(
        clampedPosition.x,
        clampedPosition.y,
      )
    },

    onPanResponderTerminate: () => {
      setDragX(originX)
      setDragY(originY)
      setIsDragging(false)
    },
  })

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
      }}
      pointerEvents='auto'
    >
      <Svg
        width={width}
        height={height}
      >
        {isDragging && (
          <Circle
            cx={originX}
            cy={originY}
            r={MAX_PULL_DISTANCE}
            fill='transparent'
            stroke={circleColor}
            opacity={0.35}
            strokeWidth={3}
            strokeDasharray='8 6'
          />
        )}

        {isDragging && (
          <Line
            x1={originX}
            y1={originY}
            x2={dragX}
            y2={dragY}
            stroke={lineColor}
            opacity={0.35}
            strokeWidth={4}
            strokeLinecap='round'
          />
        )}

        {isDragging && (
          <Circle
            cx={dragX}
            cy={dragY}
            r={GHOST_RADIUS}
            fill={circleColor}
            opacity={0.45}
          />
        )}
      </Svg>
    </View>
  )
}

export default SlingshotComponentSvg