// native-penAndPaper/src/app/hedron/hedron.tsx

import {
  Pressable,
  Text,
  View,
} from 'react-native'
import { useContext } from 'react'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import HedronBoardSvg from '@/components/svg/hedron/HedronBoardSvg'
import { useHedron } from '@/hooks/hedron/useHedron'

const Hedron = () => {
  const { colors } = useContext(ThemeContext)

  const globalStyles = createGlobalStyles(colors)

  const {
    currentPlayer,
    ownersByEdgeId,
    ownersByRegionId,
    scoreResult,
    handleEdgePress,
    clearGame,
  } = useHedron()

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
          Hedron
        </Text>

        <Text style={globalStyles.text}>
          Current: {currentPlayer === 'player1' ? 'X' : 'O'}
        </Text>

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

        {/* <Text style={globalStyles.text}>
          GameOver: {scoreResult.gameOver ? 'yes' : 'no'}
        </Text> */}

        {/* <Text style={globalStyles.text}>
          Unowned: {scoreResult.unownedRegionIds.join(', ')}
        </Text> */}

        <Pressable
          style={globalStyles.primaryButton}
          onPress={clearGame}
        >
          <Text style={globalStyles.primaryButtonText}>
            Clear
          </Text>
        </Pressable>

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
          onEdgePress={handleEdgePress}
        />
      </View>
    </View>
  )
}

export default Hedron