import { useContext } from 'react'
import { View, Pressable, Text } from 'react-native'
import { router } from 'expo-router'
import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'

export default function Index() {
  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)

  return (
    <View style={globalStyles.screen}>
      <Navbar
        roomId=''
        setRoomId={() => { }}
        handleConnectSocket={async () => { }}
        isConnected={false}
        hasPeer={false}
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
      </View>
    </View>
  )
}