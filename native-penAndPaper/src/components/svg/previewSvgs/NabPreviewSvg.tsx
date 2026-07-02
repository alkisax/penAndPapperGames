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
  opacity?: number
}

type PreviewCell = {
  id: number
  row: number
  col: number
}

type PreviewLine = {
  id: string
  fromCellId: number
  toCellId: number
  color: string
}

const ROWS = 6

const RADIUS = 8
const H_SPACING = 22
const V_SPACING = 22
const PADDING = 16

const SVG_WIDTH =
  PADDING * 2 +
  H_SPACING * (ROWS - 1)

const SVG_HEIGHT =
  PADDING * 2 +
  V_SPACING * (ROWS - 1)

const CENTER_X = SVG_WIDTH / 2

const createPreviewCells = (): PreviewCell[] => {
  const cells: PreviewCell[] = []

  let id = 1

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= row; col++) {
      cells.push({
        id,
        row,
        col,
      })

      id += 1
    }
  }

  return cells
}

const getCellCenter = (
  cell: PreviewCell,
) => {
  return {
    x:
      CENTER_X -
      (cell.row * H_SPACING) / 2 +
      cell.col * H_SPACING,
    y: PADDING + cell.row * V_SPACING,
  }
}

const getCellById = (
  cells: PreviewCell[],
  id: number,
) => {
  return cells.find((cell) => cell.id === id)
}

const NabPreviewSvg = ({
  width = 130,
  height = 130,
  boardBackground,
  boardLine,
  player1Color,
  player2Color,
  opacity = 1,
}: Props) => {
  const cells = createPreviewCells()

  const previewLines: PreviewLine[] = [
    {
      id: 'blue-1',
      fromCellId: 7,
      toCellId: 9,
      color: player1Color,
    },
    {
      id: 'red-1',
      fromCellId: 12,
      toCellId: 5,
      color: player2Color,
    },
    {
      id: 'blue-2',
      fromCellId: 16,
      toCellId: 21,
      color: player1Color,
    },
    {
      id: 'red-2',
      fromCellId: 14,
      toCellId: 14,
      color: player2Color,
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
        rx={14}
        fill='transparent'
      />

      {cells.map((cell) => {
        const { x, y } = getCellCenter(cell)

        return (
          <G key={cell.id}>
            <Circle
              cx={x}
              cy={y}
              r={RADIUS}
              fill={boardBackground}
              stroke={boardLine}
              strokeWidth={1.4}
            />
          </G>
        )
      })}

      {previewLines.map((line) => {
        const startCell = getCellById(
          cells,
          line.fromCellId,
        )

        const endCell = getCellById(
          cells,
          line.toCellId,
        )

        if (!startCell || !endCell) return null

        const startPosition = getCellCenter(startCell)
        const endPosition = getCellCenter(endCell)

        const isSingleCellLine =
          startCell.id === endCell.id

        const x1 = isSingleCellLine
          ? startPosition.x - RADIUS * 0.75
          : startPosition.x

        const x2 = isSingleCellLine
          ? startPosition.x + RADIUS * 0.75
          : endPosition.x

        return (
          <Line
            key={line.id}
            x1={x1}
            y1={startPosition.y}
            x2={x2}
            y2={endPosition.y}
            stroke={line.color}
            strokeWidth={4}
            strokeLinecap='round'
            opacity={0.9}
          />
        )
      })}
    </Svg>
  )
}

export default NabPreviewSvg