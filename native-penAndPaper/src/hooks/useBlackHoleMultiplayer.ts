// native-penAndPaper/src/hooks/useBlackHoleMultiplayer.ts

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useRoomContext } from '@/context/RoomContext'
import type { PlayerControllers } from '@/types/blackHole.types'
import { useBlackHole } from '@/hooks/useBlackHole'

type BlackHoleMovePayload = {
  cellId: number
}

type BlackHoleSettingsPayload = {
  numberOfPlayers: 2 | 3
}

type BlackHoleResetReason = 'manual' | 'player-left'

type BlackHoleResetPayload = {
  reason: BlackHoleResetReason
}

// Ελέγχει αν ένα unknown payload είναι valid BLACK_HOLE_MOVE payload.
const isBlackHoleMovePayload = (
  payload: unknown,
): payload is BlackHoleMovePayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return typeof data.cellId === 'number'
}

// Ελέγχει αν ένα unknown payload είναι valid BLACK_HOLE_SETTINGS payload.
const isBlackHoleSettingsPayload = (
  payload: unknown,
): payload is BlackHoleSettingsPayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return (
    data.numberOfPlayers === 2 ||
    data.numberOfPlayers === 3
  )
}

// Ελέγχει αν ένα unknown payload είναι valid BLACK_HOLE_RESET payload.
const isBlackHoleResetPayload = (
  payload: unknown,
): payload is BlackHoleResetPayload => {
  if (!payload || typeof payload !== 'object') return false

  const data = payload as Record<string, unknown>

  return (
    data.reason === 'manual' ||
    data.reason === 'player-left'
  )
}

export const useBlackHoleMultiplayer = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState<2 | 3>(2)

  const [playerControllers, setPlayerControllers] =
    useState<PlayerControllers>({
      player1: 'local',
      player2: 'local',
      player3: 'local',
    })

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

  // Στέλνει στα άλλα tabs την κίνηση που έκανε το AI στο δικό μου tab.
  const handleAiMoveBroadcast = useCallback(async (
    cellId: number,
  ) => {
    if (!isConnected) return

    await sendRoomEvent({
      type: 'BLACK_HOLE_MOVE',
      payload: {
        cellId,
      },
    })
  }, [
    isConnected,
    sendRoomEvent,
  ])

  const {
    currentPlayer,
    cells,
    handleCellPress,
    handleRemoteCellPress,
    winners,
    gameOver,
    playAgain,
    scores,
  } = useBlackHole({
    numberOfPlayers,
    playerControllers,
    onAiMove: handleAiMoveBroadcast,
  })

  // Offline επιτρέπει manual αλλαγή local / remote / ai.
  // Online δεν επιτρέπει manual αλλαγή, γιατί οι ρόλοι βγαίνουν από το room.
  const setPlayerController = useCallback((
    player: keyof PlayerControllers,
    value: PlayerControllers[keyof PlayerControllers],
  ) => {
    if (isConnected) return

    setPlayerControllers((prev) => ({
      ...prev,
      [player]: value,
    }))
  }, [isConnected])

  // Αλλάζει 2P / 3P και αν είμαστε online το στέλνει στα άλλα tabs.
  const handleNumberOfPlayersChange = useCallback(async (
    value: 2 | 3,
  ) => {
    setNumberOfPlayers(value)

    if (!isConnected) return

    await sendRoomEvent({
      type: 'BLACK_HOLE_SETTINGS',
      payload: {
        numberOfPlayers: value,
      },
    })
  }, [
    isConnected,
    sendRoomEvent,
  ])

  // Local board press.
  // Παίζει πρώτα στο δικό μου tab και μετά στέλνει το move στα άλλα tabs.
  const handleBlackHoleCellPress = useCallback(async (
    cellId: number,
  ) => {
    const moveWasApplied = handleCellPress(cellId)

    if (!moveWasApplied) return
    if (!isConnected) return

    await sendRoomEvent({
      type: 'BLACK_HOLE_MOVE',
      payload: {
        cellId,
      },
    })
  }, [
    handleCellPress,
    isConnected,
    sendRoomEvent,
  ])

  // Κάνει reset τοπικά και στέλνει reset event στα άλλα tabs.
  const handleResetGame = useCallback(async (
    reason: BlackHoleResetReason = 'manual',
  ) => {
    playAgain()

    if (!isConnected) return

    await sendRoomEvent({
      type: 'BLACK_HOLE_RESET',
      payload: {
        reason,
      },
    })
  }, [
    isConnected,
    playAgain,
    sendRoomEvent,
  ])

  // Text για το turn message.
  const getTurnText = () => {
    if (localPlayer === 'waiting') {
      return `Spectating - Now Playing: Player ${currentPlayer}`
    }

    if (localPlayer === null) {
      return `Now Playing: Player ${currentPlayer}`
    }

    if (localPlayer === currentPlayer) {
      return `Now Playing: Player ${currentPlayer} - It's your turn`
    }

    return `Now Playing: Player ${currentPlayer} - Waiting`
  }

  // Online controller assignment.
  // Κανονίζει ποιο tab παίζει ποιον player.
  useEffect(() => {
    if (!isConnected) return
    if (localPlayer === null) return

    // 4ο tab και πάνω: spectator.
    if (localPlayer === 'waiting') {
      setPlayerControllers({
        player1: 'remote',
        player2: 'remote',
        player3: 'remote',
      })
      return
    }

    // Special case:
    // 3P game με 2 ανθρώπινα tabs.
    // Το Player 3 τρέχει ως AI μόνο στο Tab 1.
    if (
      numberOfPlayers === 3 &&
      roomUsersCount === 2
    ) {
      setPlayerControllers({
        player1: localPlayer === 1 ? 'local' : 'remote',
        player2: localPlayer === 2 ? 'local' : 'remote',
        player3: localPlayer === 1 ? 'ai' : 'remote',
      })
      return
    }

    // Default online mode:
    // κάθε tab ελέγχει μόνο τον δικό του player.
    setPlayerControllers({
      player1: localPlayer === 1 ? 'local' : 'remote',
      player2: localPlayer === 2 ? 'local' : 'remote',
      player3: localPlayer === 3 ? 'local' : 'remote',
    })
  }, [
    isConnected,
    localPlayer,
    numberOfPlayers,
    roomUsersCount,
  ])

  // Receive remote move.
  // Όταν έρθει BLACK_HOLE_MOVE από άλλο tab, εφαρμόζεται τοπικά χωρίς broadcast.
  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'BLACK_HOLE_MOVE') return

    if (!isBlackHoleMovePayload(incomingRoomEvent.payload)) {
      return
    }

    handleRemoteCellPress(incomingRoomEvent.payload.cellId)

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    handleRemoteCellPress,
    setIncomingRoomEvent,
  ])

  // Receive settings.
  // Όταν άλλο tab αλλάξει 2P / 3P, το εφαρμόζουμε εδώ χωρίς να το ξαναστείλουμε.
  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'BLACK_HOLE_SETTINGS') return

    if (!isBlackHoleSettingsPayload(incomingRoomEvent.payload)) {
      return
    }

    setNumberOfPlayers(incomingRoomEvent.payload.numberOfPlayers)

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    setIncomingRoomEvent,
  ])

  // Receive reset.
  // Όταν άλλο tab κάνει reset, κάνουμε reset τοπικά χωρίς νέο broadcast.
  useEffect(() => {
    if (!incomingRoomEvent) return
    if (incomingRoomEvent.type !== 'BLACK_HOLE_RESET') return

    if (!isBlackHoleResetPayload(incomingRoomEvent.payload)) {
      return
    }

    playAgain()

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
    playAgain,
    setIncomingRoomEvent,
  ])

  // Reset when room users count goes down.
  // Πρόχειρη λύση: αν φύγει οποιοδήποτε tab, κάνουμε reset.
  // Αργότερα αυτό πρέπει να γίνει καλύτερα με participants/clientId list.
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
      handleResetGame('player-left')
    }

    previousRoomUsersCountRef.current = roomUsersCount
  }, [
    isConnected,
    localPlayer,
    roomUsersCount,
    handleResetGame,
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

    numberOfPlayers,
    playerControllers,
    setPlayerController,
    handleNumberOfPlayersChange,

    currentPlayer,
    cells,
    winners,
    gameOver,
    scores,
    turnText: getTurnText(),

    handleBlackHoleCellPress,
    handleResetGame,
  }
}