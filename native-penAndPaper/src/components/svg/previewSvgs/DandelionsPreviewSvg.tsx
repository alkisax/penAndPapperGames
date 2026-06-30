import Svg, {
  Circle,
  G,
  Line,
  Rect,
} from 'react-native-svg'

import DandelionSprite from '@/components/svg/SvgSprites/DandelionSprite'
import SeedDandelionSprite from '@/components/svg/SvgSprites/SeedDandelionSprite'

type Props = {
  width?: number
  height?: number
  boardBackground: string
  boardLine: string
  dandelionColor: string
  seedColor: string
  opacity?: number
}

const BOARD_SIZE = 6

const DandelionsPreviewSvg = ({
  width = 120,
  height = 120,
  boardBackground,
  boardLine,
  dandelionColor,
  seedColor,
  opacity = 1,
}: Props) => {
  const cellSize = width / BOARD_SIZE
  const svgSize = width

  const cells = [
    {
      id: 1,
      row: 0,
      col: 1,
      hasDandelion: false,
      hasSeed: true,
    },
    {
      id: 2,
      row: 1,
      col: 4,
      hasDandelion: true,
      hasSeed: false,
    },
    {
      id: 3,
      row: 2,
      col: 2,
      hasDandelion: false,
      hasSeed: true,
    },
    {
      id: 4,
      row: 3,
      col: 0,
      hasDandelion: true,
      hasSeed: true,
    },
    {
      id: 5,
      row: 4,
      col: 3,
      hasDandelion: false,
      hasSeed: true,
    },
    {
      id: 6,
      row: 5,
      col: 5,
      hasDandelion: true,
      hasSeed: false,
    },
  ]

  const getCellCenter = (
    row: number,
    col: number,
  ) => {
    return {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
    }
  }

  const getSeedRotation = (id: number) => {
    return (id * 47) % 360
  }

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      opacity={opacity}
    >
      <Rect
        x={0}
        y={0}
        width={svgSize}
        height={svgSize}
        fill={boardBackground}
      />

      {Array.from({ length: BOARD_SIZE + 1 }, (_, index) => (
        <G key={`preview-grid-${index}`}>
          <Line
            x1={index * cellSize}
            y1={0}
            x2={index * cellSize}
            y2={svgSize}
            stroke={boardLine}
            strokeWidth={0.8}
          />

          <Line
            x1={0}
            y1={index * cellSize}
            x2={svgSize}
            y2={index * cellSize}
            stroke={boardLine}
            strokeWidth={0.8}
          />
        </G>
      ))}

      {cells
        .filter((cell) => cell.hasSeed && !cell.hasDandelion)
        .map((cell) => {
          const { x, y } = getCellCenter(
            cell.row,
            cell.col,
          )

          return (
            <SeedDandelionSprite
              key={`preview-seed-${cell.id}`}
              x={x}
              y={y}
              color={seedColor}
              size={6}
              opacity={0.85}
              rotation={getSeedRotation(cell.id)}
            />
          )
        })}

      {cells
        .filter((cell) => cell.hasSeed && cell.hasDandelion)
        .map((cell) => {
          const { x, y } = getCellCenter(
            cell.row,
            cell.col,
          )

          return (
            <Circle
              key={`preview-seed-under-${cell.id}`}
              cx={x}
              cy={y + 5}
              r={2.5}
              fill={seedColor}
              opacity={0.8}
            />
          )
        })}

      {cells
        .filter((cell) => cell.hasDandelion)
        .map((cell) => {
          const { x, y } = getCellCenter(
            cell.row,
            cell.col,
          )

          return (
            <DandelionSprite
              key={`preview-dandelion-${cell.id}`}
              x={x}
              y={y}
              color={dandelionColor}
              size={13}
            />
          )
        })}
    </Svg>
  )
}

export default DandelionsPreviewSvg