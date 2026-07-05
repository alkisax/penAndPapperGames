import Svg, {
  Circle,
  G,
  Line,
  Rect,
} from 'react-native-svg'

type Props = {
  width?: number
  height?: number
  boardBackground: string
  boardLine: string
  player1Color: string
  player2Color: string
  dotColor?: string
  opacity?: number
}

type PreviewDot = {
  id: string
  row: number
  col: number
}

type PreviewSegment = {
  id: string
  fromDotId: string
  toDotId: string
  player: 'player1' | 'player2'
}

const BOARD_SIZE = 5
const SPACING = 56
const PADDING = 32
const DOT_RADIUS = 6
const HEAD_RADIUS = 12

const SVG_SIZE =
  PADDING * 2 + (BOARD_SIZE - 1) * SPACING

const previewDots: PreviewDot[] = Array.from(
  { length: BOARD_SIZE * BOARD_SIZE },
  (_, index) => {
    const row = Math.floor(index / BOARD_SIZE)
    const col = index % BOARD_SIZE

    return {
      id: `${row}-${col}`,
      row,
      col,
    }
  },
)

const previewSegments: PreviewSegment[] = [
  {
    id: 'blue-1',
    fromDotId: '0-0',
    toDotId: '2-2',
    player: 'player1',
  },
  {
    id: 'red-1',
    fromDotId: '4-4',
    toDotId: '1-4',
    player: 'player2',
  },
  {
    id: 'blue-2',
    fromDotId: '2-2',
    toDotId: '2-4',
    player: 'player1',
  },
  {
    id: 'red-2',
    fromDotId: '1-4',
    toDotId: '3-2',
    player: 'player2',
  },
  {
    id: 'blue-3',
    fromDotId: '2-4',
    toDotId: '4-2',
    player: 'player1',
  },
  {
    id: 'red-3',
    fromDotId: '3-2',
    toDotId: '0-2',
    player: 'player2',
  },
]

const getDotPosition = (dot: PreviewDot) => {
  return {
    x: PADDING + dot.col * SPACING,
    y: PADDING + dot.row * SPACING,
  }
}

const getDotById = (dotId: string) => {
  return previewDots.find((dot) => dot.id === dotId)
}

const SnakeFightPreviewSvg = ({
  width = 130,
  height = 130,
  boardBackground,
  boardLine,
  player1Color,
  player2Color,
  dotColor,
  opacity = 1,
}: Props) => {
  const player1HeadDotId = '4-2'
  const player2HeadDotId = '0-2'

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      opacity={opacity}
    >
      <Rect
        x={0}
        y={0}
        width={SVG_SIZE}
        height={SVG_SIZE}
        rx={18}
        fill='transparent'
      />

      <Rect
        x={PADDING}
        y={PADDING}
        width={(BOARD_SIZE - 1) * SPACING}
        height={(BOARD_SIZE - 1) * SPACING}
        fill={boardBackground}
        stroke={boardLine}
        strokeWidth={4}
        opacity={0.22}
      />

      <G>
        {previewSegments.map((segment) => {
          const fromDot = getDotById(segment.fromDotId)
          const toDot = getDotById(segment.toDotId)

          if (!fromDot || !toDot) return null

          const from = getDotPosition(fromDot)
          const to = getDotPosition(toDot)

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
              strokeWidth={8}
              strokeLinecap='round'
              opacity={0.82}
            />
          )
        })}
      </G>

      <G>
        {previewDots.map((dot) => {
          const { x, y } = getDotPosition(dot)

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
              fill={dotColor ?? boardLine}
              opacity={0.75}
            />
          )
        })}
      </G>
    </Svg>
  )
}

export default SnakeFightPreviewSvg