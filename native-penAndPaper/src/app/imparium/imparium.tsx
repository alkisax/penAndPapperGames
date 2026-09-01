// native-penAndPaper/src/app/imparium/imparium.tsx

import {
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native'
import {
  useContext,
} from 'react'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'
import ImpariumPreviewSvg from '@/components/svg/previewSvgs/ImpariumPreviewSvg'
import ImpariumBoardSvg from '@/components/svg/imparium/ImpariumBoardSvg'
import { useImpariumMultiplayer } from '@/hooks/imparium/useImpariumMultiplayer'
import { router } from 'expo-router'

const Imparium = () => {
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

    cells,
    selectedCellId,
    gameOver,
    winner,
    score,
    turnText,

    isPlayer2Ai,
    setIsPlayer2Ai,

    handleImpariumCellPress,
    handleResetGame,
  } = useImpariumMultiplayer()

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
          <ImpariumPreviewSvg
            width={430}
            height={430}
            boardBackground={colors.boardBackground}
            boardLine={colors.boardLine}
            player1Color={colors.player1}
            player2Color={colors.player2}
          />
        </View>
        <View style={ribbonStyles.ribbon}>
          <View style={ribbonStyles.titleBlock}>
            <Text style={ribbonStyles.title}>
              Imparium
            </Text>

            <Text
              style={ribbonStyles.subtitle}
              numberOfLines={1}
            >
              {turnText}
            </Text>

            <Text style={ribbonStyles.subtitle}>
              Blue: {score.player1Score} | Red: {score.player2Score}
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

            <Pressable
              style={ribbonStyles.button}
              onPress={() => router.push('/imparium/impariumInfo')}
            >
              <Text style={ribbonStyles.buttonText}>
                i
              </Text>
            </Pressable>
          </View>
        </View>

        {gameOver && (
          <Text style={globalStyles.text}>
            Winner:{' '}
            {winner === 'draw'
              ? 'Draw'
              : winner === 'player1'
                ? 'Blue'
                : 'Red'}
          </Text>
        )}

        <View style={globalStyles.boardCard}>
          <ImpariumBoardSvg
            cells={cells}
            selectedCellId={selectedCellId}
            boardBackground={colors.boardBackground}
            boardLine={colors.boardLine}
            coveredColor={colors.deadPiece}
            player1Color={colors.player1}
            player2Color={colors.player3}
            onCellPress={handleImpariumCellPress}
          />
        </View>
      </View>
    </View>
  )
}

export default Imparium
