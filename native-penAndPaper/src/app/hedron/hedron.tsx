import {
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native'
import { useContext } from 'react'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'
import HedronBoardSvg from '@/components/svg/hedron/HedronBoardSvg'
import { useHedronMultiplayer } from '@/hooks/hedron/useHedronMultiplayer'

const Hedron = () => {
  const { colors } = useContext(ThemeContext)

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

    currentPlayer,
    ownersByEdgeId,
    ownersByRegionId,
    scoreResult,
    turnText,

    handleHedronEdgePress,
    handleResetGame,

    isPlayer2Ai,
    setIsPlayer2Ai,
  } = useHedronMultiplayer()

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
              Hedron
            </Text>

            <Text style={ribbonStyles.subtitle}>
              {scoreResult.gameOver
                ? 'Game Over'
                : turnText}
            </Text>
          </View>

          <View style={ribbonStyles.actions}>
            {!isConnected && (
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
                  O AI
                </Text>

                <Switch
                  value={isPlayer2Ai}
                  onValueChange={setIsPlayer2Ai}
                />
              </View>
            )}

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

        <Text style={globalStyles.text}>
          X: {scoreResult.player1Expression}
        </Text>

        <Text style={globalStyles.text}>
          O: {scoreResult.player2Expression}
        </Text>

        {scoreResult.gameOver && (
          <Text style={globalStyles.text}>
            Winner:{' '}
            {scoreResult.winner === 'draw'
              ? 'Draw'
              : scoreResult.winner === 'player1'
                ? 'X'
                : 'O'}
          </Text>
        )}

        <HedronBoardSvg
          size={360}
          lineColor={colors.boardLine}
          currentPlayer={currentPlayer}
          ownersByEdgeId={ownersByEdgeId}
          emptyColor={colors.boardBackground}
          player1Color={colors.player1}
          player2Color={colors.player3}
          mixedColor='#d88bd8'
          labelColor={colors.text}
          ownersByRegionId={ownersByRegionId}
          onEdgePress={handleHedronEdgePress}
        />
      </View>
    </View>
  )
}

export default Hedron