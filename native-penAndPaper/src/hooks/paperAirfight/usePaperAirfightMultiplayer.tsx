import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { AppColors } from '@/styles/global'
import { useRoomContext } from '@/context/RoomContext'
import {
  ShotResult,
  usePaperAirfight,
} from '@/hooks/paperAirfight/usePaperAirfight'

type PaperAirfightShotPayload = {
  pieceId: string
  power: number
  angle: number
}

type PaperAirfightResetPayload = {
  reason: 'manual' | 'player-left'
}

type Props = {
  colors: AppColors
}

// Ελέγχει αν το incoming payload είναι σωστό shot payload.
const isPaperAirfightShotPayload = (
  payload: unknown,
): payload is PaperAirfightShotPayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return (
    typeof data.pieceId === 'string' &&
    typeof data.power === 'number' &&
    typeof data.angle === 'number'
  )
}

// Ελέγχει αν το incoming payload είναι σωστό reset payload.
const isPaperAirfightResetPayload = (
  payload: unknown,
): payload is PaperAirfightResetPayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return (
    data.reason === 'manual' ||
    data.reason === 'player-left'
  )
}

export const usePaperAirfightMultiplayer = ({
  colors,
}: Props) => {
  const [isOAi, setIsOAi] = useState(false)
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
    boardWidth,
    boardHeight,
    power,
    angle,
    currentPlayer,
    selectedPieceId,
    selectedPiece,
    pieces,
    ghostPieces,
    trailLines,
    isAnimating,
    handleSelectPiece,
    handleShotForPiece,
    restartGame,
  } = usePaperAirfight({
    colors,
    isOAi: !isConnected && isOAi,
  })

  // x = Player 1
  // o = Player 2
  const currentPlayerSlot =
    currentPlayer === 'x'
      ? 1
      : 2

  // Offline: παίζεις και τους δύο παίκτες.
  // Online: παίζεις μόνο όταν είναι η σειρά σου.
  const canLocalPlayerMove = () => {
    if (!isConnected) return true
    if (localPlayer === null) return false
    if (localPlayer === 'waiting') return false

    return localPlayer === currentPlayerSlot
  }

  // Select μόνο αν είναι δική σου σειρά.
  const handlePaperAirfightSelectPiece = useCallback((
    pieceId: string,
  ) => {
    if (!canLocalPlayerMove()) return

    handleSelectPiece(pieceId)
  }, [
    currentPlayerSlot,
    handleSelectPiece,
    isConnected,
    localPlayer,
  ])

  // Local shot + broadcast.
  const handlePaperAirfightShot = useCallback(async (
    result: ShotResult,
  ) => {
    if (!canLocalPlayerMove()) return false
    if (!selectedPieceId) return false

    const moveWasApplied = handleShotForPiece(
      selectedPieceId,
      result,
    )

    if (!moveWasApplied) return false
    if (!isConnected) return true

    await sendRoomEvent({
      type: 'PAPER_AIRFIGHT_SHOT',
      payload: {
        pieceId: selectedPieceId,
        power: result.power,
        angle: result.angle,
      },
    })

    return true
  }, [
    currentPlayerSlot,
    handleShotForPiece,
    isConnected,
    localPlayer,
    selectedPieceId,
    sendRoomEvent,
  ])

  // Reset local + broadcast.
  const handleResetGame = useCallback(async (
    reason: 'manual' | 'player-left' = 'manual',
  ) => {
    restartGame()

    if (!isConnected) return

    await sendRoomEvent({
      type: 'PAPER_AIRFIGHT_RESET',
      payload: {
        reason,
      },
    })
  }, [
    isConnected,
    restartGame,
    sendRoomEvent,
  ])

  // Incoming shot από άλλο client.
  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'PAPER_AIRFIGHT_SHOT') return

    if (!isPaperAirfightShotPayload(incomingRoomEvent.payload)) {
      setIncomingRoomEvent(null)
      return
    }

    handleShotForPiece(
      incomingRoomEvent.payload.pieceId,
      {
        power: incomingRoomEvent.payload.power,
        angle: incomingRoomEvent.payload.angle,
      },
    )

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    handleShotForPiece,
    setIncomingRoomEvent,
  ])

  // Incoming reset από άλλο client.
  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'PAPER_AIRFIGHT_RESET') return

    if (!isPaperAirfightResetPayload(incomingRoomEvent.payload)) {
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

  // Αν φύγει παίκτης, reset τοπικά.
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
      return `Current player: ${currentPlayer.toUpperCase()}`
    }

    if (localPlayer === 'waiting') {
      return `Spectating - Current player: ${currentPlayer.toUpperCase()}`
    }

    if (localPlayer === null) {
      return `Current player: ${currentPlayer.toUpperCase()}`
    }

    if (localPlayer === currentPlayerSlot) {
      return `Current player: ${currentPlayer.toUpperCase()} - It's your turn`
    }

    return `Current player: ${currentPlayer.toUpperCase()} - Waiting`
  }

  console.log('AI toggle state', {
  isOAi,
  isConnected,
  effectiveAi: !isConnected && isOAi,
})

  return {
    // Room
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

    // Game
    boardWidth,
    boardHeight,
    power,
    angle,
    currentPlayer,
    selectedPieceId,
    selectedPiece,
    pieces,
    ghostPieces,
    trailLines,
    isAnimating,
    turnText: getTurnText(),

    // Actions
    handlePaperAirfightSelectPiece,
    handlePaperAirfightShot,
    handleResetGame,
    isOAi,
    setIsOAi,
  }
}