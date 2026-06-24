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
import { usePferdApfelMultiplayer } from '@/hooks/pferdapfel/usePferdApfelMultiplayer'
import { router } from 'expo-router'

const Pferdapfel = () => {
  const { colors } = useContext(ThemeContext)
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

      <View style={globalStyles.centerContent}>
        <Text style={globalStyles.title}>
          Pferdäpfel
        </Text>
        <Pressable
          style={globalStyles.secondaryButton}
          onPress={() => router.push('/pferdapfel/pferdApfelInfo')}
        >
          <Text style={globalStyles.text}>
            Info / Rules
          </Text>
        </Pressable>

        <Text style={globalStyles.text}>
          {turnText}
        </Text>
        {!isConnected && (
          <View style={globalStyles.row}>
            <Text style={globalStyles.text}>
              Red AI
            </Text>

            <Switch
              value={isRedAi}
              onValueChange={setIsRedAi}
            />
          </View>
        )}

        {gameOver && winner && (
          <Text style={globalStyles.text}>
            Winner: {winner}
          </Text>
        )}

        <Pressable
          style={globalStyles.primaryButton}
          onPress={() => handleResetGame('manual')}
        >
          <Text style={globalStyles.primaryButtonText}>
            Restart Game
          </Text>
        </Pressable>

        <PferdApfelBoard
          knights={knights}
          blockedCells={blockedCells}
          handleCellPress={handlePferdApfelCellPress}
          boardBackground={colors.boardBackground}
          boardLine={colors.boardLine}
        />
      </View>
    </View>
  )
}

export default Pferdapfel