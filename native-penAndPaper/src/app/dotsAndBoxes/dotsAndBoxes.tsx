import {
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native'
import {
  useContext,
} from 'react'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'
import DotsAndBoxesBoardSvg from '@/components/svg/dotsAndBoxes/DotsAndBoxesBoardSvg'
import { useDotsAndBoxesMultiplayer } from '@/hooks/dotsAndBoxes/useDotsAndBoxesMultiplayer'
import { router } from 'expo-router'

const DOT_ROWS = 7
const DOT_COLS = 7

const DotsAndBoxes = () => {
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

    dotRows,
    dotCols,
    edges,
    boxes,
    player1Score,
    player2Score,
    gameOver,
    winner,
    turnText,

    handleDotsAndBoxesEdgePress,
    handleResetGame,

    isPlayer2Ai,
    setIsPlayer2Ai,
  } = useDotsAndBoxesMultiplayer({
    dotRows: DOT_ROWS,
    dotCols: DOT_COLS,
    colors,
  })

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

      <View style={globalStyles.gameContent}>
        <View style={ribbonStyles.ribbon}>
          <View style={ribbonStyles.titleBlock}>
            <Text style={ribbonStyles.title}>
              Dots and Boxes
            </Text>

            <Text style={ribbonStyles.subtitle}>
              {turnText}
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

            <Pressable
              style={ribbonStyles.button}
              onPress={() => router.push('/dotsAndBoxes/dotsAndBoxesInfo')}
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

        <Text style={globalStyles.text}>
          Blue: {player1Score} | Red: {player2Score}
        </Text>

        {gameOver && (
          <Text style={globalStyles.text}>
            Winner:{' '}
            {winner === 'draw'
              ? 'Draw'
              : winner === 'player1'
                ? 'Blue'
                : 'Red'}
          </Text>
        )}

        <View style={globalStyles.boardCard}>
          <DotsAndBoxesBoardSvg
            rows={dotRows}
            cols={dotCols}
            edges={edges}
            boxes={boxes}
            dotColor={colors.text}
            emptyEdgeColor={colors.boardLine}
            boardLine={colors.boardLine}
            onEdgePress={handleDotsAndBoxesEdgePress}
          />
        </View>

      </View>
    </View>
  )
}

export default DotsAndBoxes