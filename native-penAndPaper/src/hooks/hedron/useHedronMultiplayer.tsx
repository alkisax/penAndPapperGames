import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useRoomContext } from '@/context/RoomContext'
import { useHedron } from '@/hooks/hedron/useHedron'

type HedronEdgePayload = {
  edgeId: string
}

type HedronResetPayload = {
  reason: 'manual' | 'player-left'
}

const isHedronEdgePayload = (
  payload: unknown,
): payload is HedronEdgePayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return typeof data.edgeId === 'string'
}

const isHedronResetPayload = (
  payload: unknown,
): payload is HedronResetPayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return (
    data.reason === 'manual' ||
    data.reason === 'player-left'
  )
}

export const useHedronMultiplayer = () => {
  const [isPlayer2Ai, setIsPlayer2Ai] = useState(false)

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

  const {
    currentPlayer,
    ownersByEdgeId,
    ownersByRegionId,
    scoreResult,
    handleEdgePress,
    handleRemoteEdgePress,
    clearGame,
  } = useHedron({
    isPlayer2Ai: !isConnected && isPlayer2Ai,
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

  const handleHedronEdgePress = useCallback(async (
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
      type: 'HEDRON_EDGE',
      payload: {
        edgeId,
      },
    })

    return true
  }, [
    currentPlayer,
    handleEdgePress,
    isConnected,
    localPlayer,
    sendRoomEvent,
  ])

  const handleResetGame = useCallback(async (
    reason: 'manual' | 'player-left' = 'manual',
  ) => {
    clearGame()

    if (!isConnected) return

    await sendRoomEvent({
      type: 'HEDRON_RESET',
      payload: {
        reason,
      },
    })
  }, [
    clearGame,
    isConnected,
    sendRoomEvent,
  ])

  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'HEDRON_EDGE') return

    if (!isHedronEdgePayload(incomingRoomEvent.payload)) {
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
    if (incomingRoomEvent.type !== 'HEDRON_RESET') return

    if (!isHedronResetPayload(incomingRoomEvent.payload)) {
      setIncomingRoomEvent(null)
      return
    }

    clearGame()

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    clearGame,
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
      clearGame()
    }

    previousRoomUsersCountRef.current = roomUsersCount
  }, [
    isConnected,
    localPlayer,
    roomUsersCount,
    clearGame,
  ])

  const getTurnText = () => {
    if (!isConnected) {
      return `Current: ${
        currentPlayer === 'player1'
          ? 'X'
          : 'O'
      }`
    }

    if (localPlayer === 'waiting') {
      return `Spectating - Current: ${
        currentPlayer === 'player1'
          ? 'X'
          : 'O'
      }`
    }

    if (localPlayer === null) {
      return `Current: ${
        currentPlayer === 'player1'
          ? 'X'
          : 'O'
      }`
    }

    if (localPlayer === currentPlayerSlot) {
      return `Current: ${
        currentPlayer === 'player1'
          ? 'X'
          : 'O'
      } - Your turn`
    }

    return `Current: ${
      currentPlayer === 'player1'
        ? 'X'
        : 'O'
    } - Waiting`
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

    currentPlayer,
    ownersByEdgeId,
    ownersByRegionId,
    scoreResult,
    turnText: getTurnText(),

    handleHedronEdgePress,
    handleResetGame,

    isPlayer2Ai,
    setIsPlayer2Ai,
  }
}