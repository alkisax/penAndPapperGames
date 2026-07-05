import Svg, {
  Circle,
  G,
  Rect,
} from 'react-native-svg'

type PreviewCellState =
  | 'empty'
  | 'covered-player1'
  | 'covered-player2'
  | 'player1'
  | 'player2'

type PreviewCell = {
  id: string
  row: number
  col: number
  state: PreviewCellState
}

type Props = {
  width?: number
  height?: number
  boardBackground: string
  boardLine: string
  player1Color: string
  player2Color: string
  coveredColor?: string
  opacity?: number
}

const BOARD_SIZE = 6
const CELL_SIZE = 44
const PADDING = 8

const SVG_SIZE =
  BOARD_SIZE * CELL_SIZE +
  PADDING * 2

const previewCells: PreviewCell[] = [
  { id: 'cell-0-0', row: 0, col: 0, state: 'covered-player1' },
  { id: 'cell-0-1', row: 0, col: 1, state: 'covered-player1' },
  { id: 'cell-0-2', row: 0, col: 2, state: 'empty' },
  { id: 'cell-0-3', row: 0, col: 3, state: 'covered-player2' },
  { id: 'cell-0-4', row: 0, col: 4, state: 'covered-player2' },
  { id: 'cell-0-5', row: 0, col: 5, state: 'empty' },

  { id: 'cell-1-0', row: 1, col: 0, state: 'empty' },
  { id: 'cell-1-1', row: 1, col: 1, state: 'covered-player2' },
  { id: 'cell-1-2', row: 1, col: 2, state: 'covered-player2' },
  { id: 'cell-1-3', row: 1, col: 3, state: 'empty' },
  { id: 'cell-1-4', row: 1, col: 4, state: 'player1' },
  { id: 'cell-1-5', row: 1, col: 5, state: 'empty' },

  { id: 'cell-2-0', row: 2, col: 0, state: 'covered-player1' },
  { id: 'cell-2-1', row: 2, col: 1, state: 'empty' },
  { id: 'cell-2-2', row: 2, col: 2, state: 'player2' },
  { id: 'cell-2-3', row: 2, col: 3, state: 'empty' },
  { id: 'cell-2-4', row: 2, col: 4, state: 'covered-player1' },
  { id: 'cell-2-5', row: 2, col: 5, state: 'covered-player1' },

  { id: 'cell-3-0', row: 3, col: 0, state: 'covered-player1' },
  { id: 'cell-3-1', row: 3, col: 1, state: 'empty' },
  { id: 'cell-3-2', row: 3, col: 2, state: 'player2' },
  { id: 'cell-3-3', row: 3, col: 3, state: 'empty' },
  { id: 'cell-3-4', row: 3, col: 4, state: 'empty' },
  { id: 'cell-3-5', row: 3, col: 5, state: 'covered-player2' },

  { id: 'cell-4-0', row: 4, col: 0, state: 'empty' },
  { id: 'cell-4-1', row: 4, col: 1, state: 'covered-player2' },
  { id: 'cell-4-2', row: 4, col: 2, state: 'covered-player2' },
  { id: 'cell-4-3', row: 4, col: 3, state: 'player1' },
  { id: 'cell-4-4', row: 4, col: 4, state: 'empty' },
  { id: 'cell-4-5', row: 4, col: 5, state: 'covered-player2' },

  { id: 'cell-5-0', row: 5, col: 0, state: 'player2' },
  { id: 'cell-5-1', row: 5, col: 1, state: 'empty' },
  { id: 'cell-5-2', row: 5, col: 2, state: 'covered-player1' },
  { id: 'cell-5-3', row: 5, col: 3, state: 'covered-player1' },
  { id: 'cell-5-4', row: 5, col: 4, state: 'empty' },
  { id: 'cell-5-5', row: 5, col: 5, state: 'player1' },
]

const getCellColor = (
  state: PreviewCellState,
  player1Color: string,
  player2Color: string,
) => {
  if (
    state === 'covered-player1' ||
    state === 'player1'
  ) {
    return player1Color
  }

  if (
    state === 'covered-player2' ||
    state === 'player2'
  ) {
    return player2Color
  }

  return 'transparent'
}

const isCoveredCell = (
  state: PreviewCellState,
) => {
  return (
    state === 'covered-player1' ||
    state === 'covered-player2'
  )
}

const isClaimedCell = (
  state: PreviewCellState,
) => {
  return (
    state === 'player1' ||
    state === 'player2'
  )
}

const ImpariumPreviewSvg = ({
  width = 130,
  height = 130,
  boardBackground,
  boardLine,
  player1Color,
  player2Color,
  opacity = 1,
}: Props) => {
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

      <G>
        {previewCells.map((cell) => {
          const x =
            PADDING + cell.col * CELL_SIZE

          const y =
            PADDING + cell.row * CELL_SIZE

          const fill = isCoveredCell(cell.state)
            ? getCellColor(
                cell.state,
                player1Color,
                player2Color,
              )
            : boardBackground

          return (
            <Rect
              key={`imparium-preview-bg-${cell.id}`}
              x={x}
              y={y}
              width={CELL_SIZE}
              height={CELL_SIZE}
              rx={7}
              fill={fill}
              stroke={boardLine}
              strokeWidth={2}
              opacity={isCoveredCell(cell.state) ? 0.32 : 1}
            />
          )
        })}
      </G>

      <G>
        {previewCells.map((cell) => {
          if (!isClaimedCell(cell.state)) return null

          const x =
            PADDING +
            cell.col * CELL_SIZE +
            CELL_SIZE / 2

          const y =
            PADDING +
            cell.row * CELL_SIZE +
            CELL_SIZE / 2

          return (
            <Circle
              key={`imparium-preview-dot-${cell.id}`}
              cx={x}
              cy={y}
              r={CELL_SIZE * 0.24}
              fill={getCellColor(
                cell.state,
                player1Color,
                player2Color,
              )}
              opacity={0.95}
            />
          )
        })}
      </G>
    </Svg>
  )
}

export default ImpariumPreviewSvg