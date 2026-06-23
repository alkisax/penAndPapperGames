// src/app/blackHole/blackHole.tsx
import {
  View,
  Button,
  Text,
  Switch,
  Pressable,
  ScrollView,
} from 'react-native'
import BlackHoleBoard from '@/components/svg/blackHoleBoard'
import Navbar from '@/layout/Navbar'
import { useBlackHole } from '@/hooks/useBlackHole'
import { useState, useContext, useEffect } from 'react'
import { createBlackHoleStyles } from '@/styles/blackHole.styles'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { useRoomContext } from '@/context/RoomContext'
import { logToServer } from '@/utils/logToServer'

const BlackHole = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(2)

  const { colors } = useContext(ThemeContext)

  const styles = createBlackHoleStyles(colors)
  const globalStyles = createGlobalStyles(colors)

  const {
    currentPlayer,
    cells,
    handleCellPress,
    winners,
    gameOver,
    playAgain,
    scores,
    isPlayer2Ai,
    setIsPlayer2Ai,
  } = useBlackHole({
    numberOfPlayers,
  })

  // useEffect(() => {
  //   logToServer('test from Black Hole screen')
  // },[])

  const {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    getGameRoomId,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,
  } = useRoomContext()

  const blackHoleRoomId = getGameRoomId('blackHole')

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
              Play against AI
            </Text>

            <Switch
              value={isPlayer2Ai}
              onValueChange={setIsPlayer2Ai}
              trackColor={{
                false: colors.switchTrackOff,
                true: colors.switchTrackOn,
              }}
              thumbColor={colors.switchThumb}
            />
          </View>
        </View>

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
            handleCellPress={handleCellPress}
            cells={cells}
          />
        </View>
      </ScrollView>


    </View>
  )
}

export default BlackHole