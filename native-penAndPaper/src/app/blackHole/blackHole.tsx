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

type BlackHoleSettingsPayload = {
  numberOfPlayers: 2 | 3
}

type BlackHoleResetReason = 'manual' | 'player-left'

const isBlackHoleMovePayload = (
  payload: unknown,
): payload is BlackHoleMovePayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return typeof data.cellId === 'number'
}

const isBlackHoleSettingsPayload = (
  payload: unknown,
): payload is BlackHoleSettingsPayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return (
    data.numberOfPlayers === 2 ||
    data.numberOfPlayers === 3
  )
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
    roomUsersCount,
  } = useRoomContext()

  const handleAiMoveBroadcast = async (
    cellId: number,
  ) => {
    if (!isConnected) return;

    // Αυτή η κίνηση έγινε από AI στο δικό μου tab.
    // Τη στέλνουμε στα άλλα tabs για να την εφαρμόσουν ως remote move.
    await sendRoomEvent({
      type: 'BLACK_HOLE_MOVE',
      payload: {
        cellId,
      },
    });
  };

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
    onAiMove: handleAiMoveBroadcast,
  })

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

    // 4ο tab και πάνω: μόνο spectating
    if (localPlayer === 'waiting') {
      setPlayerControllers({
        player1: 'remote',
        player2: 'remote',
        player3: 'remote',
      })
      return
    }

    // Special case:
    // 3-player game, αλλά υπάρχουν μόνο 2 ανθρώπινα tabs.
    // Το Tab 1 αναλαμβάνει να τρέχει τον Player 3 ως AI.
    if (
      numberOfPlayers === 3 &&
      roomUsersCount === 2
    ) {
      setPlayerControllers({
        player1: localPlayer === 1 ? 'local' : 'remote',
        player2: localPlayer === 2 ? 'local' : 'remote',
        player3: localPlayer === 1 ? 'ai' : 'remote',
      })
      return
    }

    // Default online mode:
    // κάθε tab ελέγχει μόνο τον δικό του player
    setPlayerControllers({
      player1: localPlayer === 1 ? 'local' : 'remote',
      player2: localPlayer === 2 ? 'local' : 'remote',
      player3: localPlayer === 3 ? 'local' : 'remote',
    })
  }, [
    isConnected,
    localPlayer,
    numberOfPlayers,
    roomUsersCount,
  ])

  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'BLACK_HOLE_SETTINGS') return

    if (!isBlackHoleSettingsPayload(incomingRoomEvent.payload)) {
      return
    }

    // Ήρθε αλλαγή settings από άλλο tab.
    // Δεν κάνουμε broadcast ξανά, απλώς εφαρμόζουμε.
    setNumberOfPlayers(incomingRoomEvent.payload.numberOfPlayers)

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    setIncomingRoomEvent,
  ])

  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'BLACK_HOLE_RESET') return

    // Ήρθε reset από άλλο tab.
    // Δεν ξαναστέλνουμε event, μόνο εφαρμόζουμε local reset.
    playAgain()

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    playAgain,
    setIncomingRoomEvent,
  ])

  useEffect(() => {
    if (!isConnected) return
    if (roomUsersCount === 0) return

    // Αν παίζουμε 2P και μείνει λιγότερος από 2, reset.
    if (numberOfPlayers === 2 && roomUsersCount < 2) {
      handleResetGame('player-left')
      return
    }

    // Αν παίζουμε 3P και μείνουν λιγότεροι από 3, reset.
    if (numberOfPlayers === 3 && roomUsersCount < 3) {
      handleResetGame('player-left')
    }
  }, [
    roomUsersCount,
  ])

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

  const handleNumberOfPlayersChange = async (
    value: 2 | 3,
  ) => {
    setNumberOfPlayers(value)

    if (!isConnected) return

    await sendRoomEvent({
      type: 'BLACK_HOLE_SETTINGS',
      payload: {
        numberOfPlayers: value,
      },
    })
  }

  const handleResetGame = async (
    reason: BlackHoleResetReason = 'manual',
  ) => {
    // Κάνει reset στο δικό μου tab.
    playAgain()

    if (!isConnected) return

    // Ενημερώνει τα άλλα tabs να κάνουν reset.
    await sendRoomEvent({
      type: 'BLACK_HOLE_RESET',
      payload: {
        reason,
      },
    })
  }

  const getTurnText = () => {
    if (localPlayer === 'waiting') {
      return `Spectating - Now Playing: Player ${currentPlayer}`
    }

    if (localPlayer === null) {
      return `Now Playing: Player ${currentPlayer}`
    }

    if (localPlayer === currentPlayer) {
      return `Now Playing: Player ${currentPlayer} - It's your turn`
    }

    return `Now Playing: Player ${currentPlayer} - Waiting`
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
                onPress={() => handleNumberOfPlayersChange(2)}
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
                onPress={() => handleNumberOfPlayersChange(3)}
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

          <Button
            title='Reset Game'
            onPress={() => handleResetGame('manual')}
          />

          <Text style={styles.playerText}>
            {getTurnText()}
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