import Svg, {
  Circle,
  Line,
} from 'react-native-svg'
import DotsAndBoxesBoxesLayer, { DotsAndBoxesOwnedBox } from './DotsAndBoxesBoxesLayer'

export type DotsAndBoxesEdge = {
  id: string
  row: number
  col: number
  orientation: 'horizontal' | 'vertical'
  color: string
  isVisible: boolean
}

type Props = {
  rows: number
  cols: number
  edges: DotsAndBoxesEdge[]
  dotColor: string
  emptyEdgeColor: string
  boardLine: string
  onEdgePress: (edgeId: string) => void
  boxes: DotsAndBoxesOwnedBox[]
}

const DOT_RADIUS = 6
const SPACING = 48
const PADDING = 28

const VISIBLE_LINE_WIDTH = 4
const TOUCH_LINE_WIDTH = 22

const DotsAndBoxesBoardSvg = ({
  rows,
  cols,
  edges,
  dotColor,
  emptyEdgeColor,
  boardLine,
  onEdgePress,
  boxes,
}: Props) => {
  const svgWidth =
    PADDING * 2 + (cols - 1) * SPACING

  const svgHeight =
    PADDING * 2 + (rows - 1) * SPACING

  const getDotPosition = (
    row: number,
    col: number,
  ) => {
    return {
      x: PADDING + col * SPACING,
      y: PADDING + row * SPACING,
    }
  }

  const getEdgePoints = (
    edge: DotsAndBoxesEdge,
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
    { length: rows * cols },
    (_, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols

      return {
        id: `dot-${row}-${col}`,
        row,
        col,
      }
    },
  )

  return (
    <Svg
      width={svgWidth}
      height={svgHeight}
    >
      <DotsAndBoxesBoxesLayer
        boxes={boxes}
        spacing={SPACING}
        padding={PADDING}
      />
      
      {/* Visible edge lines */}
      {edges.map((edge) => {
        const points = getEdgePoints(edge)

        return (
          <Line
            key={`visible-${edge.id}`}
            x1={points.x1}
            y1={points.y1}
            x2={points.x2}
            y2={points.y2}
            stroke={
              edge.isVisible
                ? edge.color
                : emptyEdgeColor
            }
            strokeWidth={VISIBLE_LINE_WIDTH}
            strokeLinecap='round'
            opacity={edge.isVisible ? 1 : 0.15}
          />
        )
      })}

      {/* Dots */}
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
            r={DOT_RADIUS}
            fill={dotColor}
          />
        )
      })}

      {/* Invisible touch lines */}
      {edges.map((edge) => {
        const points = getEdgePoints(edge)

        return (
          <Line
            key={`touch-${edge.id}`}
            x1={points.x1}
            y1={points.y1}
            x2={points.x2}
            y2={points.y2}
            stroke='transparent'
            strokeWidth={TOUCH_LINE_WIDTH}
            strokeLinecap='round'
            onPress={() => onEdgePress(edge.id)}
          />
        )
      })}
    </Svg>
  )
}

export default DotsAndBoxesBoardSvg