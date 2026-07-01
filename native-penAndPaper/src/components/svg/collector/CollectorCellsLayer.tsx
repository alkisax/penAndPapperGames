import {
  Rect,
} from 'react-native-svg'

import DotSprite from '@/components/svg/SvgSprites/DotSprite'

export type CollectorCellState =
  | 'empty'
  | 'player1'
  | 'player2'
  | 'blocked-player1'
  | 'blocked-player2'

export type CollectorCell = {
  id: string
  row: number
  col: number
  state: CollectorCellState
}

type Props = {
  cells: CollectorCell[]
  cellSize: number
  padding: number
  player1Color: string
  player2Color: string
  blockedColor: string
}

const CollectorCellsLayer = ({
  cells,
  cellSize,
  padding,
  player1Color,
  player2Color,
}: Props) => {
  const getPlayerColor = (
    state: CollectorCellState,
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

  const isBlocked = (
    state: CollectorCellState,
  ) => {
    return (
      state === 'blocked-player1' ||
      state === 'blocked-player2'
    )
  }

  return (
    <>
      {cells.map((cell) => {
        if (cell.state === 'empty') return null

        const x =
          padding + cell.col * cellSize

        const y =
          padding + cell.row * cellSize

        const color = getPlayerColor(cell.state)

        if (isBlocked(cell.state)) {
          return (
            <Rect
              key={`collector-blocked-${cell.id}`}
              x={x + 3}
              y={y + 3}
              width={cellSize - 6}
              height={cellSize - 6}
              rx={8}
              fill={color}
              opacity={0.28}
            />
          )
        }

        return (
          <DotSprite
            key={`collector-dot-${cell.id}`}
            x={x + cellSize / 2}
            y={y + cellSize / 2}
            color={color}
            size={cellSize * 0.55}
            opacity={0.9}
          />
        )
      })}
    </>
  )
}

export default CollectorCellsLayer