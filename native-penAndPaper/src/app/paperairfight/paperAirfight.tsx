import { useContext } from 'react'
import { Button, Pressable, ScrollView, Switch, Text, View } from 'react-native'
import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { router } from 'expo-router'
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
          style={{
            width: '96%',
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 12,
            backgroundColor: colors.boardBackground,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={[
                globalStyles.text,
                {
                  fontSize: 13,
                  fontWeight: '700',
                },
              ]}
              numberOfLines={1}
            >
              Paper Airfight
            </Text>

            <Text
              style={[
                globalStyles.text,
                {
                  fontSize: 11,
                  opacity: 0.75,
                },
              ]}
              numberOfLines={1}
            >
              {gameOver && winner
                ? `Winner: ${winner.toUpperCase()}`
                : turnText}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {!isConnected && (
              <View
                style={{
                  alignItems: 'center',
                }}
              >
                <Text
                  style={[
                    globalStyles.text,
                    {
                      fontSize: 10,
                    },
                  ]}
                >
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
              onPress={() =>
                router.push('/paperairfight/paperAirfightInfo')
              }
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.background,
              }}
            >
              <Text
                style={[
                  globalStyles.text,
                  {
                    fontSize: 16,
                    fontWeight: '700',
                  },
                ]}
              >
                ?
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleResetGame('manual')}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.background,
              }}
            >
              <Text
                style={[
                  globalStyles.text,
                  {
                    fontSize: 18,
                    fontWeight: '700',
                  },
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