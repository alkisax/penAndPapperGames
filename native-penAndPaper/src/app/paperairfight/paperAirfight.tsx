// native-penAndPaper\src\app\paperairfight\paperAirfight.tsx
import { Text, View, } from 'react-native'
import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { useContext, useState } from 'react'
import { tweenPosition } from '@/utils/tweenPosition'
import { lineHitsCircle } from '@/utils/lineCircleCollision'
import PaperAirfightBoardSvg from '@/components/svg/paperairfight/paperAirfightBoardSvg'
import SlingshotComponentSvg from '@/components/svg/slingshot/SlingshotComponentSvg'

const BOARD_WIDTH = 380
const BOARD_HEIGHT = 620
const MAX_MOVE_DISTANCE = BOARD_HEIGHT / 7

const PaperAirfight = () => {
  const [power, setPower] = useState(0)
  const [angle, setAngle] = useState(0)
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<'x' | 'o'>('x')
  const [ghostPieces, setGhostPieces] = useState<typeof pieces>([])
  const [pieces, setPieces] = useState([
    { id: 'x-1', type: 'x' as const, x: 90, y: 555, color: '#2f80ed', isAlive: true, size: 12 },
    { id: 'x-2', type: 'x' as const, x: 140, y: 535, color: '#2f80ed', isAlive: true, size: 12 },
    { id: 'x-3', type: 'x' as const, x: 190, y: 520, color: '#2f80ed', isAlive: true, size: 12 },
    { id: 'x-4', type: 'x' as const, x: 240, y: 535, color: '#2f80ed', isAlive: true, size: 12 },
    { id: 'x-5', type: 'x' as const, x: 290, y: 555, color: '#2f80ed', isAlive: true, size: 12 },

    { id: 'x-6', type: 'x' as const, x: 115, y: 585, color: '#2f80ed', isAlive: true, size: 12 },
    { id: 'x-7', type: 'x' as const, x: 165, y: 575, color: '#2f80ed', isAlive: true, size: 12 },
    { id: 'x-8', type: 'x' as const, x: 215, y: 575, color: '#2f80ed', isAlive: true, size: 12 },
    { id: 'x-9', type: 'x' as const, x: 265, y: 585, color: '#2f80ed', isAlive: true, size: 12 },
    { id: 'x-10', type: 'x' as const, x: 190, y: 600, color: '#2f80ed', isAlive: true, size: 12 },

    { id: 'o-1', type: 'o' as const, x: 90, y: 65, color: '#d63031', isAlive: true, size: 12 },
    { id: 'o-2', type: 'o' as const, x: 140, y: 85, color: '#d63031', isAlive: true, size: 12 },
    { id: 'o-3', type: 'o' as const, x: 190, y: 100, color: '#d63031', isAlive: true, size: 12 },
    { id: 'o-4', type: 'o' as const, x: 240, y: 85, color: '#d63031', isAlive: true, size: 12 },
    { id: 'o-5', type: 'o' as const, x: 290, y: 65, color: '#d63031', isAlive: true, size: 12 },

    { id: 'o-6', type: 'o' as const, x: 115, y: 35, color: '#d63031', isAlive: true, size: 12 },
    { id: 'o-7', type: 'o' as const, x: 165, y: 45, color: '#d63031', isAlive: true, size: 12 },
    { id: 'o-8', type: 'o' as const, x: 215, y: 45, color: '#d63031', isAlive: true, size: 12 },
    { id: 'o-9', type: 'o' as const, x: 265, y: 35, color: '#d63031', isAlive: true, size: 12 },
    { id: 'o-10', type: 'o' as const, x: 190, y: 20, color: '#d63031', isAlive: true, size: 12 },
  ])
  const [trailLines, setTrailLines] = useState<{
    id: string
    x1: number
    y1: number
    x2: number
    y2: number
    color: string
  }[]>([])

  const clamp = (
    value: number,
    min: number,
    max: number,
  ) => {
    return Math.max(min, Math.min(value, max))
  }

  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)


  const selectedPiece = pieces.find((piece) =>
    piece.id === selectedPieceId &&
    piece.isAlive &&
    piece.type === currentPlayer
  )

  const handleSelectPiece = (pieceId: string) => {
    const piece = pieces.find((piece) => piece.id === pieceId)

    if (!piece) return
    if (!piece.isAlive) return
    if (piece.type !== currentPlayer) return

    setSelectedPieceId(pieceId)
  }

  const handleShot = (result: {
    power: number
    angle: number
  }) => {
    setPower(result.power)
    setAngle(result.angle)

    const distance =
      (result.power / 100) * MAX_MOVE_DISTANCE

    const radians =
      result.angle * Math.PI / 180

    const SPRITE_PADDING = 18

    if (!selectedPiece) return
    const piece = selectedPiece

    setGhostPieces((prev) => [
      ...prev,
      {
        ...piece,
        id: `ghost-${Date.now()}`,
        color: '#999999',
      },
    ])

    const nextX = piece.x + Math.cos(radians) * distance
    const nextY = piece.y + Math.sin(radians) * distance

    const clampedX = clamp(nextX, SPRITE_PADDING, BOARD_WIDTH - SPRITE_PADDING,)
    const clampedY = clamp(nextY, SPRITE_PADDING, BOARD_HEIGHT - SPRITE_PADDING,)

    const hitPieceIds = pieces
      .filter((targetPiece) => targetPiece.isAlive)
      .filter((targetPiece) => targetPiece.id !== piece.id)
      .filter((targetPiece) => targetPiece.type !== piece.type)
      .filter((targetPiece) =>
        lineHitsCircle(
          { x: piece.x, y: piece.y },
          { x: clampedX, y: clampedY },
          { x: targetPiece.x, y: targetPiece.y },
          targetPiece.size ?? 12,
        ),
      )
      .map((targetPiece) => targetPiece.id)

    tweenPosition({
      from: {
        x: piece.x,
        y: piece.y,
      },
      to: {
        x: clampedX,
        y: clampedY,
      },
      onUpdate: (position) => {
        if (piece.id !== selectedPieceId) return piece
        let previousPosition = {
          x: piece.x,
          y: piece.y,
        }

        setPieces((prev) =>
          prev.map((piece) => {
            if (piece.id !== selectedPieceId) return piece
            return {
              ...piece,
              x: position.x,
              y: position.y,
            }
          }),
        )

        setTrailLines((prev) => [
          ...prev,
          {
            id: `trail-${Date.now()}-${prev.length}`,
            x1: previousPosition.x,
            y1: previousPosition.y,
            x2: position.x,
            y2: position.y,
            color: piece.color,
          },
        ])
      },

      onComplete: () => {
        setPieces((prev) =>
          prev.map((piece) => {
            if (!hitPieceIds.includes(piece.id)) return piece

            return {
              ...piece,
              isAlive: false,
              color: '#b59b00',
            }
          }),
        )

        setSelectedPieceId(null)
        setCurrentPlayer((prev) => prev === 'x' ? 'o' : 'x')
      },
    })
    setSelectedPieceId(null)
  }

  return (
    <View style={globalStyles.screen}>
      <Navbar
        roomId=''
        setRoomId={() => { }}
        username=''
        setUsername={() => { }}
        handleConnectSocket={async () => { }}
        handleDisconnectSocket={async () => { }}
        isConnected={false}
        hasPeer={false}
      />

      <View style={globalStyles.centerContent}>
        <Text style={globalStyles.title}>
          Paper Airfight
        </Text>

        <Text style={globalStyles.text}>
          Turn: {currentPlayer.toUpperCase()}
        </Text>

        <View
          style={{
            width: 380,
            height: 620,
          }}
        >
          <PaperAirfightBoardSvg
            boardBackground={colors.boardBackground}
            boardLine={colors.boardLine}
            baseColor='#2f80ed'
            goalColor='#d63031'
            pieces={[
              ...ghostPieces,
              ...pieces,
            ]}
            trailLines={trailLines}
            selectedPieceId={selectedPieceId}
            onSelectPiece={handleSelectPiece}
          />

          {selectedPiece && (
            <SlingshotComponentSvg
              originX={selectedPiece.x}
              originY={selectedPiece.y}
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              circleColor={selectedPiece.color}
              lineColor={selectedPiece.color}
              onRelease={handleShot}
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default PaperAirfight