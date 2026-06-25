// src/app/index.tsx

import { useContext } from 'react'
import { View, Pressable, Text } from 'react-native'
import { router } from 'expo-router'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { useRoomContext } from '@/context/RoomContext'
import ChatBox from '@/components/chat/ChatBox'

export default function Index() {
  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)

  const {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,
    chatMessages,
    sendChatMessage,
  } = useRoomContext()

  return (
    <View style={globalStyles.screen}>
      <Navbar
        roomId={roomCode}
        setRoomId={setRoomCode}
        username={username}
        setUsername={setUsername}
        handleConnectSocket={connectToChatRoom}
        handleDisconnectSocket={disconnectFromChatRoom}
        isConnected={isConnected}
        hasPeer={hasPeer}
      />

      <View style={globalStyles.centerContent}>
        <Pressable
          style={globalStyles.primaryButton}
          onPress={() => router.push('/blackHole/blackHole')}
        >
          <Text style={globalStyles.primaryButtonText}>
            Black Hole
          </Text>
        </Pressable>

        <Pressable
          style={globalStyles.primaryButton}
          onPress={() => router.push('/pferdapfel/pferdapfel')}
        >
          <Text style={globalStyles.primaryButtonText}>
            Pferdappel
          </Text>
        </Pressable>

        <Pressable
          style={globalStyles.primaryButton}
          onPress={() => router.push('/slingshot/slingshot')}
        >
          <Text style={globalStyles.primaryButtonText}>
            Slingshot Test
          </Text>
        </Pressable>

        <Pressable
          style={globalStyles.primaryButton}
          onPress={() => router.push('/paperAirfight/paperAirfight')}
        >
          <Text style={globalStyles.primaryButtonText}>
            Paper Airfight
          </Text>
        </Pressable>
      </View>
    </View>
  )
}