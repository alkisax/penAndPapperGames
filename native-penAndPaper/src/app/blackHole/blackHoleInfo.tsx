import { Linking, Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native'
import { router } from 'expo-router'
import { useContext } from 'react'

import { ThemeContext } from '@/context/ThemeContext'
import { COLORS, FONT_SIZE, RADIUS, SPACING, } from '@/styles/global'
import { createInfoStyles } from '@/styles/info.styles'
import Navbar from '@/layout/Navbar'

const BLACK_HOLE_VIDEO_URL =
  'https://www.youtube.com/watch?v=nrrMWiV1cpQ&list=PL4YNSBiTVKSYil3do47iAs7QfFRtTHJUr&index=13'

const BlackHoleInfo = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createInfoStyles(colors)

  const openVideo = async () => {
    await Linking.openURL(BLACK_HOLE_VIDEO_URL)
  }

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
            Black Hole
          </Text>

          <Text style={styles.paragraph}>
            Black Hole is a simple pen-and-paper strategy game. The goal is
            unusual: you do not want the highest score. The player with the
            lowest score at the end wins.
          </Text>

          <Text style={styles.sectionTitle}>
            How to draw the board on paper
          </Text>

          <Text style={styles.paragraph}>
            Draw a pyramid of circles in your notebook.
          </Text>

          <Text style={styles.paragraph}>
            For a 2-player game, draw 6 rows:
          </Text>

          <Text style={styles.rulesExample}>
            1 circle{'\n'}
            2 circles{'\n'}
            3 circles{'\n'}
            4 circles{'\n'}
            5 circles{'\n'}
            6 circles
          </Text>

          <Text style={styles.paragraph}>
            This creates 21 circles in total.
          </Text>

          <Text style={styles.sectionTitle}>
            2-player rules
          </Text>

          <Text style={styles.paragraph}>
            Each player uses a different color. Players alternate turns writing
            numbers into empty circles.
          </Text>

          <Text style={styles.paragraph}>
            Player 1 writes numbers from 1 to 10 in order. Player 2 also writes
            numbers from 1 to 10 in order.
          </Text>

          <Text style={styles.paragraph}>
            You can choose any empty circle. Your next number does not need to
            touch your previous number.
          </Text>

          <Text style={styles.paragraph}>
            When both players have written all their numbers, one circle remains
            empty. This final empty circle becomes the Black Hole.
          </Text>

          <Text style={styles.paragraph}>
            Each player adds the numbers they own that directly touch the Black
            Hole.
          </Text>

          <Text style={styles.paragraph}>
            The player with the lowest total wins.
          </Text>

          <Text style={styles.sectionTitle}>
            3-player rules
          </Text>

          <Text style={styles.paragraph}>
            For 3 players, add a seventh row to the pyramid:
          </Text>

          <Text style={styles.paragraph}>
            This creates 28 circles in total.
          </Text>

          <Text style={styles.paragraph}>
            The rules are the same, but each player writes numbers from 1 to 9.
            After all players finish, one circle remains empty and becomes the
            Black Hole.
          </Text>

          <Text style={styles.paragraph}>
            Again, each player sums the numbers touching the Black Hole. The
            lowest score wins.
          </Text>

          <Text style={styles.sectionTitle}>
            App modes
          </Text>

          <Text style={styles.paragraph}>
            This app supports local play with 2 or 3 players.
          </Text>

          <Text style={styles.paragraph}>
            A player can also be controlled by AI. This is useful if you want to
            test the game alone or fill a missing player.
          </Text>

          <Text style={styles.paragraph}>
            The AI chooses legal moves automatically. It is not meant to be a
            perfect strategy engine, but it makes the game playable without all
            players being present.
          </Text>

          <Text style={styles.sectionTitle}>
            Multiplayer
          </Text>

          <Text style={styles.paragraph}>
            Multiplayer works through room codes. Players enter the same room
            code and connect to the same online room.
          </Text>

          <Text style={styles.paragraph}>
            The app sends game events such as moves, settings changes, and
            resets between connected devices.
          </Text>

          <Text style={styles.paragraph}>
            The backend is a reusable SignalR relay server. It does not know the
            rules of Black Hole. It only sends room messages from one device to
            the others.
          </Text>

          <Text style={styles.sectionTitle}>
            Current multiplayer note
          </Text>

          <Text style={styles.paragraph}>
            In this version, player assignment is simple. The first connected
            device becomes Player 1, the second becomes Player 2, and the third
            becomes Player 3.
          </Text>

          <Text style={styles.paragraph}>
            Extra connected devices can watch as spectators.
          </Text>

          <Text style={styles.sectionTitle}>
            Inspiration
          </Text>

          <Text style={styles.paragraph}>
            This digital version was inspired by a pen-and-paper game explained
            in a The Tabletop Family youtube chanel video.
          </Text>

          <Pressable onPress={openVideo}>
            <Text style={styles.linkText}>
              Watch the video
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}



export default BlackHoleInfo