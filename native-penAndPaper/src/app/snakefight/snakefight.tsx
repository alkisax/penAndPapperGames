import {
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native'
import { useContext } from 'react'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'
import SnakeFightPreviewSvg from '@/components/svg/previewSvgs/SnakeFightPreviewSvg'
import SnakeFightBoardSvg from '@/components/svg/snakefight/SnakeFightBoardSvg'
import { useSnakeFightMultiplayer } from '@/hooks/snakefight/useSnakeFightMultiplayer'
import {
  getSnakeFightWinnerText,
} from '@/utils/snakefight/snakeFightUtils'
import { router } from 'expo-router'

const SnakeFight = () => {
  const { colors } = useContext(ThemeContext)

  const globalStyles = createGlobalStyles(colors)
  const ribbonStyles = createRibbonStyles(colors)

  const {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,

    dots,
    segments,

    currentPlayer,
    player1HeadDotId,
    player2HeadDotId,

    score,
    gameOver,
    winner,
    turnText,

    isPlayer2Ai,
    setIsPlayer2Ai,

    handleMoveAttempt,
    resetGame,
  } = useSnakeFightMultiplayer()

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

      <View style={globalStyles.gameContent}>
        <View
          pointerEvents='none'
          style={globalStyles.gameBackgroundPreview}
        >
          <SnakeFightPreviewSvg
            width={430}
            height={430}
            boardBackground={colors.boardBackground}
            boardLine={colors.boardLine}
            player1Color={colors.player1}
            player2Color={colors.player3}
            dotColor={colors.text}
          />
        </View>
        <View style={ribbonStyles.ribbon}>
          <View style={ribbonStyles.titleBlock}>
            <Text style={ribbonStyles.title}>
              Snake Fight
            </Text>

            <Text
              style={ribbonStyles.subtitle}
              numberOfLines={1}
            >
              {turnText}
            </Text>

            <Text style={ribbonStyles.subtitle}>
              Blue crossed Red: {score.player1} | Red crossed Blue: {score.player2}
            </Text>
          </View>

          <View style={ribbonStyles.actions}>
            {!isConnected && (
              <View style={{ alignItems: 'center' }}>
                <Text style={ribbonStyles.smallLabel}>
                  P2 AI
                </Text>

                <Switch
                  value={isPlayer2Ai}
                  onValueChange={setIsPlayer2Ai}
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
              style={[
                ribbonStyles.button,
                ribbonStyles.buttonActive,
              ]}
              onPress={() => resetGame('manual')}
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

            <Pressable
              style={ribbonStyles.button}
              onPress={() => router.push('/snakefight/snakeFightInfo')}
            >
              <Text style={ribbonStyles.buttonText}>
                i
              </Text>
            </Pressable>
          </View>
        </View>

        {gameOver && (
          <Text style={globalStyles.text}>
            {getSnakeFightWinnerText(winner)}
          </Text>
        )}

        <View style={globalStyles.boardCard}>
          <SnakeFightBoardSvg
            dots={dots}
            segments={segments}
            currentPlayer={currentPlayer}
            player1HeadDotId={player1HeadDotId}
            player2HeadDotId={player2HeadDotId}
            gameOver={gameOver}
            boardBackground={colors.boardBackground}
            boardLine={colors.boardLine}
            dotColor={colors.text}
            player1Color={colors.player1}
            player2Color={colors.player3}
            onMoveAttempt={handleMoveAttempt}
          />
        </View>
      </View>
    </View>
  )
}

export default SnakeFight
