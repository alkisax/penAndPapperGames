// native-penAndPaper/src/app/pferdapfel/pferdapfel.tsx
import {
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native'
import { useContext } from 'react'

import PferdApfelBoard from '@/components/svg/pferdapfel/PferdApfelBoard'
import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'
import { usePferdApfelMultiplayer } from '@/hooks/pferdapfel/usePferdApfelMultiplayer'
import { router } from 'expo-router'

const Pferdapfel = () => {
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

    knights,
    blockedCells,
    winner,
    gameOver,
    turnText,

    handlePferdApfelCellPress,
    handleResetGame,
    isRedAi,
    setIsRedAi,
  } = usePferdApfelMultiplayer()

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
            <Text
              style={ribbonStyles.title}
              numberOfLines={1}
            >
              Pferdäpfel
            </Text>

            <Text
              style={ribbonStyles.subtitle}
              numberOfLines={1}
            >
              {gameOver && winner
                ? `Winner: ${winner}`
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
                  Red AI
                </Text>

                <Switch
                  value={isRedAi}
                  onValueChange={setIsRedAi}
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
              onPress={() => router.push('/pferdapfel/pferdApfelInfo')}
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

        <View style={globalStyles.boardCard}>
          <PferdApfelBoard
            knights={knights}
            blockedCells={blockedCells}
            handleCellPress={handlePferdApfelCellPress}
            boardBackground={colors.boardBackground}
            boardLine={colors.boardLine}
          />
        </View>

      </View>
    </View>
  )
}

export default Pferdapfel