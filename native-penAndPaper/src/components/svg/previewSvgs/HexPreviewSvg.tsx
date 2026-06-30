import Svg, {
  Line,
  Polygon,
  Rect,
} from 'react-native-svg'

type HexOwner = 'player1' | 'player2' | null

type HexCell = {
  id: number
  row: number
  col: number
  owner: HexOwner
}

type Props = {
  width?: number
  height?: number
  boardBackground: string
  boardLine: string
  player1Color: string
  player2Color: string
  opacity?: number
}

const BOARD_SIZE = 5

const HEX_RADIUS = 10
const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS
const HEX_HEIGHT = HEX_RADIUS * 2

const HORIZONTAL_SPACING = HEX_WIDTH
const VERTICAL_SPACING = HEX_RADIUS * 1.5

const PADDING = 18

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

const HexPreviewSvg = ({
  width = 130,
  height = 110,
  boardBackground,
  boardLine,
  player1Color,
  player2Color,
  opacity = 1,
}: Props) => {
  const cells: HexCell[] = Array.from(
    { length: BOARD_SIZE * BOARD_SIZE },
    (_, index) => {
      const row = Math.floor(index / BOARD_SIZE)
      const col = index % BOARD_SIZE
      const id = index + 1

      let owner: HexOwner = null

      if (
        id === 3 ||
        id === 8 ||
        id === 13 ||
        id === 18
      ) {
        owner = 'player2'
      }

      if (
        id === 11 ||
        id === 12 ||
        id === 17 ||
        id === 22
      ) {
        owner = 'player1'
      }

      return {
        id,
        row,
        col,
        owner,
      }
    },
  )

  const svgWidth =
    PADDING * 2 +
    HEX_WIDTH * (BOARD_SIZE + (BOARD_SIZE - 1) / 2)

  const svgHeight =
    PADDING * 2 +
    HEX_HEIGHT +
    VERTICAL_SPACING * (BOARD_SIZE - 1)

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

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      opacity={opacity}
    >
      <Rect
        x={0}
        y={0}
        width={svgWidth}
        height={svgHeight}
        fill='transparent'
      />

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
            strokeWidth={1.5}
          />
        )
      })}

      {/* Player 2 top/bottom sides */}
      <Line
        x1={PADDING + 4}
        y1={PADDING / 2}
        x2={svgWidth - PADDING - 4}
        y2={PADDING / 2}
        stroke={player2Color}
        strokeWidth={5}
        strokeLinecap='round'
        opacity={0.75}
      />

      <Line
        x1={PADDING + 18}
        y1={svgHeight - PADDING / 2}
        x2={svgWidth - PADDING + 8}
        y2={svgHeight - PADDING / 2}
        stroke={player2Color}
        strokeWidth={5}
        strokeLinecap='round'
        opacity={0.75}
      />

      {/* Player 1 left/right sides */}
      <Line
        x1={PADDING / 2}
        y1={PADDING + 8}
        x2={PADDING / 2}
        y2={svgHeight - PADDING - 8}
        stroke={player1Color}
        strokeWidth={5}
        strokeLinecap='round'
        opacity={0.75}
      />

      <Line
        x1={svgWidth - PADDING / 2}
        y1={PADDING + 8}
        x2={svgWidth - PADDING / 2}
        y2={svgHeight - PADDING - 8}
        stroke={player1Color}
        strokeWidth={5}
        strokeLinecap='round'
        opacity={0.75}
      />
    </Svg>
  )
}

export default HexPreviewSvg