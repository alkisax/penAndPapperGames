import { useContext } from 'react'
import { Button, Switch, Text, View, } from 'react-native'
import { router } from 'expo-router'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import DandelionsBoardSvg from '@/components/svg/dandelion/DandelionsBoardSvg'
import DandelionsCompassSvg from '@/components/svg/dandelion/DandelionsCompassSvg'
import useDandelions from '@/hooks/dandelions/useDandelions'
import useDandelionsMultiplayer from '@/hooks/dandelions/useDandelionsMultiplayer'

const Dandelions = () => {
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
        <View
          style={{
            width: '96%',
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 12,
            backgroundColor: colors.boardBackground,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <View>
            <Text
              style={[
                globalStyles.text,
                {
                  fontSize: 13,
                  fontWeight: '700',
                },
              ]}
            >
              Dandelions
            </Text>

            <Text
              style={[
                globalStyles.text,
                {
                  fontSize: 11,
                  opacity: 0.75,
                },
              ]}
            >
              {gameOver
                ? `Winner: ${winner?.toUpperCase()}`
                : turnText}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <View
              style={{
                alignItems: 'center',
              }}
            >
              <Text
                style={[
                  globalStyles.text,
                  {
                    fontSize: 10,
                  },
                ]}
              >
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
              <Text
                style={[
                  globalStyles.text,
                  {
                    fontSize: 10,
                  },
                ]}
              >
                W AI
              </Text>

              <Switch
                value={isWindAi}
                onValueChange={setIsWindAi}
              />
            </View>

            <Button
              title='(i)'
              onPress={() => router.push('/dandelions/dandelionsInfo')}
            />

            <Button
              title='↻'
              onPress={handleResetGame}
            />
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