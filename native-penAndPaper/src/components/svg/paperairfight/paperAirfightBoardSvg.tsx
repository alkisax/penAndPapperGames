// native-penAndPaper/src/components/svg/paperairfight/paperAirfightBoardSvg.tsx

import Svg, {
  Line,
  Path,
  Rect,
} from 'react-native-svg'
import XSprite from '@/components/svg/SvgSprites/XSprite'
import OSprite from '@/components/svg/SvgSprites/OSprite'

type AirfightPiece = {
  id: string
  type: 'x' | 'o'
  x: number
  y: number
  size?: number
  color: string
  isAlive: boolean
}

type TrailLine = {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
}

type Props = {
  boardBackground: string
  boardLine: string
  baseColor: string
  goalColor: string
  pieces: AirfightPiece[]
  trailLines: TrailLine[]
  selectedPieceId: string | null
  onSelectPiece: (pieceId: string) => void
}

const SVG_WIDTH = 380
const SVG_HEIGHT = 620

const LARGE_WIDTH = SVG_WIDTH * 0.8
const SMALL_WIDTH = SVG_WIDTH * 0.2

const LARGE_HEIGHT = 280
const SMALL_HEIGHT = 42

const PaperAirfightBoardSvg = ({
  boardBackground,
  boardLine,
  baseColor,
  goalColor,
  pieces,
  trailLines,
  selectedPieceId,
  onSelectPiece,
}: Props) => {
  const getCenteredStartX = (width: number) => {
    return (SVG_WIDTH - width) / 2
  }

  const createTopHillPath = (
    width: number,
    height: number,
  ) => {
    const startX = getCenteredStartX(width)
    const endX = startX + width

    return `
      M ${startX} 0
      Q ${SVG_WIDTH / 2} ${height}
        ${endX} 0
    `
  }

  const createBottomHillPath = (
    width: number,
    height: number,
  ) => {
    const startX = getCenteredStartX(width)
    const endX = startX + width

    return `
      M ${startX} ${SVG_HEIGHT}
      Q ${SVG_WIDTH / 2} ${SVG_HEIGHT - height}
        ${endX} ${SVG_HEIGHT}
    `
  }

  const topLargePath = createTopHillPath(
    LARGE_WIDTH,
    LARGE_HEIGHT,
  )

  const topSmallPath = createTopHillPath(
    SMALL_WIDTH,
    SMALL_HEIGHT,
  )

  const bottomLargePath = createBottomHillPath(
    LARGE_WIDTH,
    LARGE_HEIGHT,
  )

  const bottomSmallPath = createBottomHillPath(
    SMALL_WIDTH,
    SMALL_HEIGHT,
  )

  return (
    <Svg
      width={SVG_WIDTH}
      height={SVG_HEIGHT}
    >
      <Rect
        x={0}
        y={0}
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
        fill={boardBackground}
        stroke={boardLine}
        strokeWidth={2}
      />

      <Path
        d={topLargePath}
        fill='transparent'
        stroke={baseColor}
        strokeWidth={4}
      />

      <Path
        d={topSmallPath}
        fill='transparent'
        stroke={goalColor}
        strokeWidth={4}
      />

      <Path
        d={bottomLargePath}
        fill='transparent'
        stroke={baseColor}
        strokeWidth={4}
      />

      <Path
        d={bottomSmallPath}
        fill='transparent'
        stroke={goalColor}
        strokeWidth={4}
      />

      {trailLines.map((line, index) => {
        const opacity = Math.max(
          0.12,
          0.35 - index * 0.03,
        )

        return (
          <Line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color}
            strokeWidth={2}
            strokeLinecap='round'
            opacity={opacity}
          />
        )
      })}

      {pieces
        .map((piece) => {
          const pieceColor = piece.isAlive ? piece.color : '#8a7a22'
          const pieceOpacity = piece.isAlive ? 1 : 0.28

          if (piece.type === 'x') {
            return (
              <XSprite
                key={piece.id}
                x={piece.x}
                y={piece.y}
                color={pieceColor}
                size={piece.id === selectedPieceId ? 16 : piece.size}
                opacity={pieceOpacity}
                onPress={() => onSelectPiece(piece.id)}
              />
            )
          }

          return (
            <OSprite
              key={piece.id}
              x={piece.x}
              y={piece.y}
              color={pieceColor}
              size={piece.size}
              opacity={pieceOpacity}
              onPress={() => onSelectPiece(piece.id)}
            />
          )
        })}
    </Svg>
  )
}

export default PaperAirfightBoardSvg