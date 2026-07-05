import {
  useEffect,
  useRef,
} from 'react'

import { useRoomContext } from '@/context/RoomContext'
import {
  useSnakeFight,
} from '@/hooks/snakefight/useSnakeFight'

import type {
  SnakeFightMove,
} from '@/hooks/snakefight/useSnakeFight'

import type {
  SnakeFightPlayer,
} from '@/components/svg/snakefight/SnakeFightBoardSvg'

type SnakeFightMovePayload = {
  eventId: string
  senderClientId: string
  senderName: string
  player: SnakeFightPlayer
  move: SnakeFightMove
}

type SnakeFightResetPayload = {
  eventId: string
  senderClientId: string
  senderName: string
}

type SnakeFightRoomEvent =
  | {
      type: 'SNAKE_FIGHT_MOVE'
      payload: SnakeFightMovePayload
    }
  | {
      type: 'SNAKE_FIGHT_RESET'
      payload: SnakeFightResetPayload
    }

type ResetSource = 'manual' | 'remote'

const createClientId = () => {
  return `snakefight-client-${Date.now()}-${Math.random()}`
}

const createEventId = () => {
  return `snakefight-event-${Date.now()}-${Math.random()}`
}

const getSnakeFightLocalPlayer = (
  localPlayer: unknown,
): SnakeFightPlayer | null => {
  if (localPlayer === 'player1') return 'player1'
  if (localPlayer === 'player2') return 'player2'

  if (localPlayer === 1) return 'player1'
  if (localPlayer === 2) return 'player2'

  return null
}

export const useSnakeFightMultiplayer = () => {
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

  const snakeFight = useSnakeFight({
    enableAi: !isConnected,
  })

  const snakeFightLocalPlayer =
    getSnakeFightLocalPlayer(localPlayer)

  const canLocalPlayerAct =
    !isConnected ||
    snakeFightLocalPlayer === snakeFight.currentPlayer

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

  const handleSnakeFightMoveAttempt = (
    fromDotId: string,
    toDotId: string,
  ) => {
    if (isConnected && !canLocalPlayerAct) {
      return false
    }

    const playerBeforeMove =
      snakeFight.currentPlayer

    const move: SnakeFightMove = {
      fromDotId,
      toDotId,
    }

    const moveWasApplied =
      snakeFight.applyMove(
        move,
        playerBeforeMove,
      )

    if (!moveWasApplied) return false

    if (!isConnected) return true

    sendRoomEvent({
      type: 'SNAKE_FIGHT_MOVE',
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
    snakeFight.resetGame()

    if (!isConnected) return
    if (source !== 'manual') return

    sendRoomEvent({
      type: 'SNAKE_FIGHT_RESET',
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
      incomingRoomEvent as SnakeFightRoomEvent

    if (
      event.type !== 'SNAKE_FIGHT_MOVE' &&
      event.type !== 'SNAKE_FIGHT_RESET'
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

    if (event.type === 'SNAKE_FIGHT_RESET') {
      handleResetGame('remote')
      setIncomingRoomEvent(null)
      return
    }

    snakeFight.applyMove(
      event.payload.move,
      event.payload.player,
    )

    setIncomingRoomEvent(null)
  }, [
    incomingRoomEvent,
  ])

  const onlineTurnText = isConnected
    ? snakeFightLocalPlayer
      ? canLocalPlayerAct
        ? `${snakeFight.turnText} - your turn`
        : `${snakeFight.turnText} - waiting`
      : `${snakeFight.turnText} - spectating`
    : snakeFight.turnText

  return {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,

    dots: snakeFight.dots,
    segments: snakeFight.segments,

    currentPlayer: snakeFight.currentPlayer,
    player1HeadDotId: snakeFight.player1HeadDotId,
    player2HeadDotId: snakeFight.player2HeadDotId,

    score: snakeFight.score,
    gameOver: snakeFight.gameOver,
    winner: snakeFight.winner,
    turnText: onlineTurnText,

    isPlayer2Ai: isConnected
      ? false
      : snakeFight.isPlayer2Ai,

    setIsPlayer2Ai: snakeFight.setIsPlayer2Ai,

    canLocalPlayerAct,

    handleMoveAttempt: handleSnakeFightMoveAttempt,
    resetGame: handleResetGame,
  }
}