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
    handleCellPress,
    usedDirections,
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
          {currentPlayerText}
        </Text>

        <Text style={globalStyles.text}>
          {waitingText}
        </Text>

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