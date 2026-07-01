import {
  Line,
} from 'react-native-svg'

import type {
  CollectorCell,
} from '@/components/svg/collector/CollectorCellsLayer'

import type {
  CollectorConnectionLine,
} from '@/hooks/collector/useCollector'

type Props = {
  cells: CollectorCell[]
  connectionLines: CollectorConnectionLine[]
  cellSize: number
  padding: number
  player1Color: string
  player2Color: string
}

const CollectorConnectionLinesLayer = ({
  cells,
  connectionLines,
  cellSize,
  padding,
  player1Color,
  player2Color,
}: Props) => {
  const getCellCenter = (
    cell: CollectorCell,
  ) => {
    return {
      x: padding + cell.col * cellSize + cellSize / 2,
      y: padding + cell.row * cellSize + cellSize / 2,
    }
  }

  const getCellById = (
    cellId: string,
  ) => {
    return cells.find((cell) =>
      cell.id === cellId
    )
  }

  return (
    <>
      {connectionLines.map((line) => {
        const fromCell = getCellById(line.fromCellId)
        const toCell = getCellById(line.toCellId)

        if (!fromCell || !toCell) return null

        const from = getCellCenter(fromCell)
        const to = getCellCenter(toCell)

        return (
          <Line
            key={line.id}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={
              line.player === 'player1'
                ? player1Color
                : player2Color
            }
            strokeWidth={5}
            strokeLinecap='round'
            opacity={0.75}
          />
        )
      })}
    </>
  )
}

export default CollectorConnectionLinesLayer