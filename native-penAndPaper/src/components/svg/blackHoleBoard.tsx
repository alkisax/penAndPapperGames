// src/components/svg/blackHoleBoard.tsx

import Svg, { Circle, Text, G, Line } from 'react-native-svg'
import type { Cell } from '@/types/blackHole.types'
import { getNeighbors } from '@/utils/blackHoleUtils/createBoard'

type props = {
  handleCellPress: (cellId: number) => void
  cells: Cell[]
}

const BlackHoleBoard = ({
  cells,
  handleCellPress,
}: props) => {

  const RADIUS = 20
  const H_SPACING = 50
  const V_SPACING = 50
  const SVG_WIDTH = 350
  const SVG_HEIGHT = 400
  const CENTER_X = SVG_WIDTH / 2

  const blackHole = cells.find(
    (cell) => cell.isBlackHole,
  )
  console.log(blackHole)

  const neighbors = blackHole
    ? getNeighbors(blackHole, cells)
    : []
  console.log(neighbors)

  // helper για render στο τέλος
  const getCoordinates = (cell: Cell) => {
    return {
      x:
        CENTER_X -
        (cell.row * H_SPACING) / 2 +
        cell.col * H_SPACING,
      y: 50 + cell.row * V_SPACING,
    }
  }

  return (
    <Svg
      width={SVG_WIDTH}
      height={SVG_HEIGHT}
    >
      {blackHole &&
        neighbors.map((neighbor) => {
          const blackHolePos =
            getCoordinates(blackHole)

          const neighborPos =
            getCoordinates(neighbor)

          return (
            <Line
              key={`line-${neighbor.id}`}
              x1={blackHolePos.x}
              y1={blackHolePos.y}
              x2={neighborPos.x}
              y2={neighborPos.y}
              stroke={neighbor.color}
              strokeWidth={4}
            />
          )
        })}
        
      {cells.map((cell) => {
        const x = CENTER_X - (cell.row * H_SPACING) / 2 + cell.col * H_SPACING
        const y = 50 + cell.row * V_SPACING

        return (

          <>
            <G key={cell.id}>
              <Circle
                cx={x}
                cy={y}
                r={RADIUS}
                fill={cell.color}
                stroke='black'
                strokeWidth={2}
                onPress={() => handleCellPress(cell.id)}
              />
              <Text
                x={x}
                y={y + 5}
                textAnchor='middle'
                fontSize='14'
              >
                {cell.value}
              </Text>
            </G>
          </>
        )
      })}
    </Svg>
  )
}

export default BlackHoleBoard