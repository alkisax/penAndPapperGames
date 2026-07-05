// native-penAndPaper/src/hooks/imparium/useImpariumMultiplayer.ts

import {
  useEffect,
  useRef,
} from 'react'

import { useRoomContext } from '@/context/RoomContext'
import {
  useImparium,
} from '@/hooks/imparium/useImparium'

import type {
  ImpariumMove,
  ImpariumPlayer,
} from '@/hooks/imparium/useImparium'

type ImpariumMovePayload = {
  eventId: string
  senderClientId: string
  senderName: string
  player: ImpariumPlayer
  move: ImpariumMove
}

type ImpariumResetPayload = {
  eventId: string
  senderClientId: string
  senderName: string
}

type ImpariumRoomEvent =
  | {
      type: 'IMPARIUM_MOVE'
      payload: ImpariumMovePayload
    }
  | {
      type: 'IMPARIUM_RESET'
      payload: ImpariumResetPayload
    }

type ResetSource = 'manual' | 'remote'

const createClientId = () => {
  return `imparium-client-${Date.now()}-${Math.random()}`
}

const createEventId = () => {
  return `imparium-event-${Date.now()}-${Math.random()}`
}

const getImpariumLocalPlayer = (
  localPlayer: unknown,
): ImpariumPlayer | null => {
  if (localPlayer === 'player1') return 'player1'
  if (localPlayer === 'player2') return 'player2'

  if (localPlayer === 1) return 'player1'
  if (localPlayer === 2) return 'player2'

  return null
}

export const useImpariumMultiplayer = () => {
  const {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    localPlayer,
    connectToChatRoom,
    disconnectFromChatRoom,
    incomingRoomEvent,
    setIncomingRoomEvent,
    sendRoomEvent,
  } = useRoomContext()

  const clientIdRef = useRef(createClientId())
  const processedEventIdsRef = useRef<string[]>([])

  const imparium = useImparium({
    enableAi: !isConnected,
  })

  const impariumLocalPlayer =
    getImpariumLocalPlayer(localPlayer)

  const canLocalPlayerAct =
    !isConnected ||
    impariumLocalPlayer === imparium.currentPlayer

  const markEventAsProcessed = (
    eventId: string,
  ) => {
    processedEventIdsRef.current = [
      ...processedEventIdsRef.current,
      eventId,
    ].slice(-40)
  }

  const hasProcessedEvent = (
    eventId: string,
  ) => {
    return processedEventIdsRef.current.includes(eventId)
  }

  const handleImpariumCellPress = (
    row: number,
    col: number,
    cellId: string,
  ) => {
    if (isConnected && !canLocalPlayerAct) {
      return false
    }

    const previousSelectedCellId =
      imparium.selectedCellId

    const playerBeforeMove =
      imparium.currentPlayer

    const moveWasApplied =
      imparium.handleCellPress(
        row,
        col,
        cellId,
      )

    if (!moveWasApplied) return false

    // First click only selects a cell.
    // We send online event only after the second valid domino cell.
    if (
      !isConnected ||
      !previousSelectedCellId ||
      previousSelectedCellId === cellId
    ) {
      return true
    }

    const move: ImpariumMove = {
      firstCellId: previousSelectedCellId,
      secondCellId: cellId,
    }

    sendRoomEvent({
      type: 'IMPARIUM_MOVE',
      payload: {
        eventId: createEventId(),
        senderClientId: clientIdRef.current,
        senderName: username,
        player: playerBeforeMove,
        move,
      },
    })

    return true
  }

  const handleResetGame = (
    source: ResetSource = 'manual',
  ) => {
    imparium.restartGame()

    if (!isConnected) return
    if (source !== 'manual') return

    sendRoomEvent({
      type: 'IMPARIUM_RESET',
      payload: {
        eventId: createEventId(),
        senderClientId: clientIdRef.current,
        senderName: username,
      },
    })
  }

  useEffect(() => {
    if (!incomingRoomEvent) return

    const event =
      incomingRoomEvent as ImpariumRoomEvent

    if (
      event.type !== 'IMPARIUM_MOVE' &&
      event.type !== 'IMPARIUM_RESET'
    ) {
      return
    }

    if (hasProcessedEvent(event.payload.eventId)) {
      setIncomingRoomEvent(null)
      return
    }

    markEventAsProcessed(event.payload.eventId)

    if (
      event.payload.senderClientId ===
      clientIdRef.current
    ) {
      setIncomingRoomEvent(null)
      return
    }

    if (event.type === 'IMPARIUM_RESET') {
      handleResetGame('remote')
      setIncomingRoomEvent(null)
      return
    }

    imparium.applyImpariumMove(
      event.payload.move,
      event.payload.player,
    )

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
  ])

  const onlineTurnText = isConnected
    ? impariumLocalPlayer
      ? canLocalPlayerAct
        ? `${imparium.turnText} - your turn`
        : `${imparium.turnText} - waiting`
      : `${imparium.turnText} - spectating`
    : imparium.turnText

  return {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,

    cells: imparium.cells,
    currentPlayer: imparium.currentPlayer,
    selectedCellId: imparium.selectedCellId,

    gameOver: imparium.gameOver,
    winner: imparium.winner,
    score: imparium.score,
    turnText: onlineTurnText,

    isPlayer2Ai: isConnected
      ? false
      : imparium.isPlayer2Ai,

    setIsPlayer2Ai: imparium.setIsPlayer2Ai,

    canLocalPlayerAct,

    handleImpariumCellPress,
    handleResetGame,
  }
}