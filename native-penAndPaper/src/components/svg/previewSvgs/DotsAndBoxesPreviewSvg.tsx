import Svg, {
  Circle,
  Line,
  Rect,
} from 'react-native-svg'

type Props = {
  width: number
  height: number
  boardBackground: string
  boardLine: string
  player1Color: string
  player2Color: string
}

const DOT_ROWS = 5
const DOT_COLS = 5

const DotsAndBoxesPreviewSvg = ({
  width,
  height,
  boardBackground,
  boardLine,
  player1Color,
  player2Color,
}: Props) => {
  const padding = 14

  const usableWidth = width - padding * 2
  const usableHeight = height - padding * 2

  const spacingX = usableWidth / (DOT_COLS - 1)
  const spacingY = usableHeight / (DOT_ROWS - 1)

  const getDotPosition = (
    row: number,
    col: number,
  ) => {
    return {
      x: padding + col * spacingX,
      y: padding + row * spacingY,
    }
  }

  const ownedBoxes = [
    {
      id: 'box-0-0',
      row: 0,
      col: 0,
      color: player1Color,
    },
    {
      id: 'box-1-2',
      row: 1,
      col: 2,
      color: player2Color,
    },
    {
      id: 'box-2-1',
      row: 2,
      col: 1,
      color: player1Color,
    },
  ]

  const visibleEdges = [
    {
      id: 'h-0-0',
      row: 0,
      col: 0,
      orientation: 'horizontal',
      color: player1Color,
    },
    {
      id: 'h-1-0',
      row: 1,
      col: 0,
      orientation: 'horizontal',
      color: player1Color,
    },
    {
      id: 'v-0-0',
      row: 0,
      col: 0,
      orientation: 'vertical',
      color: player1Color,
    },
    {
      id: 'v-0-1',
      row: 0,
      col: 1,
      orientation: 'vertical',
      color: player1Color,
    },

    {
      id: 'h-1-2',
      row: 1,
      col: 2,
      orientation: 'horizontal',
      color: player2Color,
    },
    {
      id: 'h-2-2',
      row: 2,
      col: 2,
      orientation: 'horizontal',
      color: player2Color,
    },
    {
      id: 'v-1-2',
      row: 1,
      col: 2,
      orientation: 'vertical',
      color: player2Color,
    },
    {
      id: 'v-1-3',
      row: 1,
      col: 3,
      orientation: 'vertical',
      color: player2Color,
    },

    {
      id: 'h-2-1',
      row: 2,
      col: 1,
      orientation: 'horizontal',
      color: player1Color,
    },
    {
      id: 'h-3-1',
      row: 3,
      col: 1,
      orientation: 'horizontal',
      color: player1Color,
    },
    {
      id: 'v-2-1',
      row: 2,
      col: 1,
      orientation: 'vertical',
      color: player1Color,
    },
    {
      id: 'v-2-2',
      row: 2,
      col: 2,
      orientation: 'vertical',
      color: player1Color,
    },

    {
      id: 'h-3-2',
      row: 3,
      col: 2,
      orientation: 'horizontal',
      color: player2Color,
    },
    {
      id: 'v-2-4',
      row: 2,
      col: 4,
      orientation: 'vertical',
      color: player2Color,
    },
  ] as const

  const getEdgePoints = (
    edge: typeof visibleEdges[number],
  ) => {
    if (edge.orientation === 'horizontal') {
      const start = getDotPosition(
        edge.row,
        edge.col,
      )

      const end = getDotPosition(
        edge.row,
        edge.col + 1,
      )

      return {
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
      }
    }

    const start = getDotPosition(
      edge.row,
      edge.col,
    )

    const end = getDotPosition(
      edge.row + 1,
      edge.col,
    )

    return {
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
    }
  }

  const dots = Array.from(
    {
      length: DOT_ROWS * DOT_COLS,
    },
    (_, index) => {
      const row = Math.floor(index / DOT_COLS)
      const col = index % DOT_COLS

      return {
        id: `dot-${row}-${col}`,
        row,
        col,
      }
    },
  )

  return (
    <Svg
      width={width}
      height={height}
    >
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={10}
        fill={boardBackground}
        opacity={0.35}
      />

      {ownedBoxes.map((box) => (
        <Rect
          key={box.id}
          x={padding + box.col * spacingX}
          y={padding + box.row * spacingY}
          width={spacingX}
          height={spacingY}
          fill={box.color}
          opacity={0.24}
        />
      ))}

      {visibleEdges.map((edge) => {
        const points = getEdgePoints(edge)

        return (
          <Line
            key={edge.id}
            x1={points.x1}
            y1={points.y1}
            x2={points.x2}
            y2={points.y2}
            stroke={edge.color}
            strokeWidth={4}
            strokeLinecap='round'
          />
        )
      })}

      {dots.map((dot) => {
        const { x, y } = getDotPosition(
          dot.row,
          dot.col,
        )

        return (
          <Circle
            key={dot.id}
            cx={x}
            cy={y}
            r={4}
            fill={boardLine}
          />
        )
      })}
    </Svg>
  )
}

export default DotsAndBoxesPreviewSvg