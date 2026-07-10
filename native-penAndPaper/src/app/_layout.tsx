// src/app/_layout.tsx

import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider } from '@/context/ThemeContext'
import { RoomProvider } from '@/context/RoomContext'
import AdsBanner from '@/ads/AdsBanner'
import { View } from 'react-native'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RoomProvider>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </View>

            <AdsBanner />
          </View>
        </RoomProvider>
      </ThemeProvider>
    </GestureHandlerRootView>

  )
}