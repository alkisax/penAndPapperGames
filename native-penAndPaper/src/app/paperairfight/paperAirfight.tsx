import { useContext } from 'react'
import { Text, View } from 'react-native'
import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import PaperAirfightBoardSvg from '@/components/svg/paperairfight/paperAirfightBoardSvg'
import SlingshotComponentSvg from '@/components/svg/slingshot/SlingshotComponentSvg'
import { usePaperAirfight } from '@/hooks/paperAirfight/usePaperAirfight'

const PaperAirfight = () => {
  // Theme
  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)

  // Game logic
  const {
    boardWidth,
    boardHeight,
    currentPlayer,
    selectedPieceId,
    selectedPiece,
    pieces,
    ghostPieces,
    trailLines,
    handleSelectPiece,
    handleShot,
  } = usePaperAirfight({ colors })

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
        {/* Header */}
        <Text style={globalStyles.title}>
          Paper Airfight
        </Text>

        <Text style={globalStyles.text}>
          Turn: {currentPlayer.toUpperCase()}
        </Text>

        {/* Board */}
        <View
          style={{
            width: boardWidth,
            height: boardHeight,
          }}
        >
          <PaperAirfightBoardSvg
            boardBackground={colors.boardBackground}
            boardLine={colors.boardLine}
            baseColor={colors.player1}
            goalColor={colors.player3}
            pieces={[
              ...ghostPieces,
              ...pieces,
            ]}
            trailLines={trailLines}
            selectedPieceId={selectedPieceId}
            onSelectPiece={handleSelectPiece}
          />

          {/* Slingshot */}
          {selectedPiece && (
            <SlingshotComponentSvg
              originX={selectedPiece.x}
              originY={selectedPiece.y}
              width={boardWidth}
              height={boardHeight}
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