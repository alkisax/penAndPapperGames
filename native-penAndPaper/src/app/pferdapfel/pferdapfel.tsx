// native-penAndPaper/src/app/pferdapfel/pferdapfel.tsx
import {
  Pressable,
  Text,
  View,
} from 'react-native'
import { useContext } from 'react'

import PferdApfelBoard from '@/components/svg/pferdapfel/PferdApfelBoard'
import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { usePferdApfel } from '@/hooks/pferdapfel/usePferdApfel'
import { usePferdApfelMultiplayer } from '@/hooks/pferdapfel/usePferdApfelMultiplayer'

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

        <Text style={globalStyles.text}>
          {turnText}
        </Text>

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
        />
      </View>
    </View>
  )
}

export default Pferdapfel