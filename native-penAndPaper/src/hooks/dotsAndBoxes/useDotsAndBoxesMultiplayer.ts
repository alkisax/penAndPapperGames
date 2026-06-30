import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import type {
  AppColors,
} from '@/styles/global'

import { useRoomContext } from '@/context/RoomContext'

import {
  useDotsAndBoxes,
} from '@/hooks/dotsAndBoxes/useDotsAndBoxes'

type DotsAndBoxesEdgePayload = {
  edgeId: string
}

type DotsAndBoxesResetPayload = {
  reason: 'manual' | 'player-left'
}

type Props = {
  dotRows: number
  dotCols: number
  colors: AppColors
}

const isDotsAndBoxesEdgePayload = (
  payload: unknown,
): payload is DotsAndBoxesEdgePayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return typeof data.edgeId === 'string'
}

const isDotsAndBoxesResetPayload = (
  payload: unknown,
): payload is DotsAndBoxesResetPayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return (
    data.reason === 'manual' ||
    data.reason === 'player-left'
  )
}

export const useDotsAndBoxesMultiplayer = ({
  dotRows,
  dotCols,
  colors,
}: Props) => {
  const [isPlayer2Ai, setIsPlayer2Ai] =
    useState(false)

  const previousRoomUsersCountRef = useRef(0)

  const {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,
    sendRoomEvent,
    incomingRoomEvent,
    setIncomingRoomEvent,
    localPlayer,
    roomUsersCount,
  } = useRoomContext()

  const handleAiMoveBroadcast = useCallback(async (
    edgeId: string,
  ) => {
    if (!isConnected) return

    await sendRoomEvent({
      type: 'DOTS_BOXES_EDGE',
      payload: {
        edgeId,
      },
    })
  }, [
    isConnected,
    sendRoomEvent,
  ])

  const {
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
  } = useDotsAndBoxes({
    dotRows,
    dotCols,
    colors,
    isPlayer2Ai: !isConnected && isPlayer2Ai,
    onAiMove: handleAiMoveBroadcast,
  })

  const currentPlayerSlot =
    currentPlayer === 'player1'
      ? 1
      : 2

  const canLocalPlayerMove = () => {
    if (!isConnected) return true
    if (localPlayer === null) return false
    if (localPlayer === 'waiting') return false

    return localPlayer === currentPlayerSlot
  }

  const handleDotsAndBoxesEdgePress = useCallback(async (
    edgeId: string,
  ) => {
    if (!canLocalPlayerMove()) {
      console.log('not your turn', {
        localPlayer,
        currentPlayer,
      })

      return false
    }

    const moveWasApplied = handleEdgePress(edgeId)

    if (!moveWasApplied) return false
    if (!isConnected) return true

    await sendRoomEvent({
      type: 'DOTS_BOXES_EDGE',
      payload: {
        edgeId,
      },
    })

    return true
  }, [
    currentPlayer,
    currentPlayerSlot,
    handleEdgePress,
    isConnected,
    localPlayer,
    sendRoomEvent,
  ])

  const handleResetGame = useCallback(async (
    reason: 'manual' | 'player-left' = 'manual',
  ) => {
    restartGame()

    if (!isConnected) return

    await sendRoomEvent({
      type: 'DOTS_BOXES_RESET',
      payload: {
        reason,
      },
    })
  }, [
    isConnected,
    restartGame,
    sendRoomEvent,
  ])

  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'DOTS_BOXES_EDGE') return

    if (!isDotsAndBoxesEdgePayload(incomingRoomEvent.payload)) {
      setIncomingRoomEvent(null)
      return
    }

    handleRemoteEdgePress(
      incomingRoomEvent.payload.edgeId,
    )

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    handleRemoteEdgePress,
    setIncomingRoomEvent,
  ])

  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'DOTS_BOXES_RESET') return

    if (!isDotsAndBoxesResetPayload(incomingRoomEvent.payload)) {
      setIncomingRoomEvent(null)
      return
    }

    restartGame()

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    restartGame,
    setIncomingRoomEvent,
  ])

  useEffect(() => {
    if (!isConnected) {
      previousRoomUsersCountRef.current = 0
      return
    }

    const previousRoomUsersCount =
      previousRoomUsersCountRef.current

    if (
      previousRoomUsersCount > 0 &&
      roomUsersCount > 0 &&
      roomUsersCount < previousRoomUsersCount &&
      localPlayer !== 'waiting'
    ) {
      restartGame()
    }

    previousRoomUsersCountRef.current = roomUsersCount
  }, [
    isConnected,
    localPlayer,
    roomUsersCount,
    restartGame,
  ])

  const getTurnText = () => {
    if (gameOver) {
      return 'Game Over'
    }

    const currentLabel =
      currentPlayer === 'player1'
        ? 'Blue'
        : 'Red'

    if (!isConnected) {
      return `Current: ${currentLabel}`
    }

    if (localPlayer === 'waiting') {
      return `Spectating - Current: ${currentLabel}`
    }

    if (localPlayer === null) {
      return `Current: ${currentLabel}`
    }

    if (localPlayer === currentPlayerSlot) {
      return `Current: ${currentLabel} - Your turn`
    }

    return `Current: ${currentLabel} - Waiting`
  }

  return {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,
    roomUsersCount,
    localPlayer,

    dotRows,
    dotCols,
    edges,
    boxes,
    currentPlayer,
    player1Score,
    player2Score,
    gameOver,
    winner,
    turnText: getTurnText(),

    handleDotsAndBoxesEdgePress,
    handleResetGame,

    isPlayer2Ai,
    setIsPlayer2Ai,
  }
}