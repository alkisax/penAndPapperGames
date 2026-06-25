import { useContext } from 'react'
import { Button, Text, View } from 'react-native'
import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import PaperAirfightBoardSvg from '@/components/svg/paperairfight/paperAirfightBoardSvg'
import SlingshotComponentSvg from '@/components/svg/slingshot/SlingshotComponentSvg'
import { usePaperAirfightMultiplayer } from '@/hooks/paperAirfight/usePaperAirfightMultiplayer'

const PaperAirfight = () => {
  // Theme
  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)

  // Game + multiplayer logic
  const {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,
    boardWidth,
    boardHeight,
    turnText,
    selectedPieceId,
    selectedPiece,
    pieces,
    ghostPieces,
    trailLines,
    handlePaperAirfightSelectPiece,
    handlePaperAirfightShot,
    isOAi,
    setIsOAi,
    winner,
    gameOver,
    handleResetGame,
  } = usePaperAirfightMultiplayer({
    colors,
  })

  return (
    <View style={globalStyles.screen}>
      {/* Multiplayer navbar */}
      <Navbar
        roomId={roomCode}
        setRoomId={setRoomCode}
        username={username}
        setUsername={setUsername}
        handleConnectSocket={connectToChatRoom}
        handleDisconnectSocket={disconnectFromChatRoom}
        isConnected={isConnected}
        hasPeer={hasPeer}
      />

      <View style={globalStyles.centerContent}>
        {/* Header */}
        <Text style={globalStyles.title}>
          Paper Airfight
        </Text>

        <Text style={globalStyles.text}>
          {turnText}
        </Text>

        {gameOver && winner && (
          <Text style={globalStyles.text}>
            Winner: {winner.toUpperCase()}
          </Text>
        )}

        <Button
          title='Restart Game'
          onPress={() => handleResetGame('manual')}
        />

        {!isConnected && (
          <Button
            title={isOAi ? 'Disable O AI' : 'Enable O AI'}
            onPress={() => setIsOAi((prev) => !prev)}
          />
        )}

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
            onSelectPiece={handlePaperAirfightSelectPiece}
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
              onRelease={handlePaperAirfightShot}
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default PaperAirfight