import Svg, {
  Circle,
  G,
  Line,
} from 'react-native-svg'

type Props = {
  width?: number
  height?: number
  player1Color: string
  player2Color: string
  player3Color?: string
  blackHoleColor: string
  lineColor: string
  backgroundColor?: string
  opacity?: number
}

const BlackHolePreviewSvg = ({
  width = 160,
  height = 140,
  player1Color,
  player2Color,
  player3Color,
  blackHoleColor,
  lineColor,
  backgroundColor = 'transparent',
  opacity = 1,
}: Props) => {
  const cells = [
    { id: 1, row: 0, col: 0, color: player1Color },

    { id: 2, row: 1, col: 0, color: player2Color },
    { id: 3, row: 1, col: 1, color: player1Color },

    { id: 4, row: 2, col: 0, color: player1Color },
    { id: 5, row: 2, col: 1, color: blackHoleColor },
    { id: 6, row: 2, col: 2, color: player2Color },

    { id: 7, row: 3, col: 0, color: player2Color },
    { id: 8, row: 3, col: 1, color: player1Color },
    { id: 9, row: 3, col: 2, color: player3Color ?? player2Color },
    { id: 10, row: 3, col: 3, color: player1Color },

    { id: 11, row: 4, col: 0, color: player1Color },
    { id: 12, row: 4, col: 1, color: player2Color },
    { id: 13, row: 4, col: 2, color: player1Color },
    { id: 14, row: 4, col: 3, color: player2Color },
    { id: 15, row: 4, col: 4, color: player1Color },
  ]

  const radius = 7
  const horizontalSpacing = 20
  const verticalSpacing = 22
  const centerX = width / 2

  const getCoordinates = (
    row: number,
    col: number,
  ) => {
    return {
      x:
        centerX -
        (row * horizontalSpacing) / 2 +
        col * horizontalSpacing,
      y: 24 + row * verticalSpacing,
    }
  }

  const blackHole = cells.find((cell) =>
    cell.color === blackHoleColor
  )

  const neighborIds = [
    2,
    3,
    4,
    6,
    8,
    9,
  ]

  return (
    <Svg
      width={width}
      height={height}
      opacity={opacity}
    >
      <Circle
        cx={width / 2}
        cy={height / 2}
        r={Math.max(width, height)}
        fill={backgroundColor}
      />

      {blackHole &&
        neighborIds.map((neighborId) => {
          const neighbor = cells.find((cell) =>
            cell.id === neighborId
          )

          if (!neighbor) return null

          const blackHolePos = getCoordinates(
            blackHole.row,
            blackHole.col,
          )

          const neighborPos = getCoordinates(
            neighbor.row,
            neighbor.col,
          )

          return (
            <Line
              key={`preview-line-${neighbor.id}`}
              x1={blackHolePos.x}
              y1={blackHolePos.y}
              x2={neighborPos.x}
              y2={neighborPos.y}
              stroke={neighbor.color}
              strokeWidth={2}
              opacity={0.9}
            />
          )
        })}

      <G>
        {cells.map((cell) => {
          const { x, y } = getCoordinates(
            cell.row,
            cell.col,
          )

          return (
            <Circle
              key={`preview-cell-${cell.id}`}
              cx={x}
              cy={y}
              r={radius}
              fill={cell.color}
              stroke={lineColor}
              strokeWidth={1.2}
            />
          )
        })}
      </G>
    </Svg>
  )
}

export default BlackHolePreviewSvg