import {
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native'
import {
  useContext,
} from 'react'
import { router } from 'expo-router'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'
import CollectorBoardSvg from '@/components/svg/collector/CollectorBoardSvg'
import { useCollectorMultiplayer } from '@/hooks/collector/useCollectorMultiplayer'

const Collector = () => {
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
    gameOver,
    winner,
    player1LargestGroup,
    player2LargestGroup,
    connectionLines,
    turnText,

    handleCollectorCellPress,
    handleResetGame,

    isPlayer2Ai,
    setIsPlayer2Ai,
  } = useCollectorMultiplayer()

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
        <View style={ribbonStyles.ribbon}>
          <View style={ribbonStyles.titleBlock}>
            <Text style={ribbonStyles.title}>
              Collector
            </Text>

            <Text style={ribbonStyles.subtitle}>
              {turnText}
            </Text>
          </View>

          <View style={ribbonStyles.actions}>
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
                  P2 AI
                </Text>

                <Switch
                  value={isPlayer2Ai}
                  onValueChange={setIsPlayer2Ai}
                />
              </View>
            )}

            <Pressable
              style={ribbonStyles.button}
              onPress={() => router.push('/collector/collectorInfo')}
            >
              <Text style={ribbonStyles.buttonText}>
                i
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

        <Text style={globalStyles.text}>
          Blue group: {player1LargestGroup} | Red group: {player2LargestGroup}
        </Text>

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
          <CollectorBoardSvg
            cells={cells}
            connectionLines={connectionLines}
            boardBackground={colors.boardBackground}
            boardLine={colors.boardLine}
            player1Color={colors.player1}
            player2Color={colors.player3}
            blockedColor={colors.deadPiece}
            onCellPress={handleCollectorCellPress}
          />
        </View>

      </View>
    </View>
  )
}

export default Collector