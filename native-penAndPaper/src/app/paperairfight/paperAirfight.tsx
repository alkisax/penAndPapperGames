import { useContext } from 'react'
import { Button, Pressable, ScrollView, Switch, Text, View } from 'react-native'
import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'
import { router } from 'expo-router'
import PaperAirfightBoardSvg from '@/components/svg/paperairfight/paperAirfightBoardSvg'
import SlingshotComponentSvg from '@/components/svg/slingshot/SlingshotComponentSvg'
import { usePaperAirfightMultiplayer } from '@/hooks/paperAirfight/usePaperAirfightMultiplayer'

const PaperAirfight = () => {
  // Theme
  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)
  const ribbonStyles = createRibbonStyles(colors)

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

      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: 16,
          paddingBottom: 180,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header ribbon */}
        <View
          style={[
            ribbonStyles.ribbon,
            {
              marginBottom: 10,
            },
          ]}
        >
          <View style={ribbonStyles.titleBlock}>
            <Text
              style={ribbonStyles.title}
              numberOfLines={1}
            >
              Paper Airfight
            </Text>

            <Text
              style={ribbonStyles.subtitle}
              numberOfLines={1}
            >
              {gameOver && winner
                ? `Winner: ${winner.toUpperCase()}`
                : turnText}
            </Text>
          </View>

          <View style={ribbonStyles.actions}>
            {!isConnected && (
              <View
                style={{
                  alignItems: 'center',
                }}
              >
                <Text style={ribbonStyles.smallLabel}>
                  O AI
                </Text>

                <Switch
                  value={isOAi}
                  onValueChange={setIsOAi}
                  style={{
                    transform: [
                      { scaleX: 0.75 },
                      { scaleY: 0.75 },
                    ],
                  }}
                />
              </View>
            )}

            <Pressable
              style={ribbonStyles.button}
              onPress={() =>
                router.push('/paperairfight/paperAirfightInfo')
              }
            >
              <Text style={ribbonStyles.buttonText}>
                ?
              </Text>
            </Pressable>

            <Pressable
              style={[
                ribbonStyles.button,
                ribbonStyles.buttonActive,
              ]}
              onPress={() => handleResetGame('manual')}
            >
              <Text
                style={[
                  ribbonStyles.buttonText,
                  ribbonStyles.buttonTextActive,
                ]}
              >
                ↻
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Board */}
        <View
          style={{
            width: boardWidth,
            height: boardHeight,
            overflow: 'visible',
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
      </ScrollView>
    </View>
  )
}

export default PaperAirfight