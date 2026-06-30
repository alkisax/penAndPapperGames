import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import type {
  AppColors,
} from '@/styles/global'

import type {
  DotsAndBoxesEdge,
} from '@/components/svg/dotsAndBoxes/DotsAndBoxesBoardSvg'

import type {
  DotsAndBoxesOwnedBox,
} from '@/components/svg/dotsAndBoxes/DotsAndBoxesBoxesLayer'

import {
  checkClosedBoxesAfterEdge,
} from '@/utils/dotsAndBoxesUtils/checkClosedBoxes'

import {
  createDotsAndBoxesEdges,
} from '@/utils/dotsAndBoxesUtils/createDotsAndBoxesEdges'

import {
  suggestDotsAndBoxesMove,
} from '@/utils/dotsAndBoxesUtils/suggestDotsAndBoxesMove'

export type DotsAndBoxesPlayer = 'player1' | 'player2'

type OwnedBox = DotsAndBoxesOwnedBox & {
  owner: DotsAndBoxesPlayer
}

type Props = {
  dotRows: number
  dotCols: number
  colors: AppColors
  isPlayer2Ai?: boolean
  onAiMove?: (edgeId: string) => Promise<void> | void
}

export const useDotsAndBoxes = ({
  dotRows,
  dotCols,
  colors,
  isPlayer2Ai = false,
  onAiMove,
}: Props) => {
  const boxRows = dotRows - 1
  const boxCols = dotCols - 1

  const [edges, setEdges] =
    useState<DotsAndBoxesEdge[]>(() =>
      createDotsAndBoxesEdges(
        dotRows,
        dotCols,
        colors.player1,
      ),
    )

  const [boxes, setBoxes] =
    useState<OwnedBox[]>([])

  const [currentPlayer, setCurrentPlayer] =
    useState<DotsAndBoxesPlayer>('player1')

  const player1Score = boxes.filter((box) =>
    box.owner === 'player1'
  ).length

  const player2Score = boxes.filter((box) =>
    box.owner === 'player2'
  ).length

  const totalBoxes = boxRows * boxCols

  const gameOver = boxes.length >= totalBoxes

  const winner =
    !gameOver
      ? null
      : player1Score > player2Score
        ? 'player1'
        : player2Score > player1Score
          ? 'player2'
          : 'draw'

  const getCurrentPlayerColor = (
    player: DotsAndBoxesPlayer,
  ) => {
    if (player === 'player1') {
      return colors.player1
    }

    return colors.player3
  }

  const switchPlayer = () => {
    setCurrentPlayer((prev) =>
      prev === 'player1'
        ? 'player2'
        : 'player1',
    )
  }

  const applyEdgeMove = useCallback((
    edgeId: string,
  ) => {
    if (gameOver) return false

    const selectedEdge = edges.find((edge) =>
      edge.id === edgeId
    )

    if (!selectedEdge) return false
    if (selectedEdge.isVisible) return false

    const currentColor =
      getCurrentPlayerColor(currentPlayer)

    const nextEdges = edges.map((edge) => {
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
      boxRows,
      boxCols,
    })

    setEdges(nextEdges)

    if (closedBoxes.length > 0) {
      setBoxes((prevBoxes) => [
        ...prevBoxes,
        ...closedBoxes
          .filter((box) =>
            !prevBoxes.some((prevBox) =>
              prevBox.id === box.id
            )
          )
          .map((box) => ({
            ...box,
            color: currentColor,
            owner: currentPlayer,
          })),
      ])

      return true
    }

    switchPlayer()

    return true
  }, [
    boxCols,
    boxRows,
    currentPlayer,
    edges,
    gameOver,
    colors.player1,
    colors.player3,
  ])

  const handleEdgePress = (
    edgeId: string,
  ) => {
    return applyEdgeMove(edgeId)
  }

  const handleRemoteEdgePress = (
    edgeId: string,
  ) => {
    return applyEdgeMove(edgeId)
  }

  const restartGame = () => {
    setEdges(
      createDotsAndBoxesEdges(
        dotRows,
        dotCols,
        colors.player1,
      ),
    )

    setBoxes([])
    setCurrentPlayer('player1')
  }

  useEffect(() => {
    if (!isPlayer2Ai) return
    if (currentPlayer !== 'player2') return
    if (gameOver) return

    const timeoutId = setTimeout(() => {
      const suggestedMove = suggestDotsAndBoxesMove({
        edges,
        boxRows,
        boxCols,
      })

      if (!suggestedMove) return

      console.log('Dots AI move:', suggestedMove)

      const moveWasApplied =
        handleEdgePress(suggestedMove.edgeId)

      if (moveWasApplied) {
        onAiMove?.(suggestedMove.edgeId)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [
    isPlayer2Ai,
    currentPlayer,
    gameOver,
    edges,
    boxRows,
    boxCols,
    handleEdgePress,
    onAiMove,
  ])

  return {
    dotRows,
    dotCols,
    boxRows,
    boxCols,

    edges,
    boxes,
    currentPlayer,

    player1Score,
    player2Score,
    gameOver,
    winner,

    handleEdgePress,
    handleRemoteEdgePress,
    restartGame,
  }
}