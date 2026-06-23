// src/context/RoomContext.tsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import type {
  Dispatch,
  ReactNode,
  SetStateAction,
} from 'react'
import * as signalR from '@microsoft/signalr'

import { SIGNALR_URL } from '@/constants/constants'
import { logToServer } from '@/utils/logToServer'

type GameKey = 'blackHole' | 'ticTacToe'

type RoomEvent = {
  type: string
  payload: unknown
}

export type ChatMessage = {
  username: string
  text: string
  createdAt: number
}

type RoomContextValue = {
  roomCode: string
  setRoomCode: Dispatch<SetStateAction<string>>

  isConnected: boolean
  setIsConnected: Dispatch<SetStateAction<boolean>>

  hasPeer: boolean
  setHasPeer: Dispatch<SetStateAction<boolean>>

  connection: signalR.HubConnection | null

  connectToChatRoom: () => Promise<void>
  disconnectFromChatRoom: () => Promise<void>

  getGameRoomId: (gameKey: GameKey) => string
  getChatRoomId: () => string

  username: string
  setUsername: Dispatch<SetStateAction<string>>

  chatMessages: ChatMessage[]
  sendChatMessage: (text: string) => Promise<void>
}



const RoomContext =
  createContext<RoomContextValue | null>(null)

type Props = {
  children: ReactNode
}

// helper user uuid
const createGuestUsername = () => {
  const randomPart = Math
    .random()
    .toString(36)
    .slice(2, 8)

  return `user-${randomPart}`
}

export const RoomProvider = ({
  children,
}: Props) => {
  const [roomCode, setRoomCode] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [hasPeer, setHasPeer] = useState(false)

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)

  const [username, setUsername] = useState(createGuestUsername)

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  const getGameRoomId = (gameKey: GameKey) => {
    const cleanRoomCode = roomCode.trim()

    if (!cleanRoomCode) {
      return ''
    }

    if (gameKey === 'blackHole') {
      return `penAndPaper-bh-${cleanRoomCode}`
    }

    return `penAndPaper-ttt-${cleanRoomCode}`
  }

  const getChatRoomId = () => {
    const cleanRoomCode = roomCode.trim()

    if (!cleanRoomCode) {
      return ''
    }

    return `penAndPaper-chat-${cleanRoomCode}`
  }

  const connectToChatRoom = async () => {
    if (!roomCode.trim()) {
      console.log('no room code')
      return
    }

    if (connection) {
      console.log('already connected')
      return
    }

    const chatRoomId = getChatRoomId()

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL)
      .withAutomaticReconnect()
      .build()

    newConnection.on('RoomUsers', (count: number) => {
      console.log('RoomUsers:', count)
      setHasPeer(count >= 2)
    })

    newConnection.onreconnecting((err) => {
      setIsConnected(false)

      if (err) {
        logToServer(
          `SIGNALR_RECONNECTING_ERROR: ${err.message}`,
        )
      }
    })

    newConnection.onreconnected(() => {
      setIsConnected(true)
    })

    newConnection.onclose((err) => {
      setIsConnected(false)
      setHasPeer(false)
      setConnection(null)

      if (err) {
        logToServer(
          `SIGNALR_CLOSE_ERROR: ${err.message}`,
        )
      }
    })

    newConnection.on('ReceiveRoomMessage', (message: string) => {
      try {
        const event = JSON.parse(message) as RoomEvent

        if (event.type !== 'CHAT_MESSAGE') {
          return
        }

        const payload = event.payload as ChatMessage

        setChatMessages((prev) => [
          ...prev,
          payload,
        ])

        console.log(
          'received chat:',
          payload.username,
          payload.text,
        )
      } catch {
        logToServer(
          `INVALID_ROOM_MESSAGE: ${message}`,
        )
      }
    })

    try {
      await newConnection.start()

      setConnection(newConnection)
      setIsConnected(true)

      await newConnection.invoke(
        'JoinRoom',
        chatRoomId,
      )

      console.log('joined room:', chatRoomId)
      logToServer(`joined room ${chatRoomId}`)
    } catch (err) {
      setConnection(null)
      setIsConnected(false)
      setHasPeer(false)

      if (err instanceof Error) {
        logToServer(
          `SIGNALR_CONNECT_ERROR: ${err.message}`,
        )
      } else {
        logToServer('SIGNALR_CONNECT_UNKNOWN_ERROR')
      }
    }
  }

  const sendChatMessage = async (
    text: string,
  ) => {
    if (!connection) {
      console.log('no connection')
      return
    }

    const cleanText = text.trim()

    if (!cleanText) {
      return
    }

    const chatRoomId = getChatRoomId()

    if (!chatRoomId) {
      console.log('no chat room')
      return
    }

    const chatMessage: ChatMessage = {
      username,
      text: cleanText,
      createdAt: Date.now(),
    }

    const event: RoomEvent = {
      type: 'CHAT_MESSAGE',
      payload: chatMessage,
    }

    try {
      await connection.invoke(
        'SendToRoom',
        chatRoomId,
        JSON.stringify(event),
      )

      // Επειδή το backend στέλνει στους OthersInGroup,
      // ο sender δεν παίρνει πίσω το δικό του μήνυμα.
      setChatMessages((prev) => [
        ...prev,
        chatMessage,
      ])

      logToServer(
        `sent chat message to ${chatRoomId}`,
      )
    } catch (err) {
      if (err instanceof Error) {
        logToServer(
          `SEND_CHAT_ERROR: ${err.message}`,
        )
        return
      }

      logToServer('SEND_CHAT_UNKNOWN_ERROR')
    }
  }

  const disconnectFromChatRoom = async () => {
    if (!connection) return

    const chatRoomId = getChatRoomId()

    try {
      if (chatRoomId) {
        await connection.invoke(
          'LeaveRoom',
          chatRoomId,
        )
      }

      await connection.stop()
    } catch (err) {
      console.log(err)
    }

    setConnection(null)
    setIsConnected(false)
    setHasPeer(false)
  }

  useEffect(() => {
    return () => {
      connection?.stop().catch(console.log)
    }
  }, [connection])

  return (
    <RoomContext.Provider
      value={{
        roomCode,
        setRoomCode,

        isConnected,
        setIsConnected,

        hasPeer,
        setHasPeer,

        connection,

        connectToChatRoom,
        disconnectFromChatRoom,

        getGameRoomId,
        getChatRoomId,

        username,
        setUsername,

        chatMessages,
        sendChatMessage,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export const useRoomContext = () => {
  const context = useContext(RoomContext)

  if (!context) {
    throw new Error(
      'useRoomContext must be used inside RoomProvider',
    )
  }

  return context
}