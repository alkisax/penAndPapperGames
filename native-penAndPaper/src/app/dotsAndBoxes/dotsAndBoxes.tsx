import {
  Text,
  View,
} from 'react-native'
import { useContext, useState } from 'react'
import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import DotsAndBoxesBoardSvg from '@/components/svg/dotsAndBoxes/DotsAndBoxesBoardSvg'
import type {
  DotsAndBoxesEdge,
} from '@/components/svg/dotsAndBoxes/DotsAndBoxesBoardSvg'
import { checkClosedBoxesAfterEdge } from '@/utils/dotsAndBoxesUtils/checkClosedBoxes'
import type { DotsAndBoxesOwnedBox } from '@/components/svg/dotsAndBoxes/DotsAndBoxesBoxesLayer'

const createEdges = (
  rows: number,
  cols: number,
  lineColor: string,
): DotsAndBoxesEdge[] => {
  const edges: DotsAndBoxesEdge[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 1; col++) {
      edges.push({
        id: `h-${row}-${col}`,
        row,
        col,
        orientation: 'horizontal',
        color: lineColor,
        isVisible: false,
      })
    }
  }

  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols; col++) {
      edges.push({
        id: `v-${row}-${col}`,
        row,
        col,
        orientation: 'vertical',
        color: lineColor,
        isVisible: false,
      })
    }
  }

  return edges
}

const DotsAndBoxes = () => {
  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)

  const [edges, setEdges] = useState<DotsAndBoxesEdge[]>(() => createEdges(10, 10, colors.player1,))
  const [boxes, setBoxes] = useState<DotsAndBoxesOwnedBox[]>([])

  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1')

  const handleEdgePress = (
    edgeId: string,
  ) => {
    setEdges((prev) => {
      const selectedEdge = prev.find((edge) =>
        edge.id === edgeId
      )

      if (!selectedEdge) return prev
      if (selectedEdge.isVisible) return prev

      const currentColor =
        currentPlayer === 'player1'
          ? colors.player1
          : colors.player3

      const nextEdges = prev.map((edge) => {
        if (edge.id !== edgeId) return edge

        return {
          ...edge,
          isVisible: true,
          color: currentColor,
        }
      })

      const closedBoxes = checkClosedBoxesAfterEdge({
        edges: nextEdges,
        edge: selectedEdge,
        boxRows: 9,
        boxCols: 9,
      })

      console.log('closed boxes:', closedBoxes)

      if (closedBoxes.length > 0) {
        setBoxes((prevBoxes) => [
          ...prevBoxes,
          ...closedBoxes.map((box) => ({
            ...box,
            color: currentColor,
          })),
        ])
      }

      if (closedBoxes.length === 0) {
        setCurrentPlayer((prevPlayer) =>
          prevPlayer === 'player1'
            ? 'player2'
            : 'player1',
        )
      }

      return nextEdges
    })
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
          Dots and Boxes
        </Text>

        <Text style={globalStyles.text}>
          Current:{' '}
          {currentPlayer === 'player1'
            ? 'Blue'
            : 'Red'}
        </Text>

        <DotsAndBoxesBoardSvg
          rows={10}
          cols={10}
          edges={edges}
          boxes={boxes}
          dotColor={colors.text}
          emptyEdgeColor={colors.boardLine}
          boardLine={colors.boardLine}
          onEdgePress={handleEdgePress}
        />
      </View>
    </View>
  )
}

export default DotsAndBoxes