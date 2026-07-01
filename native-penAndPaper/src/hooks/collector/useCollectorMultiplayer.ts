import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { useRoomContext } from '@/context/RoomContext'
import { useCollector } from '@/hooks/collector/useCollector'

import type {
  CollectorMove,
  CollectorPlayer,
  CollectorSuggestedMove,
} from '@/hooks/collector/useCollector'

type CollectorRoomEvent =
  | {
      type: 'COLLECTOR_MOVE'
      payload: {
        eventId: string
        senderClientId: string
        senderName: string
        player: CollectorPlayer
        move: CollectorMove
      }
    }
  | {
      type: 'COLLECTOR_RESET'
      payload: {
        eventId: string
        senderClientId: string
        senderName: string
      }
    }

const createEventId = () => {
  return `${Date.now()}-${Math.random()}`
}

const createClientId = () => {
  return `${Date.now()}-${Math.random()}`
}

export const useCollectorMultiplayer = () => {
  const {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,
    incomingRoomEvent,
    sendRoomEvent,
  } = useRoomContext()

  const collector = useCollector()

  const {
    cells,
    currentPlayer,
    phase,
    gameOver,
    suggestedMove,
    markedCellIdThisTurn,
    handleCellPress,
    applyCollectorMove,
    restartGame,
  } = collector

  const clientIdRef = useRef(createClientId())

  const [localPlayer, setLocalPlayer] =
    useState<CollectorPlayer | null>(null)

  const [isPlayer2Ai, setIsPlayer2Ai] =
    useState(false)

  const aiMoveRef =
    useRef<CollectorSuggestedMove | null>(null)

  const processedEventIdsRef =
    useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!isConnected) {
      setLocalPlayer(null)
      return
    }

    if (localPlayer) return

    const timeoutId = setTimeout(() => {
      setLocalPlayer(
        hasPeer ? 'player2' : 'player1',
      )
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [
    isConnected,
    hasPeer,
    localPlayer,
  ])

  const sendCollectorEvent = (
    event: CollectorRoomEvent,
  ) => {
    if (!isConnected) return

    sendRoomEvent(event)
  }

  const canLocalPlayerAct = () => {
    if (gameOver) return false

    if (!isConnected) {
      return true
    }

    if (!localPlayer) {
      return false
    }

    return localPlayer === currentPlayer
  }

  const handleCollectorCellPress = (
    row: number,
    col: number,
    cellId: string,
  ) => {
    if (!canLocalPlayerAct()) return false

    const previousPhase = phase
    const previousMarkedCellId = markedCellIdThisTurn
    const playerBeforeMove = currentPlayer

    const moveWasApplied = handleCellPress(
      row,
      col,
      cellId,
    )

    if (!moveWasApplied) return false

    if (
      isConnected &&
      previousPhase === 'eliminate' &&
      previousMarkedCellId
    ) {
      const move: CollectorMove = {
        markCellId: previousMarkedCellId,
        blockCellId: cellId,
      }

      sendCollectorEvent({
        type: 'COLLECTOR_MOVE',
        payload: {
          eventId: createEventId(),
          senderClientId: clientIdRef.current,
          senderName: username,
          player: playerBeforeMove,
          move,
        },
      })
    }

    return true
  }

  const handleResetGame = (
    source: 'manual' | 'remote' = 'manual',
  ) => {
    restartGame()

    if (
      source === 'manual' &&
      isConnected
    ) {
      sendCollectorEvent({
        type: 'COLLECTOR_RESET',
        payload: {
          eventId: createEventId(),
          senderClientId: clientIdRef.current,
          senderName: username,
        },
      })
    }
  }

  useEffect(() => {
    if (!incomingRoomEvent) return

    const event = incomingRoomEvent as CollectorRoomEvent

    if (
      event.type !== 'COLLECTOR_MOVE' &&
      event.type !== 'COLLECTOR_RESET'
    ) {
      return
    }

    if (processedEventIdsRef.current.has(event.payload.eventId)) {
      return
    }

    processedEventIdsRef.current.add(event.payload.eventId)

    if (event.payload.senderClientId === clientIdRef.current) {
      return
    }

    if (event.type === 'COLLECTOR_RESET') {
      handleResetGame('remote')
      return
    }

    applyCollectorMove(
      event.payload.move,
      event.payload.player,
    )
  }, [
    incomingRoomEvent,
    applyCollectorMove,
  ])

  const isPlayer2AiTurn =
    isPlayer2Ai &&
    !isConnected &&
    currentPlayer === 'player2' &&
    !gameOver

  useEffect(() => {
    if (!isPlayer2AiTurn) return
    if (phase !== 'mark') return
    if (!suggestedMove) return

    aiMoveRef.current = suggestedMove

    const markCell = cells.find((cell) =>
      cell.id === suggestedMove.markCellId
    )

    if (!markCell) return

    const timeoutId = setTimeout(() => {
      handleCellPress(
        markCell.row,
        markCell.col,
        markCell.id,
      )
    }, 450)

    return () => clearTimeout(timeoutId)
  }, [
    isPlayer2AiTurn,
    phase,
    suggestedMove,
    cells,
    handleCellPress,
  ])

  useEffect(() => {
    if (!isPlayer2AiTurn) return
    if (phase !== 'eliminate') return
    if (!markedCellIdThisTurn) return

    const aiMove = aiMoveRef.current

    if (!aiMove) return

    const blockCell = cells.find((cell) =>
      cell.id === aiMove.blockCellId
    )

    if (!blockCell) return

    const timeoutId = setTimeout(() => {
      handleCellPress(
        blockCell.row,
        blockCell.col,
        blockCell.id,
      )

      aiMoveRef.current = null
    }, 450)

    return () => clearTimeout(timeoutId)
  }, [
    isPlayer2AiTurn,
    phase,
    markedCellIdThisTurn,
    cells,
    handleCellPress,
  ])

  const localPlayerText =
    !isConnected
      ? 'Local game'
      : !localPlayer
        ? 'Joining...'
        : localPlayer === 'player1'
          ? 'You are Blue'
          : 'You are Red'

  const turnText =
    gameOver
      ? 'Game over'
      : isConnected && !localPlayer
        ? 'Joining...'
        : isConnected && localPlayer !== currentPlayer
          ? currentPlayer === 'player1'
            ? 'Blue turn: waiting'
            : 'Red turn: waiting'
          : currentPlayer === 'player1'
            ? phase === 'mark'
              ? 'Blue: your turn'
              : 'Blue: eliminate adjacent cell'
            : isPlayer2Ai && !isConnected
              ? 'AI thinking...'
              : phase === 'mark'
                ? 'Red: your turn'
                : 'Red: eliminate adjacent cell'

  return {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,

    ...collector,

    localPlayer,
    localPlayerText,
    turnText,

    isPlayer2Ai,
    setIsPlayer2Ai,

    handleCollectorCellPress,
    handleResetGame,
  }
}