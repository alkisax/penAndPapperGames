import {
  Pressable,
  Text,
  View,
  Switch,
} from 'react-native'
import { useContext, useState } from 'react'
import { router } from 'expo-router'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'
import HexBoardSvg from '@/components/svg/hex/HexBoardSvg'
import { useHex } from '@/hooks/hex/useHex'

const BOARD_SIZE = 9

const Hex = () => {
  const [isPlayer2Ai, setIsPlayer2Ai] = useState(false)

  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)
  const ribbonStyles = createRibbonStyles(colors)

  const {
    boardSize,
    cells,
    currentPlayer,
    winner,
    swapAvailable,
    handleCellPress,
    handleSwapOpeningMove,
    restartGame,
  } = useHex({
    boardSize: BOARD_SIZE,
    isPlayer2Ai,
  })

  const currentPlayerColor =
    currentPlayer === 'player1'
      ? colors.player1
      : colors.player3

  const turnText = winner
    ? `Winner: ${winner === 'player1'
      ? 'Player 1'
      : 'Player 2'
    }`
    : `Current: ${currentPlayer === 'player1'
      ? 'Player 1'
      : 'Player 2'
    }`

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
          <View style={ribbonStyles.titleBlock}>
            <Text style={ribbonStyles.title}>
              Hex
            </Text>

            <Text style={ribbonStyles.subtitle}>
              {winner ? 'Game Over' : turnText}
            </Text>
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
              P2 AI
            </Text>

            <Switch
              value={isPlayer2Ai}
              onValueChange={setIsPlayer2Ai}
            />
          </View>

          <View style={ribbonStyles.actions}>
            {swapAvailable && !winner && (
              <Pressable
                style={ribbonStyles.button}
                onPress={handleSwapOpeningMove}
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
              onPress={restartGame}
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
            {turnText}
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
          onCellPress={handleCellPress}
        />
      </View>
    </View>
  )
}

export default Hex