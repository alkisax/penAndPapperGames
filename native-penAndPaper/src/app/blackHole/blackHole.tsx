// src/app/blackHole/blackHole.tsx
import { View, Button, Text, Pressable, ScrollView, } from 'react-native'
import BlackHoleBoard from '@/components/svg/blackHoleBoard'
import Navbar from '@/layout/Navbar'
import { useBlackHole } from '@/hooks/useBlackHole'
import { useState, useContext, useEffect } from 'react'
import { createBlackHoleStyles } from '@/styles/blackHole.styles'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { useRoomContext } from '@/context/RoomContext'
import type { PlayerControllers } from '@/types/blackHole.types'
import { logToServer } from '@/utils/logToServer'

type BlackHoleMovePayload = {
  cellId: number
}

const isBlackHoleMovePayload = (
  payload: unknown,
): payload is BlackHoleMovePayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return typeof data.cellId === 'number'
}

const BlackHole = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(2)
  const [playerControllers, setPlayerControllers] =
    useState<PlayerControllers>({
      player1: 'local',
      player2: 'local',
      player3: 'local',
    })

  const { colors } = useContext(ThemeContext)

  const styles = createBlackHoleStyles(colors)
  const globalStyles = createGlobalStyles(colors)

  const {
    currentPlayer,
    cells,
    handleCellPress,
    handleRemoteCellPress,
    winners,
    gameOver,
    playAgain,
    scores,
  } = useBlackHole({
    numberOfPlayers,
    playerControllers,
  })

  const {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,
    sendRoomEvent,
    incomingRoomEvent,
    setIncomingRoomEvent,
    localPlayer,
  } = useRoomContext()

  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'BLACK_HOLE_MOVE') return

    if (!isBlackHoleMovePayload(incomingRoomEvent.payload)) {
      return
    }

    handleRemoteCellPress(incomingRoomEvent.payload.cellId)

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    handleRemoteCellPress,
    setIncomingRoomEvent,
  ])

  useEffect(() => {
    if (!isConnected) return
    if (localPlayer === null) return

    // Αν είμαι waiting, δεν ελέγχω κανέναν παίκτη.
    if (localPlayer === 'waiting') {
      setPlayerControllers({
        player1: 'remote',
        player2: 'remote',
        player3: 'remote',
      })
      return
    }

    // Αυτό το tab ελέγχει μόνο τον δικό του player.
    // Όλοι οι άλλοι είναι remote.
    setPlayerControllers({
      player1: localPlayer === 1 ? 'local' : 'remote',
      player2: localPlayer === 2 ? 'local' : 'remote',
      player3: localPlayer === 3 ? 'local' : 'remote',
    })
  }, [isConnected, localPlayer])
  

  const setPlayerController = (
    player: keyof PlayerControllers,
    value: PlayerControllers[keyof PlayerControllers],
  ) => {
    // Offline αφήνουμε manual local/ai/remote testing.
    // Online οι ρόλοι βγαίνουν αυτόματα από το room join order.
    if (isConnected) return

    setPlayerControllers((prev) => ({
      ...prev,
      [player]: value,
    }))
  }

  const handleBlackHoleCellPress = async (
    cellId: number,
  ) => {
    const moveWasApplied = handleCellPress(cellId)

    if (!moveWasApplied) return
    if (!isConnected) return

    await sendRoomEvent({
      type: 'BLACK_HOLE_MOVE',
      payload: {
        cellId,
      },
    })
  }

  return (
    <View style={styles.screen}>
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>
            Game Settings
          </Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>
              Players
            </Text>

            <View style={styles.segmentedRow}>
              <Pressable
                style={[
                  globalStyles.segmentButton,
                  numberOfPlayers === 2 && globalStyles.segmentButtonActive,
                ]}
                onPress={() => setNumberOfPlayers(2)}
              >
                <Text
                  style={[
                    globalStyles.segmentButtonText,
                    numberOfPlayers === 2 && globalStyles.segmentButtonTextActive,
                  ]}
                >
                  2P
                </Text>
              </Pressable>

              <Pressable
                style={[
                  globalStyles.segmentButton,
                  numberOfPlayers === 3 && globalStyles.segmentButtonActive,
                ]}
                onPress={() => setNumberOfPlayers(3)}
              >
                <Text
                  style={[
                    globalStyles.segmentButtonText,
                    numberOfPlayers === 3 && globalStyles.segmentButtonTextActive,
                  ]}
                >
                  3P
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>
              P1
            </Text>

            <View style={styles.segmentedRow}>
              {(['local', 'ai', 'remote'] as const).map((value) => (
                <Pressable
                  key={`p1-${value}`}
                  style={[
                    globalStyles.segmentButton,
                    playerControllers.player1 === value &&
                    globalStyles.segmentButtonActive,
                  ]}
                  onPress={() => setPlayerController('player1', value)}
                >
                  <Text
                    style={[
                      globalStyles.segmentButtonText,
                      playerControllers.player1 === value &&
                      globalStyles.segmentButtonTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>
              P2
            </Text>

            <View style={styles.segmentedRow}>
              {(['local', 'ai', 'remote'] as const).map((value) => (
                <Pressable
                  key={`p2-${value}`}
                  style={[
                    globalStyles.segmentButton,
                    playerControllers.player2 === value &&
                    globalStyles.segmentButtonActive,
                  ]}
                  onPress={() => setPlayerController('player2', value)}
                >
                  <Text
                    style={[
                      globalStyles.segmentButtonText,
                      playerControllers.player2 === value &&
                      globalStyles.segmentButtonTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {numberOfPlayers === 3 && (
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>
                P3
              </Text>

              <View style={styles.segmentedRow}>
                {(['local', 'ai', 'remote'] as const).map((value) => (
                  <Pressable
                    key={`p3-${value}`}
                    style={[
                      globalStyles.segmentButton,
                      playerControllers.player3 === value &&
                      globalStyles.segmentButtonActive,
                    ]}
                    onPress={() => setPlayerController('player3', value)}
                  >
                    <Text
                      style={[
                        globalStyles.segmentButtonText,
                        playerControllers.player3 === value &&
                        globalStyles.segmentButtonTextActive,
                      ]}
                    >
                      {value}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <Text style={styles.playerText}>
            Now Playing: Player {currentPlayer}
          </Text>

          {gameOver && (
            <View style={styles.endGamePanel}>
              <Text style={styles.playerText}>
                Winner{winners.length > 1 ? 's' : ''}: Player{' '}
                {winners.join(', Player ')}
              </Text>

              <Text style={styles.scoreText}>
                Player 1 Score: {scores.player1}
              </Text>

              <Text style={styles.scoreText}>
                Player 2 Score: {scores.player2}
              </Text>

              {numberOfPlayers === 3 && (
                <Text style={styles.scoreText}>
                  Player 3 Score: {scores.player3}
                </Text>
              )}

              <Button
                title='Play Again'
                onPress={playAgain}
              />
            </View>
          )}

          <View style={styles.boardContainer}>
            <BlackHoleBoard
              handleCellPress={handleBlackHoleCellPress}
              cells={cells}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}


export default BlackHole