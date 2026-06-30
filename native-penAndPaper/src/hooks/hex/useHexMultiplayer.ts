import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useRoomContext } from '@/context/RoomContext'
import { useHex } from '@/hooks/hex/useHex'

type HexMovePayload = {
  cellId: number
}

type HexSwapPayload = {
  swapped: true
}

type HexResetPayload = {
  reason: 'manual' | 'player-left'
}

type Props = {
  boardSize: number
}

const isHexMovePayload = (
  payload: unknown,
): payload is HexMovePayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return typeof data.cellId === 'number'
}

const isHexSwapPayload = (
  payload: unknown,
): payload is HexSwapPayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return data.swapped === true
}

const isHexResetPayload = (
  payload: unknown,
): payload is HexResetPayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return (
    data.reason === 'manual' ||
    data.reason === 'player-left'
  )
}

export const useHexMultiplayer = ({
  boardSize,
}: Props) => {
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

  const handleAiMoveBroadcast = useCallback(async (
    cellId: number,
  ) => {
    if (!isConnected) return

    await sendRoomEvent({
      type: 'HEX_MOVE',
      payload: {
        cellId,
      },
    })
  }, [
    isConnected,
    sendRoomEvent,
  ])

  const {
    cells,
    currentPlayer,
    winner,
    moveCount,
    swapAvailable,
    handleCellPress,
    handleRemoteCellPress,
    handleSwapOpeningMove,
    handleRemoteSwapOpeningMove,
    restartGame,
  } = useHex({
    boardSize,
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

  const handleHexCellPress = useCallback(async (
    cellId: number,
  ) => {
    if (!canLocalPlayerMove()) {
      console.log('not your turn', {
        localPlayer,
        currentPlayer,
      })

      return false
    }

    const moveWasApplied = handleCellPress(cellId)

    if (!moveWasApplied) return false
    if (!isConnected) return true

    await sendRoomEvent({
      type: 'HEX_MOVE',
      payload: {
        cellId,
      },
    })

    return true
  }, [
    currentPlayer,
    handleCellPress,
    isConnected,
    localPlayer,
    sendRoomEvent,
  ])

  const handleHexSwapOpeningMove = useCallback(async () => {
    if (!canLocalPlayerMove()) return false

    const swapWasApplied = handleSwapOpeningMove()

    if (!swapWasApplied) return false
    if (!isConnected) return true

    await sendRoomEvent({
      type: 'HEX_SWAP',
      payload: {
        swapped: true,
      },
    })

    return true
  }, [
    currentPlayer,
    handleSwapOpeningMove,
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
      type: 'HEX_RESET',
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
    if (incomingRoomEvent.type !== 'HEX_MOVE') return

    if (!isHexMovePayload(incomingRoomEvent.payload)) {
      setIncomingRoomEvent(null)
      return
    }

    handleRemoteCellPress(
      incomingRoomEvent.payload.cellId,
    )

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    handleRemoteCellPress,
    setIncomingRoomEvent,
  ])

  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'HEX_SWAP') return

    if (!isHexSwapPayload(incomingRoomEvent.payload)) {
      setIncomingRoomEvent(null)
      return
    }

    handleRemoteSwapOpeningMove()

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    handleRemoteSwapOpeningMove,
    setIncomingRoomEvent,
  ])

  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'HEX_RESET') return

    if (!isHexResetPayload(incomingRoomEvent.payload)) {
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
    if (!isConnected) {
      return `Current: ${
        currentPlayer === 'player1'
          ? 'Player 1'
          : 'Player 2'
      }`
    }

    if (localPlayer === 'waiting') {
      return `Spectating - Current: ${
        currentPlayer === 'player1'
          ? 'Player 1'
          : 'Player 2'
      }`
    }

    if (localPlayer === null) {
      return `Current: ${
        currentPlayer === 'player1'
          ? 'Player 1'
          : 'Player 2'
      }`
    }

    if (localPlayer === currentPlayerSlot) {
      return `Current: ${
        currentPlayer === 'player1'
          ? 'Player 1'
          : 'Player 2'
      } - Your turn`
    }

    return `Current: ${
      currentPlayer === 'player1'
        ? 'Player 1'
        : 'Player 2'
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

    boardSize,
    cells,
    currentPlayer,
    winner,
    moveCount,
    swapAvailable,
    turnText: getTurnText(),

    handleHexCellPress,
    handleHexSwapOpeningMove,
    handleResetGame,

    isPlayer2Ai,
    setIsPlayer2Ai,
  }
}