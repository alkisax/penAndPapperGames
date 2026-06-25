// src/app/_layout.tsx

import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider } from '@/context/ThemeContext'
import { RoomProvider } from '@/context/RoomContext'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RoomProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </RoomProvider>
      </ThemeProvider>
    </GestureHandlerRootView>

  )
}