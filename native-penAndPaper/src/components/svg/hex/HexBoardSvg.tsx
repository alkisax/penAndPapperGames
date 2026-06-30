import Svg, {
  Line,
  Polygon,
  Rect,
  Text,
} from 'react-native-svg'

import type {
  HexCell,
} from '@/utils/hexUtils/hexUtils'

type SideLine = {
  id: string
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
  color: string
  isCurrent: boolean
}

type Props = {
  boardSize: number
  cells: HexCell[]
  boardBackground: string
  boardLine: string
  player1Color: string
  player2Color: string
  currentPlayerColor: string
  onCellPress: (cellId: number) => void
}

// radius από κέντρο μέχρι πάνω/κάτω γωνία
const HEX_RADIUS = 16

const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS
const HEX_HEIGHT = HEX_RADIUS * 2

const HORIZONTAL_SPACING = HEX_WIDTH
const VERTICAL_SPACING = HEX_RADIUS * 1.5

const PADDING = 34

const getHexPoints = (
  centerX: number,
  centerY: number,
) => {
  return [
    {
      x: centerX,
      y: centerY - HEX_RADIUS,
    },
    {
      x: centerX + HEX_WIDTH / 2,
      y: centerY - HEX_RADIUS / 2,
    },
    {
      x: centerX + HEX_WIDTH / 2,
      y: centerY + HEX_RADIUS / 2,
    },
    {
      x: centerX,
      y: centerY + HEX_RADIUS,
    },
    {
      x: centerX - HEX_WIDTH / 2,
      y: centerY + HEX_RADIUS / 2,
    },
    {
      x: centerX - HEX_WIDTH / 2,
      y: centerY - HEX_RADIUS / 2,
    },
  ]
}

const createHexPoints = (
  centerX: number,
  centerY: number,
) => {
  return getHexPoints(centerX, centerY)
    .map((point) => `${point.x},${point.y}`)
    .join(' ')
}

const HexBoardSvg = ({
  boardSize,
  cells,
  boardBackground,
  boardLine,
  player1Color,
  player2Color,
  currentPlayerColor,
  onCellPress,
}: Props) => {
  const svgWidth =
    PADDING * 2 +
    HEX_WIDTH * (boardSize + (boardSize - 1) / 2)

  const svgHeight =
    PADDING * 2 +
    HEX_HEIGHT +
    VERTICAL_SPACING * (boardSize - 1)

  const getCellCenter = (
    row: number,
    col: number,
  ) => {
    return {
      x:
        PADDING +
        HEX_WIDTH / 2 +
        col * HORIZONTAL_SPACING +
        row * (HEX_WIDTH / 2),
      y:
        PADDING +
        HEX_RADIUS +
        row * VERTICAL_SPACING,
    }
  }

  const sideLines: SideLine[] = cells.flatMap((cell) => {
    const { x, y } = getCellCenter(
      cell.row,
      cell.col,
    )

    const points = getHexPoints(x, y)

    const lines: SideLine[] = []

    // Player 2: πάνω πλευρά
    if (cell.row === 0) {
      lines.push({
        id: `top-left-${cell.id}`,
        from: points[5],
        to: points[0],
        color: player2Color,
        isCurrent: currentPlayerColor === player2Color,
      })

      if (cell.col < boardSize - 1) {
        lines.push({
          id: `top-right-${cell.id}`,
          from: points[0],
          to: points[1],
          color: player2Color,
          isCurrent: currentPlayerColor === player2Color,
        })
      }
    }

    // Player 2: κάτω πλευρά
    if (cell.row === boardSize - 1) {
      if (cell.col > 0) {
        lines.push({
          id: `bottom-left-${cell.id}`,
          from: points[3],
          to: points[4],
          color: player2Color,
          isCurrent: currentPlayerColor === player2Color,
        })
      }

      lines.push({
        id: `bottom-right-${cell.id}`,
        from: points[2],
        to: points[3],
        color: player2Color,
        isCurrent: currentPlayerColor === player2Color,
      })
    }

    // Player 1: αριστερή πλευρά
    if (cell.col === 0) {
      lines.push({
        id: `left-upper-${cell.id}`,
        from: points[5],
        to: points[4],
        color: player1Color,
        isCurrent: currentPlayerColor === player1Color,
      })

      lines.push({
        id: `left-lower-${cell.id}`,
        from: points[4],
        to: points[3],
        color: player1Color,
        isCurrent: currentPlayerColor === player1Color,
      })
    }

    // Player 1: δεξιά πλευρά
    if (cell.col === boardSize - 1) {
      lines.push({
        id: `right-upper-${cell.id}`,
        from: points[0],
        to: points[1],
        color: player1Color,
        isCurrent: currentPlayerColor === player1Color,
      })

      lines.push({
        id: `right-lower-${cell.id}`,
        from: points[1],
        to: points[2],
        color: player1Color,
        isCurrent: currentPlayerColor === player1Color,
      })
    }

    return lines
  })

  return (
    <Svg
      width={svgWidth}
      height={svgHeight}
    >
      <Rect
        x={0}
        y={0}
        width={svgWidth}
        height={svgHeight}
        fill='transparent'
      />

      <Text
        x={svgWidth / 2}
        y={18}
        textAnchor='middle'
        fontSize={14}
        fill={player2Color}
      >
        Player 2
      </Text>

      <Text
        x={svgWidth / 2}
        y={svgHeight - 8}
        textAnchor='middle'
        fontSize={14}
        fill={player2Color}
      >
        Player 2
      </Text>

      <Text
        x={14}
        y={svgHeight / 2}
        textAnchor='middle'
        fontSize={14}
        fill={player1Color}
        transform={`rotate(-90 14 ${svgHeight / 2})`}
      >
        Player 1
      </Text>

      <Text
        x={svgWidth - 14}
        y={svgHeight / 2}
        textAnchor='middle'
        fontSize={14}
        fill={player1Color}
        transform={`rotate(90 ${svgWidth - 14} ${svgHeight / 2})`}
      >
        Player 1
      </Text>

      {cells.map((cell) => {
        const { x, y } = getCellCenter(
          cell.row,
          cell.col,
        )

        const fillColor =
          cell.owner === 'player1'
            ? player1Color
            : cell.owner === 'player2'
              ? player2Color
              : boardBackground

        return (
          <Polygon
            key={cell.id}
            points={createHexPoints(x, y)}
            fill={fillColor}
            stroke={boardLine}
            strokeWidth={2}
            onPress={() => onCellPress(cell.id)}
          />
        )
      })}

      {sideLines.map((line) => (
        <Line
          key={line.id}
          x1={line.from.x}
          y1={line.from.y}
          x2={line.to.x}
          y2={line.to.y}
          stroke={line.color}
          strokeWidth={line.isCurrent ? 7 : 4}
          opacity={line.isCurrent ? 0.95 : 0.45}
          strokeLinecap='round'
        />
      ))}
    </Svg>
  )
}

export default HexBoardSvg