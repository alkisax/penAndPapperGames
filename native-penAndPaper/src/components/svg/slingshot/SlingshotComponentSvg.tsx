// native-penAndPaper/src/components/svg/slingshot/SlingshotComponentSvg.tsx

import {
  useEffect,
  useState,
} from 'react'

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

// Μεγαλύτερο overlay για να μην κόβεται από το board.
const OVERLAY_PADDING = MAX_PULL_DISTANCE

// Μικρό safe offset προς τα μέσα όταν το πιόνι είναι κοντά σε άκρη.
// Δεν μετακινεί το πιόνι. Μετακινεί μόνο το slingshot UI.
const EDGE_OFFSET_X = 56
const EDGE_OFFSET_Y = 70

const clamp = (
  value: number,
  min: number,
  max: number,
) => {
  return Math.max(
    min,
    Math.min(value, max),
  )
}

const SlingshotComponentSvg = ({
  originX,
  originY,
  width,
  height,
  circleColor,
  lineColor,
  onRelease,
}: Props) => {
  const overlayWidth = width + OVERLAY_PADDING * 2
  const overlayHeight = height + OVERLAY_PADDING * 2

  const controlOriginX = clamp(
    originX,
    EDGE_OFFSET_X,
    width - EDGE_OFFSET_X,
  )

  const controlOriginY = clamp(
    originY,
    EDGE_OFFSET_Y,
    height - EDGE_OFFSET_Y,
  )

  const localOriginX = controlOriginX + OVERLAY_PADDING
  const localOriginY = controlOriginY + OVERLAY_PADDING

  const [dragX, setDragX] = useState(localOriginX)
  const [dragY, setDragY] = useState(localOriginY)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setDragX(localOriginX)
    setDragY(localOriginY)
    setIsDragging(false)
  }, [
    localOriginX,
    localOriginY,
  ])

  const clampToMaxDistance = (
    x: number,
    y: number,
  ) => {
    const dx = x - localOriginX
    const dy = y - localOriginY

    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= MAX_PULL_DISTANCE) {
      return {
        x,
        y,
      }
    }

    const ratio = MAX_PULL_DISTANCE / distance

    return {
      x: localOriginX + dx * ratio,
      y: localOriginY + dy * ratio,
    }
  }

  const calculateResult = (
    x: number,
    y: number,
  ): SlingshotResult => {
    const pullDx = x - localOriginX
    const pullDy = y - localOriginY

    const distance = Math.sqrt(
      pullDx * pullDx + pullDy * pullDy,
    )

    const power = Math.min(
      Math.round((distance / MAX_PULL_DISTANCE) * 100),
      100,
    )

    // Το shot πάει αντίθετα από το pull.
    const shotDx = localOriginX - x
    const shotDy = localOriginY - y

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

    setDragX(localOriginX)
    setDragY(localOriginY)
    setIsDragging(false)

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
      setDragX(localOriginX)
      setDragY(localOriginY)
    },

    onPanResponderMove: (_, gestureState) => {
      const nextX = localOriginX + gestureState.dx
      const nextY = localOriginY + gestureState.dy

      const clampedPosition = clampToMaxDistance(
        nextX,
        nextY,
      )

      setDragX(clampedPosition.x)
      setDragY(clampedPosition.y)
    },

    onPanResponderRelease: (_, gestureState) => {
      const nextX = localOriginX + gestureState.dx
      const nextY = localOriginY + gestureState.dy

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
      setDragX(localOriginX)
      setDragY(localOriginY)
      setIsDragging(false)
    },
  })

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        top: -OVERLAY_PADDING,
        left: -OVERLAY_PADDING,
        width: overlayWidth,
        height: overlayHeight,
      }}
    >
      <Svg
        width={overlayWidth}
        height={overlayHeight}
      >
        {isDragging && (
          <Circle
            cx={localOriginX}
            cy={localOriginY}
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
            x1={localOriginX}
            y1={localOriginY}
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