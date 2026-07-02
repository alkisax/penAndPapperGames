// native-penAndPaper\src\app\nab\nab.tsx
import { Pressable, Switch, Text, View } from 'react-native'
import { useContext } from 'react'

import Navbar from '@/layout/Navbar'
import NabBoardSvg from '@/components/svg/nab/NabBoardSvg'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'
import { useNabMultiplayer } from '@/hooks/nab/useNabMultiplayer'
import { router } from 'expo-router'

const Nab = () => {
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
    savedLines,
    usedCellIds,

    currentPlayer,
    winner,
    resetVersion,
    turnText,

    isPlayer2Ai,
    setIsPlayer2Ai,

    handleNabMoveAttempt,
    handleResetGame,
  } = useNabMultiplayer()

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

      <View style={globalStyles.centerContent}>
        <View style={ribbonStyles.ribbon}>
          <View style={ribbonStyles.titleBlock}>
            <Text style={ribbonStyles.title}>
              Nab
            </Text>

            <Text style={ribbonStyles.subtitle}>
              {turnText}
            </Text>
          </View>

          <View style={ribbonStyles.actions}>
            {!isConnected && (
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={[
                    globalStyles.text,
                    { fontSize: 10 },
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
              onPress={() => router.push('/nab/nabInfo')}
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

        <NabBoardSvg
          cells={cells}
          savedLines={savedLines}
          usedCellIds={usedCellIds}
          currentPlayer={currentPlayer}
          winner={winner}
          resetVersion={resetVersion}
          onMoveAttempt={handleNabMoveAttempt}
          handleCellPress={(cellId) => {
            console.log('nab cell pressed:', cellId)
          }}
        />
      </View>
    </View>
  )
}

export default Nab