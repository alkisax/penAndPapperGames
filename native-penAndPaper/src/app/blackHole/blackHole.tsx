// native-penAndPaper/src/app/blackHole/blackHole.tsx

import { Button, Pressable, ScrollView, Text, View, } from 'react-native'
import { router } from 'expo-router'
import BlackHoleBoard from '@/components/svg/blackHoleBoard'
import Navbar from '@/layout/Navbar'
import { useBlackHoleMultiplayer } from '@/hooks/useBlackHoleMultiplayer'
import { useContext } from 'react'
import { createBlackHoleStyles } from '@/styles/blackHole.styles'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'

const BlackHole = () => {
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

    numberOfPlayers,
    playerControllers,
    setPlayerController,
    handleNumberOfPlayersChange,

    cells,
    winners,
    gameOver,
    scores,
    turnText,

    handleBlackHoleCellPress,
    handleResetGame,
  } = useBlackHoleMultiplayer()

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

          <Pressable
            style={globalStyles.secondaryButton}
            onPress={() => router.push('/blackHole/blackHoleInfo')}
          >
            <Text style={globalStyles.text}>
              Game Rules
            </Text>
          </Pressable>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>
              Players
            </Text>

            <View style={styles.segmentedRow}>
              <Pressable
                style={[
                  globalStyles.segmentButton,
                  numberOfPlayers === 2 &&
                  globalStyles.segmentButtonActive,
                ]}
                onPress={() => handleNumberOfPlayersChange(2)}
              >
                <Text
                  style={[
                    globalStyles.segmentButtonText,
                    numberOfPlayers === 2 &&
                    globalStyles.segmentButtonTextActive,
                  ]}
                >
                  2P
                </Text>
              </Pressable>

              <Pressable
                style={[
                  globalStyles.segmentButton,
                  numberOfPlayers === 3 &&
                  globalStyles.segmentButtonActive,
                ]}
                onPress={() => handleNumberOfPlayersChange(3)}
              >
                <Text
                  style={[
                    globalStyles.segmentButtonText,
                    numberOfPlayers === 3 &&
                    globalStyles.segmentButtonTextActive,
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
            {turnText}
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