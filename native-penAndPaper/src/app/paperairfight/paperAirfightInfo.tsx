import { Pressable, ScrollView, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useContext } from 'react'

import { ThemeContext } from '@/context/ThemeContext'
import { createInfoStyles } from '@/styles/info.styles'
import Navbar from '@/layout/Navbar'

const PaperAirfightInfo = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createInfoStyles(colors)

  return (
    <View style={styles.screen}>
      <Navbar
        roomId=''
        setRoomId={() => { }}
        username=''
        setUsername={() => { }}
        handleConnectSocket={async () => { }}
        handleDisconnectSocket={async () => { }}
        isConnected={false}
        hasPeer={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backLink}
          >
            <Text style={styles.backText}>
              ← Back to game
            </Text>
          </Pressable>

          <Text style={styles.title}>
            Paper Airfight
          </Text>

          <Text style={styles.paragraph}>
            Paper Airfight is inspired by old pen-and-paper games where players
            draw flying objects, shoot by estimating direction and force, and try
            to hit the opponent or reach a target.
          </Text>

          <Text style={styles.sectionTitle}>
            Goal
          </Text>

          <Text style={styles.paragraph}>
            Each player controls a small paper plane.
          </Text>

          <Text style={styles.paragraph}>
            The goal is to either hit the opponent&apos;s plane or reach the
            enemy goal area.
          </Text>

          <Text style={styles.sectionTitle}>
            Players
          </Text>

          <Text style={styles.paragraph}>
            Player X starts from one side of the board.
          </Text>

          <Text style={styles.paragraph}>
            Player O starts from the opposite side.
          </Text>

          <Text style={styles.paragraph}>
            Players take turns shooting their own plane.
          </Text>

          <Text style={styles.sectionTitle}>
            How to move
          </Text>

          <Text style={styles.paragraph}>
            Select one of your planes.
          </Text>

          <Text style={styles.paragraph}>
            Pull the slingshot control backwards to choose power and direction.
          </Text>

          <Text style={styles.paragraph}>
            Release to launch the plane. The plane moves in the opposite
            direction of your pull.
          </Text>

          <Text style={styles.sectionTitle}>
            Trails
          </Text>

          <Text style={styles.paragraph}>
            Every shot leaves a trail line behind the plane.
          </Text>

          <Text style={styles.paragraph}>
            These trails make the game feel closer to a paper notebook game,
            where previous moves remain visible.
          </Text>

          <Text style={styles.sectionTitle}>
            Winning
          </Text>

          <Text style={styles.paragraph}>
            You win if your plane reaches the opponent&apos;s goal area.
          </Text>

          <Text style={styles.paragraph}>
            You can also win by hitting or eliminating all enemy planes.
          </Text>

          <Text style={styles.sectionTitle}>
            Local play
          </Text>

          <Text style={styles.paragraph}>
            In local play, the same device can be used by both players.
          </Text>

          <Text style={styles.paragraph}>
            You can also enable AI for Player O, so you can test the game alone.
          </Text>

          <Text style={styles.sectionTitle}>
            AI
          </Text>

          <Text style={styles.paragraph}>
            The AI chooses legal shots automatically.
          </Text>

          <Text style={styles.paragraph}>
            It tries to prefer useful moves, such as moving toward the goal or
            hitting an enemy plane, but it is not meant to be a perfect strategy
            engine.
          </Text>

          <Text style={styles.sectionTitle}>
            Multiplayer
          </Text>

          <Text style={styles.paragraph}>
            Multiplayer works through room codes. Two devices enter the same
            room code and connect to the same online room.
          </Text>

          <Text style={styles.paragraph}>
            Player 1 controls X. Player 2 controls O. Extra connected devices
            can watch as spectators.
          </Text>

          <Text style={styles.paragraph}>
            The backend is a reusable SignalR relay server. It does not know the
            rules of Paper Airfight. It only forwards game events between
            connected devices.
          </Text>

          <Text style={styles.sectionTitle}>
            Current note
          </Text>

          <Text style={styles.paragraph}>
            This is a lightweight digital adaptation, not a physics simulator.
            The focus is on fast turns, simple controls, and a pen-and-paper
            feeling.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default PaperAirfightInfo