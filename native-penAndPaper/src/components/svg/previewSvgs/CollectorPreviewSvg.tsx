import Svg, {
  Circle,
  G,
  Line,
  Rect,
} from 'react-native-svg'

type PreviewCellState =
  | 'empty'
  | 'player1'
  | 'player2'
  | 'blocked-player1'
  | 'blocked-player2'

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
  blockedColor?: string
  opacity?: number
}

const BOARD_SIZE = 6
const CELL_SIZE = 44
const PADDING = 8

const SVG_SIZE =
  BOARD_SIZE * CELL_SIZE +
  PADDING * 2

const previewCells: PreviewCell[] = [
  { id: 'cell-0-0', row: 0, col: 0, state: 'player1' },
  { id: 'cell-0-1', row: 0, col: 1, state: 'player1' },
  { id: 'cell-0-2', row: 0, col: 2, state: 'blocked-player2' },
  { id: 'cell-0-3', row: 0, col: 3, state: 'empty' },
  { id: 'cell-0-4', row: 0, col: 4, state: 'player2' },
  { id: 'cell-0-5', row: 0, col: 5, state: 'player2' },

  { id: 'cell-1-0', row: 1, col: 0, state: 'empty' },
  { id: 'cell-1-1', row: 1, col: 1, state: 'player1' },
  { id: 'cell-1-2', row: 1, col: 2, state: 'blocked-player1' },
  { id: 'cell-1-3', row: 1, col: 3, state: 'empty' },
  { id: 'cell-1-4', row: 1, col: 4, state: 'player2' },
  { id: 'cell-1-5', row: 1, col: 5, state: 'empty' },

  { id: 'cell-2-0', row: 2, col: 0, state: 'blocked-player1' },
  { id: 'cell-2-1', row: 2, col: 1, state: 'empty' },
  { id: 'cell-2-2', row: 2, col: 2, state: 'player1' },
  { id: 'cell-2-3', row: 2, col: 3, state: 'blocked-player2' },
  { id: 'cell-2-4', row: 2, col: 4, state: 'empty' },
  { id: 'cell-2-5', row: 2, col: 5, state: 'player2' },

  { id: 'cell-3-0', row: 3, col: 0, state: 'empty' },
  { id: 'cell-3-1', row: 3, col: 1, state: 'blocked-player2' },
  { id: 'cell-3-2', row: 3, col: 2, state: 'empty' },
  { id: 'cell-3-3', row: 3, col: 3, state: 'player1' },
  { id: 'cell-3-4', row: 3, col: 4, state: 'empty' },
  { id: 'cell-3-5', row: 3, col: 5, state: 'blocked-player1' },

  { id: 'cell-4-0', row: 4, col: 0, state: 'player2' },
  { id: 'cell-4-1', row: 4, col: 1, state: 'empty' },
  { id: 'cell-4-2', row: 4, col: 2, state: 'blocked-player1' },
  { id: 'cell-4-3', row: 4, col: 3, state: 'empty' },
  { id: 'cell-4-4', row: 4, col: 4, state: 'player1' },
  { id: 'cell-4-5', row: 4, col: 5, state: 'empty' },

  { id: 'cell-5-0', row: 5, col: 0, state: 'player2' },
  { id: 'cell-5-1', row: 5, col: 1, state: 'player2' },
  { id: 'cell-5-2', row: 5, col: 2, state: 'empty' },
  { id: 'cell-5-3', row: 5, col: 3, state: 'blocked-player2' },
  { id: 'cell-5-4', row: 5, col: 4, state: 'empty' },
  { id: 'cell-5-5', row: 5, col: 5, state: 'player1' },
]

const areAdjacent = (
  first: PreviewCell,
  second: PreviewCell,
) => {
  const rowDiff = Math.abs(first.row - second.row)
  const colDiff = Math.abs(first.col - second.col)

  return (
    rowDiff <= 1 &&
    colDiff <= 1 &&
    !(rowDiff === 0 && colDiff === 0)
  )
}

const isPlayerCell = (
  cell: PreviewCell,
) => {
  return (
    cell.state === 'player1' ||
    cell.state === 'player2'
  )
}

const getCellCenter = (
  cell: PreviewCell,
) => {
  return {
    x: PADDING + cell.col * CELL_SIZE + CELL_SIZE / 2,
    y: PADDING + cell.row * CELL_SIZE + CELL_SIZE / 2,
  }
}

const getCellColor = (
  state: PreviewCellState,
  player1Color: string,
  player2Color: string,
) => {
  if (
    state === 'player1' ||
    state === 'blocked-player1'
  ) {
    return player1Color
  }

  if (
    state === 'player2' ||
    state === 'blocked-player2'
  ) {
    return player2Color
  }

  return 'transparent'
}

const CollectorPreviewSvg = ({
  width = 130,
  height = 130,
  boardBackground,
  boardLine,
  player1Color,
  player2Color,
  blockedColor,
  opacity = 1,
}: Props) => {
  const connectionLines = previewCells.flatMap((cell) => {
    if (!isPlayerCell(cell)) return []

    return previewCells
      .filter((otherCell) => {
        if (!isPlayerCell(otherCell)) return false
        if (cell.id >= otherCell.id) return false
        if (cell.state !== otherCell.state) return false

        return areAdjacent(cell, otherCell)
      })
      .map((otherCell) => ({
        id: `line-${cell.id}-${otherCell.id}`,
        from: getCellCenter(cell),
        to: getCellCenter(otherCell),
        player: cell.state,
      }))
  })

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
        {previewCells.map((cell) => (
          <Rect
            key={`collector-preview-bg-${cell.id}`}
            x={PADDING + cell.col * CELL_SIZE}
            y={PADDING + cell.row * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            rx={7}
            fill={boardBackground}
            stroke={boardLine}
            strokeWidth={2}
          />
        ))}
      </G>

      <G>
        {previewCells.map((cell) => {
          const isBlocked =
            cell.state === 'blocked-player1' ||
            cell.state === 'blocked-player2'

          if (!isBlocked) return null

          return (
            <Rect
              key={`collector-preview-blocked-${cell.id}`}
              x={PADDING + cell.col * CELL_SIZE + 4}
              y={PADDING + cell.row * CELL_SIZE + 4}
              width={CELL_SIZE - 8}
              height={CELL_SIZE - 8}
              rx={8}
              fill={getCellColor(
                cell.state,
                player1Color,
                player2Color,
              )}
              opacity={blockedColor ? 0.34 : 0.3}
            />
          )
        })}
      </G>

      <G>
        {connectionLines.map((line) => (
          <Line
            key={line.id}
            x1={line.from.x}
            y1={line.from.y}
            x2={line.to.x}
            y2={line.to.y}
            stroke={
              line.player === 'player1'
                ? player1Color
                : player2Color
            }
            strokeWidth={5}
            strokeLinecap='round'
            opacity={0.65}
          />
        ))}
      </G>

      <G>
        {previewCells.map((cell) => {
          if (!isPlayerCell(cell)) return null

          const center = getCellCenter(cell)

          return (
            <Circle
              key={`collector-preview-dot-${cell.id}`}
              cx={center.x}
              cy={center.y}
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

export default CollectorPreviewSvg