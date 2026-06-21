// src/components/svg/blackHoleBoard.tsx

import Svg, { Circle } from 'react-native-svg'

type Cell = {
  id: number
  row: number
  col: number
}

const createBoard = (): Cell[] => {
  const cells: Cell[] = []

  let id = 1

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col <= row; col++) {
      cells.push({
        id,
        row,
        col,
      })

      id += 1
    }
  }

  return cells
}

type props = {
  handleCellPress: (cellId: number) => void
}

const BlackHoleBoard = ({
  handleCellPress,
}: props) => {
  const cells = createBoard()

  const RADIUS = 20
  const H_SPACING = 50
  const V_SPACING = 50
  const SVG_WIDTH = 350
  const SVG_HEIGHT = 400
  const CENTER_X = SVG_WIDTH / 2

  return (
    <Svg
      width={SVG_WIDTH}
      height={SVG_HEIGHT}
    >
      {cells.map((cell) => {
        const x = CENTER_X - (cell.row * H_SPACING) / 2 + cell.col * H_SPACING
        const y = 50 + cell.row * V_SPACING

        return (
          <Circle
            key={cell.id}
            cx={x}
            cy={y}
            r={RADIUS}
            fill='white'
            stroke='black'
            strokeWidth={2}
            onPress={() => handleCellPress(cell.id)}
          />
        )
      })}
    </Svg>
  )
}

export default BlackHoleBoard