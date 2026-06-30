import {
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native'
import { useContext } from 'react'
import { router } from 'expo-router'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'
import HexBoardSvg from '@/components/svg/hex/HexBoardSvg'
import { useHexMultiplayer } from '@/hooks/hex/useHexMultiplayer'

const BOARD_SIZE = 9

const Hex = () => {
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

    boardSize,
    cells,
    currentPlayer,
    winner,
    swapAvailable,
    turnText,

    handleHexCellPress,
    handleHexSwapOpeningMove,
    handleResetGame,

    isPlayer2Ai,
    setIsPlayer2Ai,
  } = useHexMultiplayer({
    boardSize: BOARD_SIZE,
  })

  const currentPlayerColor =
    currentPlayer === 'player1'
      ? colors.player1
      : colors.player3

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
              Hex
            </Text>

            <Text style={ribbonStyles.subtitle}>
              {winner ? 'Game Over' : turnText}
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
                  P2 AI
                </Text>

                <Switch
                  value={isPlayer2Ai}
                  onValueChange={setIsPlayer2Ai}
                />
              </View>
            )}

            {swapAvailable && !winner && (
              <Pressable
                style={ribbonStyles.button}
                onPress={handleHexSwapOpeningMove}
              >
                <Text style={ribbonStyles.buttonText}>
                  Swap
                </Text>
              </Pressable>
            )}

            <Pressable
              style={ribbonStyles.button}
              onPress={() => router.push('/hex/hexInfo')}
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

        {winner && (
          <Text style={globalStyles.text}>
            Winner:{' '}
            {winner === 'player1'
              ? 'Player 1'
              : 'Player 2'}
          </Text>
        )}

        <HexBoardSvg
          boardSize={boardSize}
          cells={cells}
          boardBackground={colors.boardBackground}
          boardLine={colors.boardLine}
          player1Color={colors.player1}
          player2Color={colors.player3}
          currentPlayerColor={currentPlayerColor}
          onCellPress={handleHexCellPress}
        />
      </View>
    </View>
  )
}

export default Hex