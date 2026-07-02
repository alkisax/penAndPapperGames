// native-penAndPaper\src\hooks\nab\useNabMultiplayer.ts
import { useEffect, useRef } from 'react'

import { useRoomContext } from '@/context/RoomContext'
import { useNab } from '@/hooks/nab/useNab'
import type { NabPlayer } from '@/utils/nab/nabGameUtils'

type NabMovePayload = {
  eventId: string
  senderClientId: string
  senderName: string
  player: NabPlayer
  fromCellId: number
  toCellId: number
}

type NabResetPayload = {
  eventId: string
  senderClientId: string
  senderName: string
}

type NabRoomEvent =
  | {
      type: 'NAB_MOVE'
      payload: NabMovePayload
    }
  | {
      type: 'NAB_RESET'
      payload: NabResetPayload
    }

type ResetSource = 'manual' | 'remote'

const createClientId = () => {
  return `nab-client-${Date.now()}-${Math.random()}`
}

const getNabLocalPlayer = (
  localPlayer: unknown,
): NabPlayer | null => {
  if (localPlayer === 'player1') return 'player1'
  if (localPlayer === 'player2') return 'player2'

  if (localPlayer === 1) return 'player1'
  if (localPlayer === 2) return 'player2'

  return null
}

export const useNabMultiplayer = () => {
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

  const nab = useNab({
    enableAi: !isConnected,
  })

  const nabLocalPlayer = getNabLocalPlayer(localPlayer)

  const canLocalPlayerAct =
    !isConnected ||
    nabLocalPlayer === nab.currentPlayer

  const markEventAsProcessed = (eventId: string) => {
    processedEventIdsRef.current = [
      ...processedEventIdsRef.current,
      eventId,
    ].slice(-40)
  }

  const hasProcessedEvent = (eventId: string) => {
    return processedEventIdsRef.current.includes(eventId)
  }

  const handleNabMoveAttempt = (
    fromCellId: number,
    toCellId: number,
  ) => {
    if (isConnected && !canLocalPlayerAct) return

    const player = nab.currentPlayer

    const moveWasApplied = nab.applyMove(
      fromCellId,
      toCellId,
      player,
    )

    if (!moveWasApplied) return

    if (!isConnected) return

    const eventId = `nab-move-${Date.now()}-${Math.random()}`

    sendRoomEvent({
      type: 'NAB_MOVE',
      payload: {
        eventId,
        senderClientId: clientIdRef.current,
        senderName: username,
        player,
        fromCellId,
        toCellId,
      },
    })
  }

  const handleResetGame = (
    source: ResetSource = 'manual',
  ) => {
    nab.handleResetGame()

    if (!isConnected) return
    if (source !== 'manual') return

    const eventId = `nab-reset-${Date.now()}-${Math.random()}`

    sendRoomEvent({
      type: 'NAB_RESET',
      payload: {
        eventId,
        senderClientId: clientIdRef.current,
        senderName: username,
      },
    })
  }

  useEffect(() => {
    if (!incomingRoomEvent) return

    const event = incomingRoomEvent as NabRoomEvent

    if (
      event.type !== 'NAB_MOVE' &&
      event.type !== 'NAB_RESET'
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

    if (event.type === 'NAB_RESET') {
      handleResetGame('remote')
      setIncomingRoomEvent(null)
      return
    }

    nab.applyMove(
      event.payload.fromCellId,
      event.payload.toCellId,
      event.payload.player,
    )

    setIncomingRoomEvent(null)
  }, [incomingRoomEvent])

  const onlineTurnText = isConnected
    ? nabLocalPlayer
      ? canLocalPlayerAct
        ? `${nab.turnText} - your turn`
        : `${nab.turnText} - waiting`
      : `${nab.turnText} - spectating`
    : nab.turnText

  return {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,

    cells: nab.cells,
    savedLines: nab.savedLines,
    usedCellIds: nab.usedCellIds,

    currentPlayer: nab.currentPlayer,
    winner: nab.winner,
    gameOver: nab.gameOver,
    resetVersion: nab.resetVersion,
    turnText: onlineTurnText,

    isPlayer2Ai: isConnected
      ? false
      : nab.isPlayer2Ai,
    setIsPlayer2Ai: nab.setIsPlayer2Ai,

    canLocalPlayerAct,

    handleNabMoveAttempt,
    handleResetGame,
  }
}