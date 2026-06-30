import Svg, {
  G,
  Line,
  Path,
  Rect,
} from 'react-native-svg'

import XSprite from '@/components/svg/SvgSprites/XSprite'
import OSprite from '@/components/svg/SvgSprites/OSprite'

type Props = {
  width?: number
  height?: number
  boardBackground: string
  boardLine: string
  baseColor: string
  goalColor: string
  player1Color: string
  player2Color: string
  trailColor?: string
  opacity?: number
}

const SVG_WIDTH = 380
const SVG_HEIGHT = 620

const LARGE_WIDTH = SVG_WIDTH * 0.8
const SMALL_WIDTH = SVG_WIDTH * 0.2

const LARGE_HEIGHT = 280
const SMALL_HEIGHT = 42

const PaperAirfightPreviewSvg = ({
  width = 95,
  height = 150,
  boardBackground,
  boardLine,
  baseColor,
  goalColor,
  player1Color,
  player2Color,
  trailColor,
  opacity = 1,
}: Props) => {
  const getCenteredStartX = (targetWidth: number) => {
    return (SVG_WIDTH - targetWidth) / 2
  }

  const createTopHillPath = (
    targetWidth: number,
    targetHeight: number,
  ) => {
    const startX = getCenteredStartX(targetWidth)
    const endX = startX + targetWidth

    return `
      M ${startX} 0
      Q ${SVG_WIDTH / 2} ${targetHeight}
        ${endX} 0
    `
  }

  const createBottomHillPath = (
    targetWidth: number,
    targetHeight: number,
  ) => {
    const startX = getCenteredStartX(targetWidth)
    const endX = startX + targetWidth

    return `
      M ${startX} ${SVG_HEIGHT}
      Q ${SVG_WIDTH / 2} ${SVG_HEIGHT - targetHeight}
        ${endX} ${SVG_HEIGHT}
    `
  }

  const topLargePath = createTopHillPath(
    LARGE_WIDTH,
    LARGE_HEIGHT,
  )

  const topSmallPath = createTopHillPath(
    SMALL_WIDTH,
    SMALL_HEIGHT,
  )

  const bottomLargePath = createBottomHillPath(
    LARGE_WIDTH,
    LARGE_HEIGHT,
  )

  const bottomSmallPath = createBottomHillPath(
    SMALL_WIDTH,
    SMALL_HEIGHT,
  )

  const pieces = [
    {
      id: 'x-1',
      type: 'x' as const,
      x: 105,
      y: 540,
      color: player1Color,
      size: 20,
    },
    {
      id: 'x-2',
      type: 'x' as const,
      x: 190,
      y: 575,
      color: player1Color,
      size: 20,
    },
    {
      id: 'x-3',
      type: 'x' as const,
      x: 275,
      y: 540,
      color: player1Color,
      size: 20,
    },
    {
      id: 'o-1',
      type: 'o' as const,
      x: 105,
      y: 80,
      color: player2Color,
      size: 20,
    },
    {
      id: 'o-2',
      type: 'o' as const,
      x: 190,
      y: 45,
      color: player2Color,
      size: 20,
    },
    {
      id: 'o-3',
      type: 'o' as const,
      x: 275,
      y: 80,
      color: player2Color,
      size: 20,
    },
  ]

  const trailLines = [
    {
      id: 'trail-1',
      x1: 105,
      y1: 540,
      x2: 180,
      y2: 440,
      color: trailColor ?? player1Color,
    },
    {
      id: 'trail-2',
      x1: 275,
      y1: 80,
      x2: 210,
      y2: 170,
      color: trailColor ?? player2Color,
    },
  ]

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      opacity={opacity}
    >
      <Rect
        x={0}
        y={0}
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        fill={boardBackground}
        stroke={boardLine}
        strokeWidth={8}
      />

      <Path
        d={topLargePath}
        fill='transparent'
        stroke={baseColor}
        strokeWidth={10}
      />

      <Path
        d={topSmallPath}
        fill='transparent'
        stroke={goalColor}
        strokeWidth={10}
      />

      <Path
        d={bottomLargePath}
        fill='transparent'
        stroke={baseColor}
        strokeWidth={10}
      />

      <Path
        d={bottomSmallPath}
        fill='transparent'
        stroke={goalColor}
        strokeWidth={10}
      />

      {trailLines.map((line) => (
        <Line
          key={line.id}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={line.color}
          strokeWidth={8}
          strokeLinecap='round'
          opacity={0.55}
        />
      ))}

      <G>
        {pieces.map((piece) => {
          if (piece.type === 'x') {
            return (
              <XSprite
                key={piece.id}
                x={piece.x}
                y={piece.y}
                color={piece.color}
                size={piece.size}
              />
            )
          }

          return (
            <OSprite
              key={piece.id}
              x={piece.x}
              y={piece.y}
              color={piece.color}
              size={piece.size}
            />
          )
        })}
      </G>
    </Svg>
  )
}

export default PaperAirfightPreviewSvg