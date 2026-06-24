// native-penAndPaper\src\hooks\pferdapfel\usePferdApfelMultiplayer.tsx

import {
  useCallback,
  useEffect,
  useRef,
} from 'react'

import { useRoomContext } from '@/context/RoomContext'
import { usePferdApfel } from '@/hooks/pferdapfel/usePferdApfel'

type PferdApfelMovePayload = {
  row: number
  col: number
  id: number
}

type PferdApfelResetPayload = {
  reason: 'manual' | 'player-left'
}

// Ελέγχει αν το incoming payload είναι σωστό move payload.
// Το χρειαζόμαστε γιατί το incomingRoomEvent.payload είναι unknown.
const isPferdApfelMovePayload = (
  payload: unknown,
): payload is PferdApfelMovePayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return (
    typeof data.row === 'number' &&
    typeof data.col === 'number' &&
    typeof data.id === 'number'
  )
}

// Ελέγχει αν το incoming payload είναι σωστό reset payload.
const isPferdApfelResetPayload = (
  payload: unknown,
): payload is PferdApfelResetPayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return (
    data.reason === 'manual' ||
    data.reason === 'player-left'
  )
}

export const usePferdApfelMultiplayer = () => {
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
    knights,
    blockedCells,
    winner,
    gameOver,
    handleCellPress,
    restartGame,
  } = usePferdApfel()

  // Μεταφράζουμε το currentPlayer του παιχνιδιού
  // σε player slot του RoomContext.
  //
  // blue = Player 1
  // red = Player 2
  const currentPlayerSlot =
    currentPlayer === 'blue'
      ? 1
      : 2

  // Αν είμαστε offline, επιτρέπουμε και στους δύο παίκτες να παίζουν από το ίδιο κινητό.
  // Αν είμαστε online, επιτρέπουμε click μόνο στον σωστό παίκτη.
  const canLocalPlayerMove = () => {
    if (!isConnected) return true
    if (localPlayer === null) return false
    if (localPlayer === 'waiting') return false

    return localPlayer === currentPlayerSlot
  }

  // Το βασικό click handler που θα δώσουμε στο Board.
  //
  // 1. Ελέγχει αν είναι η σειρά του local player.
  // 2. Παίζει local move μέσω usePferdApfel.
  // 3. Αν το move ήταν legal, το στέλνει στους άλλους μέσω SignalR.
  const handlePferdApfelCellPress = useCallback(async (
    row: number,
    col: number,
    id: number,
  ) => {
    if (!canLocalPlayerMove()) {
      console.log('not your turn', {
        localPlayer,
        currentPlayer,
      })

      return
    }

    const moveWasApplied = handleCellPress(
      row,
      col,
      id,
    )

    if (!moveWasApplied) return
    if (!isConnected) return

    await sendRoomEvent({
      type: 'PFERD_APFEL_MOVE',
      payload: {
        row,
        col,
        id,
      },
    })
  }, [
    currentPlayer,
    handleCellPress,
    isConnected,
    localPlayer,
    sendRoomEvent,
  ])

  // Reset local + broadcast reset στους άλλους.
  const handleResetGame = useCallback(async (
    reason: 'manual' | 'player-left' = 'manual',
  ) => {
    restartGame()

    if (!isConnected) return

    await sendRoomEvent({
      type: 'PFERD_APFEL_RESET',
      payload: {
        reason,
      },
    })
  }, [
    isConnected,
    restartGame,
    sendRoomEvent,
  ])

  // Εδώ ακούμε incoming multiplayer move.
  //
  // Όταν ο άλλος client κάνει move:
  // - το RoomContext λαμβάνει ReceiveRoomMessage
  // - το κάνει JSON.parse
  // - αν δεν είναι CHAT_MESSAGE το βάζει στο incomingRoomEvent
  // - εδώ το εφαρμόζουμε στο δικό μας local game state
  //
  // Δεν ξαναστέλνουμε event, αλλιώς θα γίνει loop.
  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'PFERD_APFEL_MOVE') return

    if (!isPferdApfelMovePayload(incomingRoomEvent.payload)) {
      setIncomingRoomEvent(null)
      return
    }

    handleCellPress(
      incomingRoomEvent.payload.row,
      incomingRoomEvent.payload.col,
      incomingRoomEvent.payload.id,
    )

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    handleCellPress,
    setIncomingRoomEvent,
  ])

  // Εδώ ακούμε reset από άλλο client.
  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'PFERD_APFEL_RESET') return

    if (!isPferdApfelResetPayload(incomingRoomEvent.payload)) {
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

  // Text για την οθόνη.
  const getTurnText = () => {
    if (!isConnected) {
      return `Current player: ${currentPlayer}`
    }

    if (localPlayer === 'waiting') {
      return `Spectating - Current player: ${currentPlayer}`
    }

    if (localPlayer === null) {
      return `Current player: ${currentPlayer}`
    }

    if (localPlayer === currentPlayerSlot) {
      return `Current player: ${currentPlayer} - It's your turn`
    }

    return `Current player: ${currentPlayer} - Waiting`
  }

  // Αν κάποιος φύγει από το room, κάνουμε reset τοπικά.
  // Πρόχειρη αλλά πρακτική λύση για v1.
  // Αργότερα μπορεί να γίνει καλύτερα με participants/clientId list.
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
    knights,
    blockedCells,
    winner,
    gameOver,
    turnText: getTurnText(),

    handlePferdApfelCellPress,
    handleResetGame,
  }
}