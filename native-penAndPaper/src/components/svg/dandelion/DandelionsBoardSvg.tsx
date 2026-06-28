import Svg, {
  Circle,
  G,
  Line,
  Rect,
} from 'react-native-svg'

import DandelionSprite from '@/components/svg/SvgSprites/DandelionSprite'
import SeedDandelionSprite from '@/components/svg/SvgSprites/SeedDandelionSprite'

type DandelionCell = {
  id: number
  row: number
  col: number
  hasDandelion: boolean
  hasSeed: boolean
}

type Props = {
  cells: DandelionCell[]
  handleCellPress: (row: number, col: number, id: number) => void
  boardBackground: string
  boardLine: string
  dandelionColor: string
  seedColor: string
}

const BOARD_SIZE = 6
const CELL_SIZE = 52
const SVG_SIZE = BOARD_SIZE * CELL_SIZE

const DandelionsBoardSvg = ({
  cells,
  handleCellPress,
  boardBackground,
  boardLine,
  dandelionColor,
  seedColor,
}: Props) => {
  const getCellCenter = (
    row: number,
    col: number,
  ) => {
    return {
      x: col * CELL_SIZE + CELL_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2,
    }
  }

  const getSeedRotation = (id: number) => {
    return (id * 47) % 360
  }

  return (
    <Svg
      width={SVG_SIZE}
      height={SVG_SIZE}
    >
      <Rect
        x={0}
        y={0}
        width={SVG_SIZE}
        height={SVG_SIZE}
        fill={boardBackground}
      />

      {/* grid lines */}
      {Array.from({ length: BOARD_SIZE + 1 }, (_, index) => (
        <G key={`grid-${index}`}>
          <Line
            x1={index * CELL_SIZE}
            y1={0}
            x2={index * CELL_SIZE}
            y2={SVG_SIZE}
            stroke={boardLine}
            strokeWidth={1}
          />

          <Line
            x1={0}
            y1={index * CELL_SIZE}
            x2={SVG_SIZE}
            y2={index * CELL_SIZE}
            stroke={boardLine}
            strokeWidth={1}
          />
        </G>
      ))}

      {/* seeds first, so dandelions appear above them */}
      {cells
        .filter((cell) => cell.hasSeed && !cell.hasDandelion)
        .map((cell) => {
          const { x, y } = getCellCenter(
            cell.row,
            cell.col,
          )

          return (
            <SeedDandelionSprite
              key={`seed-${cell.id}`}
              x={x}
              y={y}
              color={dandelionColor}
              size={11}
              opacity={0.9}
              rotation={getSeedRotation(cell.id)}
            />
          )
        })}

      {/* fallback simple dots if SeedSprite is too detailed */}
      {cells
        .filter((cell) => cell.hasSeed && cell.hasDandelion)
        .map((cell) => {
          const { x, y } = getCellCenter(
            cell.row,
            cell.col,
          )

          return (
            <Circle
              key={`seed-under-dandelion-${cell.id}`}
              cx={x}
              cy={y + 14}
              r={4}
              fill={seedColor}
              opacity={0.8}
            />
          )
        })}

      {/* dandelions */}
      {cells
        .filter((cell) => cell.hasDandelion)
        .map((cell) => {
          const { x, y } = getCellCenter(
            cell.row,
            cell.col,
          )

          return (
            <DandelionSprite
              key={`dandelion-${cell.id}`}
              x={x}
              y={y}
              color={dandelionColor}
              size={34}
            />
          )
        })}

      {/* transparent press layer last, so every cell is tappable */}
      {cells.map((cell) => (
        <Rect
          key={`press-${cell.id}`}
          x={cell.col * CELL_SIZE}
          y={cell.row * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={boardBackground}
          opacity={0.01}
          onPress={() =>
            handleCellPress(
              cell.row,
              cell.col,
              cell.id,
            )
          }
        />
      ))}
    </Svg>
  )
}

export default DandelionsBoardSvg