// native-penAndPaper/src/components/svg/slingshot/SlinshotComponentSvg.tsx

import { useState } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { scheduleOnRN } from 'react-native-worklets'
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
      return { x, y }
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

    const shotDx = originX - x
    const shotDy = originY - y

    const radians = Math.atan2(shotDy, shotDx)

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

    onRelease(result)

    setDragX(originX)
    setDragY(originY)
    setIsDragging(false)
  }

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      scheduleOnRN(setIsDragging, true)
    })
    .onUpdate((event) => {
      const nextX = originX + event.translationX
      const nextY = originY + event.translationY

      const clampedPosition = clampToMaxDistance(
        nextX,
        nextY,
      )

      scheduleOnRN(setDragX, clampedPosition.x)
      scheduleOnRN(setDragY, clampedPosition.y)
    })
    .onEnd((event) => {
      const nextX = originX + event.translationX
      const nextY = originY + event.translationY

      const clampedPosition = clampToMaxDistance(
        nextX,
        nextY,
      )

      scheduleOnRN(
        finishDrag,
        clampedPosition.x,
        clampedPosition.y,
      )
    })

  return (
    <GestureDetector gesture={panGesture}>
      <Svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
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
    </GestureDetector>
  )
}

export default SlingshotComponentSvg