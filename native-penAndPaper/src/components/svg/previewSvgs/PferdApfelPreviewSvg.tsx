import Svg, {
  G,
  Line,
  Path,
  Rect,
} from 'react-native-svg'

type Props = {
  width?: number
  height?: number
  boardBackground: string
  boardLine: string
  player1Color: string
  player2Color: string
  blockedColor?: string
  opacity?: number
}

const BOARD_SIZE = 8

const KNIGHT_PATH =
  'M60.81 476.91h300v-60h-300v60zm233.79-347.3l13.94 7.39c31.88-43.62 61.34-31.85 61.34-31.85l-21.62 53 35.64 19 2.87 33 64.42 108.75-43.55 29.37s-26.82-36.39-39.65-43.66c-10.66-6-41.22-10.25-56.17-12l-67.54-76.91-12 10.56 37.15 42.31c-.13.18-.25.37-.38.57-35.78 58.17 23 105.69 68.49 131.78H84.14C93 85 294.6 129.61 294.6 129.61z'

const PferdApfelPreviewSvg = ({
  width = 120,
  height = 120,
  boardBackground,
  boardLine,
  player1Color,
  player2Color,
  blockedColor,
  opacity = 1,
}: Props) => {
  const cellSize = width / BOARD_SIZE
  const svgSize = width

  const blockedCells = [
    { id: 'b-1', row: 6, col: 0 },
    { id: 'b-2', row: 5, col: 2 },
    { id: 'b-3', row: 3, col: 3 },
    { id: 'b-4', row: 2, col: 5 },
  ]

  const knights = [
    {
      id: 'blue',
      row: 4,
      col: 2,
      color: player1Color,
    },
    {
      id: 'red',
      row: 1,
      col: 6,
      color: player2Color,
    },
  ]

  const getCellCenter = (
    row: number,
    col: number,
  ) => {
    return {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
    }
  }

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      opacity={opacity}
    >
      <Rect
        x={0}
        y={0}
        width={svgSize}
        height={svgSize}
        fill={boardBackground}
      />

      {Array.from({ length: BOARD_SIZE + 1 }, (_, index) => (
        <G key={`grid-${index}`}>
          <Line
            x1={index * cellSize}
            y1={0}
            x2={index * cellSize}
            y2={svgSize}
            stroke={boardLine}
            strokeWidth={0.8}
          />

          <Line
            x1={0}
            y1={index * cellSize}
            x2={svgSize}
            y2={index * cellSize}
            stroke={boardLine}
            strokeWidth={0.8}
          />
        </G>
      ))}

      {blockedCells.map((cell) => {
        const { x, y } = getCellCenter(
          cell.row,
          cell.col,
        )

        const size = cellSize * 0.55

        return (
          <G key={cell.id}>
            <Line
              x1={x - size / 2}
              y1={y - size / 2}
              x2={x + size / 2}
              y2={y + size / 2}
              stroke={blockedColor ?? boardLine}
              strokeWidth={2}
              strokeLinecap='round'
            />

            <Line
              x1={x + size / 2}
              y1={y - size / 2}
              x2={x - size / 2}
              y2={y + size / 2}
              stroke={blockedColor ?? boardLine}
              strokeWidth={2}
              strokeLinecap='round'
            />
          </G>
        )
      })}

      {knights.map((knight) => {
        const { x, y } = getCellCenter(
          knight.row,
          knight.col,
        )

        return (
          <G
            key={knight.id}
            x={x - 8}
            y={y - 8}
            scale={0.032}
          >
            <Path
              fill={knight.color}
              d={KNIGHT_PATH}
            />
          </G>
        )
      })}
    </Svg>
  )
}

export default PferdApfelPreviewSvg