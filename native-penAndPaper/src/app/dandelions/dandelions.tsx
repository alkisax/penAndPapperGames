import { useContext } from 'react'
import { Button, Pressable, Switch, Text, View, } from 'react-native'
import { router } from 'expo-router'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import DandelionsBoardSvg from '@/components/svg/dandelion/DandelionsBoardSvg'
import DandelionsCompassSvg from '@/components/svg/dandelion/DandelionsCompassSvg'
import useDandelions from '@/hooks/dandelions/useDandelions'
import useDandelionsMultiplayer from '@/hooks/dandelions/useDandelionsMultiplayer'
import { createRibbonStyles } from '@/styles/ribbon.styles'

const Dandelions = () => {
  const { colors } = useContext(ThemeContext)
  const ribbonStyles = createRibbonStyles(colors)
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

    cells,
    usedDirections,
    winner,
    gameOver,
    turnText,

    isDandelionAi,
    setIsDandelionAi,
    isWindAi,
    setIsWindAi,

    handleCellPress,
    handleWindDirectionPress,
    handleResetGame,
  } = useDandelionsMultiplayer()

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
<View style={ribbonStyles.ribbon}>
  <View style={ribbonStyles.titleBlock}>
    <Text style={ribbonStyles.title}>
      Dandelions
    </Text>

    <Text style={ribbonStyles.subtitle}>
      {gameOver
        ? `Winner: ${winner?.toUpperCase()}`
        : turnText}
    </Text>
  </View>

  <View style={ribbonStyles.actions}>
    <View
      style={{
        alignItems: 'center',
      }}
    >
      <Text style={ribbonStyles.smallLabel}>
        D AI
      </Text>

      <Switch
        value={isDandelionAi}
        onValueChange={setIsDandelionAi}
      />
    </View>

    <View
      style={{
        alignItems: 'center',
      }}
    >
      <Text style={ribbonStyles.smallLabel}>
        W AI
      </Text>

      <Switch
        value={isWindAi}
        onValueChange={setIsWindAi}
      />
    </View>

    <Pressable
      style={ribbonStyles.button}
      onPress={() => router.push('/dandelions/dandelionsInfo')}
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
      onPress={handleResetGame}
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