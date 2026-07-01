import Svg, { Rect, } from 'react-native-svg'

import CollectorCellsLayer from '@/components/svg/collector/CollectorCellsLayer'
import type { CollectorCell, } from '@/components/svg/collector/CollectorCellsLayer'
import CollectorConnectionLinesLayer from '@/components/svg/collector/CollectorConnectionLinesLayer'
import type { CollectorConnectionLine, } from '@/hooks/collector/useCollector'

type Props = {
  cells: CollectorCell[]
  boardBackground: string
  boardLine: string
  player1Color: string
  player2Color: string
  blockedColor: string
  onCellPress?: (row: number, col: number, cellId: string) => void
  connectionLines: CollectorConnectionLine[]
}

const BOARD_SIZE = 6
const CELL_SIZE = 44
const PADDING = 8

const SVG_SIZE =
  BOARD_SIZE * CELL_SIZE +
  PADDING * 2

const CollectorBoardSvg = ({
  cells,
  boardBackground,
  boardLine,
  player1Color,
  player2Color,
  blockedColor,
  onCellPress,
  connectionLines,
}: Props) => {
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
        fill='transparent'
      />

      {cells.map((cell) => (
        <Rect
          key={`collector-bg-${cell.id}`}
          x={PADDING + cell.col * CELL_SIZE}
          y={PADDING + cell.row * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill={boardBackground}
          stroke={boardLine}
          strokeWidth={2}
        />
      ))}

      <CollectorCellsLayer
        cells={cells}
        cellSize={CELL_SIZE}
        padding={PADDING}
        player1Color={player1Color}
        player2Color={player2Color}
        blockedColor={blockedColor}
      />

      <CollectorConnectionLinesLayer
        cells={cells}
        connectionLines={connectionLines}
        cellSize={CELL_SIZE}
        padding={PADDING}
        player1Color={player1Color}
        player2Color={player2Color}
      />

      {cells.map((cell) => (
        <Rect
          key={`collector-touch-${cell.id}`}
          x={PADDING + cell.col * CELL_SIZE}
          y={PADDING + cell.row * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          fill='transparent'
          onPress={() =>
            onCellPress?.(
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

export default CollectorBoardSvg