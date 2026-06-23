// src/app/_layout.tsx

import { Stack } from 'expo-router'
import { ThemeProvider } from '@/context/ThemeContext'
import { RoomProvider } from '@/context/RoomContext'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RoomProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </RoomProvider>
    </ThemeProvider>
  )
}