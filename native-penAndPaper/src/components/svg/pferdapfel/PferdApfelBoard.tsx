// native-penAndPaper/src/components/svg/pferdappel/PferdAppelBoard.tsx

import Svg, {
  G,
  Line,
  Path,
  Rect,
} from 'react-native-svg'

type Knight = {
  id: string
  row: number
  col: number
  color: string
}

type BlockedCell = {
  id: string
  row: number
  col: number
  color: string
}

type Props = {
  knights: Knight[]
  blockedCells: BlockedCell[]
  handleCellPress: (row: number, col: number, id: number) => void
}

const BOARD_SIZE = 8
const CELL_SIZE = 44
const SVG_SIZE = BOARD_SIZE * CELL_SIZE

const KNIGHT_PATH =
  'M60.81 476.91h300v-60h-300v60zm233.79-347.3l13.94 7.39c31.88-43.62 61.34-31.85 61.34-31.85l-21.62 53 35.64 19 2.87 33 64.42 108.75-43.55 29.37s-26.82-36.39-39.65-43.66c-10.66-6-41.22-10.25-56.17-12l-67.54-76.91-12 10.56 37.15 42.31c-.13.18-.25.37-.38.57-35.78 58.17 23 105.69 68.49 131.78H84.14C93 85 294.6 129.61 294.6 129.61z'

const PferdAppelBoard = ({
  knights,
  blockedCells,
  handleCellPress,
}: Props) => {
  const cells = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
    const row = Math.floor(index / BOARD_SIZE)
    const col = index % BOARD_SIZE

    return {
      id: index + 1,
      row,
      col,
    }
  })

  const getCellCenter = (row: number, col: number) => {
    return {
      x: col * CELL_SIZE + CELL_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2,
    }
  }

  return (
    <Svg
      width={SVG_SIZE}
      height={SVG_SIZE}
    >
      {cells.map((cell) => (
        <Rect
          key={cell.id}
          x={cell.col * CELL_SIZE}
          y={cell.row * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill='transparent'
          onPress={() => handleCellPress(cell.row, cell.col, cell.id)}
        />
      ))}

      {Array.from({ length: BOARD_SIZE + 1 }, (_, index) => (
        <G key={`grid-${index}`}>
          <Line
            x1={index * CELL_SIZE}
            y1={0}
            x2={index * CELL_SIZE}
            y2={SVG_SIZE}
            stroke='black'
            strokeWidth={1}
          />

          <Line
            x1={0}
            y1={index * CELL_SIZE}
            x2={SVG_SIZE}
            y2={index * CELL_SIZE}
            stroke='black'
            strokeWidth={1}
          />
        </G>
      ))}

      {blockedCells.map((cell) => {
        const { x, y } = getCellCenter(cell.row, cell.col)
        const size = 24

        return (
          <G key={cell.id}>
            <Line
              x1={x - size / 2}
              y1={y - size / 2}
              x2={x + size / 2}
              y2={y + size / 2}
              stroke={cell.color}
              strokeWidth={4}
              strokeLinecap='round'
            />

            <Line
              x1={x + size / 2}
              y1={y - size / 2}
              x2={x - size / 2}
              y2={y + size / 2}
              stroke={cell.color}
              strokeWidth={4}
              strokeLinecap='round'
            />
          </G>
        )
      })}

      {knights.map((knight) => {
        const { x, y } = getCellCenter(knight.row, knight.col)

        return (
          <G
            key={knight.id}
            x={x - 16}
            y={y - 16}
            scale={0.0625}
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

export default PferdAppelBoard