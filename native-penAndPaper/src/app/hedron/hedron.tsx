import {
  Text,
  View,
} from 'react-native'
import { useContext, useState } from 'react'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import HedronBoardSvg from '@/components/svg/hedron/HedronBoardSvg'

const Hedron = () => {
  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)

  type HedronPlayer = 'player1' | 'player2'
  type EdgeOwner = HedronPlayer | null

  const [currentPlayer, setCurrentPlayer] =
    useState<HedronPlayer>('player1')

  const [ownersByEdgeId, setOwnersByEdgeId] =
    useState<Record<string, EdgeOwner>>({})

  const handleEdgePress = (edgeId: string) => {
    setOwnersByEdgeId((prev) => {
      if (prev[edgeId]) return prev

      return {
        ...prev,
        [edgeId]: currentPlayer,
      }
    })

    setCurrentPlayer((prev) =>
      prev === 'player1'
        ? 'player2'
        : 'player1',
    )
  }

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
          onEdgePress={handleEdgePress}
        />

      </View>
    </View>
  )
}

export default Hedron