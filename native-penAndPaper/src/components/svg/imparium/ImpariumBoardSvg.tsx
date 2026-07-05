// native-penAndPaper/src/components/svg/imparium/ImpariumBoardSvg.tsx

import Svg, { G, Rect } from 'react-native-svg'
import DotSprite from '@/components/svg/SvgSprites/DotSprite'

export type ImpariumCellState =
  | 'empty'
  | 'covered-player1'
  | 'covered-player2'
  | 'player1'
  | 'player2'

export type ImpariumCell = {
  id: string
  row: number
  col: number
  state: ImpariumCellState
}

type Props = {
  cells: ImpariumCell[]
  selectedCellId?: string | null
  boardBackground: string
  boardLine: string
  coveredColor: string
  player1Color: string
  player2Color: string
  onCellPress?: (
    row: number,
    col: number,
    cellId: string,
  ) => void
}

const BOARD_SIZE = 6
const CELL_SIZE = 44
const PADDING = 8

const SVG_SIZE =
  BOARD_SIZE * CELL_SIZE +
  PADDING * 2

const getCellFill = ({
  state,
  boardBackground,
  coveredColor,
  player1Color,
  player2Color,
}: {
  state: ImpariumCellState
  boardBackground: string
  coveredColor: string
  player1Color: string
  player2Color: string
}) => {
  if (state === 'covered-player1') return player1Color
  if (state === 'covered-player2') return player2Color

  return boardBackground
}

const ImpariumBoardSvg = ({
  cells,
  selectedCellId,
  boardBackground,
  boardLine,
  coveredColor,
  player1Color,
  player2Color,
  onCellPress,
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

      {cells.map((cell) => {
        const isSelected = selectedCellId === cell.id
        const x = PADDING + cell.col * CELL_SIZE
        const y = PADDING + cell.row * CELL_SIZE

        const fill = getCellFill({
          state: cell.state,
          boardBackground,
          coveredColor,
          player1Color,
          player2Color,
        })

        const opacity =
          cell.state === 'empty'
            ? 1
            : cell.state === 'covered-player1' ||
              cell.state === 'covered-player2'
              ? 0.28
              : 1

        return (
          <G key={`imparium-cell-${cell.id}`}>
            <Rect
              x={x}
              y={y}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={fill}
              stroke={isSelected ? player1Color : boardLine}
              strokeWidth={isSelected ? 4 : 2}
              opacity={opacity}
              onPress={() =>
                onCellPress?.(
                  cell.row,
                  cell.col,
                  cell.id,
                )
              }
            />

            {cell.state === 'player1' && (
              <DotSprite
                x={x + CELL_SIZE / 2}
                y={y + CELL_SIZE / 2}
                color={player1Color}
                size={CELL_SIZE * 0.5}
                opacity={0.9}
              />
            )}

            {cell.state === 'player2' && (
              <DotSprite
                x={x + CELL_SIZE / 2}
                y={y + CELL_SIZE / 2}
                color={player2Color}
                size={CELL_SIZE * 0.5}
                opacity={0.9}
              />
            )}
          </G>
        )
      })}
    </Svg>
  )
}

export default ImpariumBoardSvg