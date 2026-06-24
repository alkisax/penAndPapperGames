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

const Pferdapfel = () => {
  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)

  const {
    currentPlayer,
    knights,
    blockedCells,
    winner,
    gameOver,
    handleCellPress,
    restartGame,
  } = usePferdApfel()

  return (
    <View style={globalStyles.screen}>
      <Navbar
        roomId=''
        setRoomId={() => {}}
        username=''
        setUsername={() => {}}
        handleConnectSocket={async () => {}}
        handleDisconnectSocket={async () => {}}
        isConnected={false}
        hasPeer={false}
      />

      <View style={globalStyles.centerContent}>
        <Text style={globalStyles.title}>
          Pferdäppel
        </Text>

        <Text style={globalStyles.text}>
          Current player: {currentPlayer}
        </Text>

        {gameOver && winner && (
          <Text style={globalStyles.text}>
            Winner: {winner}
          </Text>
        )}

        <Pressable
          style={globalStyles.primaryButton}
          onPress={restartGame}
        >
          <Text style={globalStyles.primaryButtonText}>
            Restart Game
          </Text>
        </Pressable>

        <PferdApfelBoard
          knights={knights}
          blockedCells={blockedCells}
          handleCellPress={handleCellPress}
        />
      </View>
    </View>
  )
}

export default Pferdapfel