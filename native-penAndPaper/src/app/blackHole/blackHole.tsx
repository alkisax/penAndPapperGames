// native-penAndPaper/src/app/blackHole/blackHole.tsx

import { Button, Pressable, ScrollView, Text, View, } from 'react-native'
import { router } from 'expo-router'
import BlackHoleBoard from '@/components/svg/blackHoleBoard'
import Navbar from '@/layout/Navbar'
import { useBlackHoleMultiplayer } from '@/hooks/blackHole/useBlackHoleMultiplayer'
import { useContext } from 'react'
import { createBlackHoleStyles } from '@/styles/blackHole.styles'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'

const BlackHole = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createBlackHoleStyles(colors)
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
          <View
            style={[
              ribbonStyles.ribbon,
              ribbonStyles.ribbonColumn,
            ]}
          >
            <View style={ribbonStyles.headerRow}>
              <View style={ribbonStyles.titleBlock}>
                <Text
                  style={ribbonStyles.title}
                  numberOfLines={1}
                >
                  Black Hole
                </Text>

                <Text
                  style={ribbonStyles.subtitle}
                  numberOfLines={1}
                >
                  {gameOver
                    ? `Winner${winners.length > 1 ? 's' : ''}: Player ${winners.join(', Player ')}`
                    : turnText}
                </Text>
              </View>

              <View style={ribbonStyles.actions}>
                <Pressable
                  style={ribbonStyles.button}
                  onPress={() => router.push('/blackHole/blackHoleInfo')}
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

            <View style={ribbonStyles.controlRow}>
              <Text style={ribbonStyles.controlLabel}>
                Players
              </Text>

              <View style={ribbonStyles.segmentGroup}>
                <Pressable
                  style={[
                    ribbonStyles.miniSegmentButton,
                    numberOfPlayers === 2 &&
                    ribbonStyles.miniSegmentButtonActive,
                  ]}
                  onPress={() => handleNumberOfPlayersChange(2)}
                >
                  <Text
                    style={[
                      ribbonStyles.miniSegmentButtonText,
                      numberOfPlayers === 2 &&
                      ribbonStyles.miniSegmentButtonTextActive,
                    ]}
                  >
                    2P
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    ribbonStyles.miniSegmentButton,
                    numberOfPlayers === 3 &&
                    ribbonStyles.miniSegmentButtonActive,
                  ]}
                  onPress={() => handleNumberOfPlayersChange(3)}
                >
                  <Text
                    style={[
                      ribbonStyles.miniSegmentButtonText,
                      numberOfPlayers === 3 &&
                      ribbonStyles.miniSegmentButtonTextActive,
                    ]}
                  >
                    3P
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={ribbonStyles.controlRow}>
              <Text style={ribbonStyles.controlLabel}>
                P1
              </Text>

              <View style={ribbonStyles.segmentGroup}>
                {(['local', 'ai', 'remote'] as const).map((value) => (
                  <Pressable
                    key={`p1-${value}`}
                    style={[
                      ribbonStyles.miniSegmentButton,
                      playerControllers.player1 === value &&
                      ribbonStyles.miniSegmentButtonActive,
                    ]}
                    onPress={() => setPlayerController('player1', value)}
                  >
                    <Text
                      style={[
                        ribbonStyles.miniSegmentButtonText,
                        playerControllers.player1 === value &&
                        ribbonStyles.miniSegmentButtonTextActive,
                      ]}
                    >
                      {value}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={ribbonStyles.controlRow}>
              <Text style={ribbonStyles.controlLabel}>
                P2
              </Text>

              <View style={ribbonStyles.segmentGroup}>
                {(['local', 'ai', 'remote'] as const).map((value) => (
                  <Pressable
                    key={`p2-${value}`}
                    style={[
                      ribbonStyles.miniSegmentButton,
                      playerControllers.player2 === value &&
                      ribbonStyles.miniSegmentButtonActive,
                    ]}
                    onPress={() => setPlayerController('player2', value)}
                  >
                    <Text
                      style={[
                        ribbonStyles.miniSegmentButtonText,
                        playerControllers.player2 === value &&
                        ribbonStyles.miniSegmentButtonTextActive,
                      ]}
                    >
                      {value}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {numberOfPlayers === 3 && (
              <View style={ribbonStyles.controlRow}>
                <Text style={ribbonStyles.controlLabel}>
                  P3
                </Text>

                <View style={ribbonStyles.segmentGroup}>
                  {(['local', 'ai', 'remote'] as const).map((value) => (
                    <Pressable
                      key={`p3-${value}`}
                      style={[
                        ribbonStyles.miniSegmentButton,
                        playerControllers.player3 === value &&
                        ribbonStyles.miniSegmentButtonActive,
                      ]}
                      onPress={() => setPlayerController('player3', value)}
                    >
                      <Text
                        style={[
                          ribbonStyles.miniSegmentButtonText,
                          playerControllers.player3 === value &&
                          ribbonStyles.miniSegmentButtonTextActive,
                        ]}
                      >
                        {value}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {gameOver && (
              <View style={ribbonStyles.scorePanel}>
                <Text style={ribbonStyles.scoreTitle}>
                  Winner{winners.length > 1 ? 's' : ''}: Player{' '}
                  {winners.join(', Player ')}
                </Text>

                <Text style={ribbonStyles.scoreText}>
                  P1: {scores.player1} | P2: {scores.player2}
                  {numberOfPlayers === 3
                    ? ` | P3: ${scores.player3}`
                    : ''}
                </Text>
              </View>
            )}
          </View>

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