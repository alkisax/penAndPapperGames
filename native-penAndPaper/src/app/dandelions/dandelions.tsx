import { useContext } from 'react'
import {
  Button,
  Text,
  View,
} from 'react-native'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import DandelionsBoardSvg from '@/components/svg/dandelion/DandelionsBoardSvg'
import DandelionsCompassSvg from '@/components/svg/dandelion/DandelionsCompassSvg'
import useDandelions from '@/hooks/dandelions/useDandelions'

const Dandelions = () => {
  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)

  const {
    cells,
    currentPlayerText,
    waitingText,
    usedDirections,
    winner,
    gameOver,
    handleCellPress,
    handleWindDirectionPress,
    handleResetGame,
  } = useDandelions()

  return (
    <View style={globalStyles.screen}>
      <Navbar
        roomId=''
        setRoomId={() => { }}
        username=''
        setUsername={() => { }}
        handleConnectSocket={async () => { }}
        handleDisconnectSocket={async () => { }}
        isConnected={false}
        hasPeer={false}
      />

      <View style={globalStyles.centerContent}>
        <Text style={globalStyles.title}>
          Dandelions
        </Text>

        <Button
          title='Restart Game'
          onPress={handleResetGame}
        />

        <Text style={globalStyles.text}>
          {gameOver ? 'Game Over' : currentPlayerText}
        </Text>

        {!gameOver && (
          <Text style={globalStyles.text}>
            {waitingText}
          </Text>
        )}

        {gameOver && winner && (
          <Text style={globalStyles.text}>
            Winner: {winner.toUpperCase()}
          </Text>
        )}

        <DandelionsBoardSvg
          cells={cells}
          handleCellPress={handleCellPress}
          boardBackground={colors.boardBackground}
          boardLine={colors.boardLine}
          dandelionColor={colors.player1}
          seedColor={colors.player1}
        />

        <DandelionsCompassSvg
          lineColor={colors.boardLine}
          arrowColor={colors.player1}
          usedDirections={usedDirections}
          handleDirectionPress={handleWindDirectionPress}
        />
      </View>
    </View>
  )
}

export default Dandelions