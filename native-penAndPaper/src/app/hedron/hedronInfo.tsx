import {
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { router } from 'expo-router'
import { useContext } from 'react'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createInfoStyles } from '@/styles/info.styles'

const HEDRON_VIDEO_URL =
  'https://www.youtube.com/watch?v=z39G02bt6A4'

const HedronInfo = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createInfoStyles(colors)

  const openVideo = async () => {
    await Linking.openURL(HEDRON_VIDEO_URL)
  }

  return (
    <View style={styles.screen}>
      <Navbar
        roomId=''
        setRoomId={() => {}}
        username=''
        setUsername={() => {}}
        handleConnectSocket={async () => {}}
        handleDisconnectSocket={async () => {}}
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
            Hedron
          </Text>

          <Text style={styles.paragraph}>
            Hedron is a geometric pen-and-paper strategy game for two players.
            Players take turns claiming edges on a board made of pentagonal
            regions.
          </Text>

          <Text style={styles.sectionTitle}>
            Goal
          </Text>

          <Text style={styles.paragraph}>
            The goal is to win more points than your opponent by claiming
            pentagonal regions on the board.
          </Text>

          <Text style={styles.sectionTitle}>
            How to play
          </Text>

          <Text style={styles.paragraph}>
            Players take turns choosing one unclaimed line segment on the board.
          </Text>

          <Text style={styles.paragraph}>
            In this app, Player X and Player O alternate turns. Tap an empty
            edge to mark it with your symbol.
          </Text>

          <Text style={styles.sectionTitle}>
            Claiming a region
          </Text>

          <Text style={styles.paragraph}>
            Every region on the board is a pentagon with five edges.
          </Text>

          <Text style={styles.paragraph}>
            When a player owns three of the five edges of a pentagon, that
            player claims the region.
          </Text>

          <Text style={styles.paragraph}>
            Claimed regions are colored with the player&apos;s color. The number
            inside the region is its point value.
          </Text>

          <Text style={styles.sectionTitle}>
            Outer and inner regions
          </Text>

          <Text style={styles.paragraph}>
            Some regions visually contain other regions. For scoring, each
            region is counted separately.
          </Text>

          <Text style={styles.paragraph}>
            Owning the outer region does not automatically give a player any of
            the inner regions.
          </Text>

          <Text style={styles.sectionTitle}>
            Scoring
          </Text>

          <Text style={styles.paragraph}>
            When all regions have been claimed, each player adds the values of
            their claimed regions.
          </Text>

          <Text style={styles.rulesExample}>
            Example:{'\n'}
            X: 3 + 12 + 5 = 20{'\n'}
            O: 7 + 9 = 16
          </Text>

          <Text style={styles.paragraph}>
            The player with the higher total score wins. If both totals are
            equal, the game is a draw.
          </Text>

          <Text style={styles.sectionTitle}>
            App modes
          </Text>

          <Text style={styles.paragraph}>
            The app supports local two-player play on one device.
          </Text>

          <Text style={styles.paragraph}>
            Player O can also be controlled by AI in offline mode. The AI looks
            for moves that score points immediately or block the opponent from
            scoring on their next move.
          </Text>

          <Text style={styles.sectionTitle}>
            Multiplayer
          </Text>

          <Text style={styles.paragraph}>
            Multiplayer works through room codes. Players enter the same room
            code and connect to the same online room.
          </Text>

          <Text style={styles.paragraph}>
            The first connected device controls X. The second connected device
            controls O. Extra connected devices can watch as spectators.
          </Text>

          <Text style={styles.paragraph}>
            The backend is a reusable SignalR relay server. It does not know the
            rules of Hedron. It only sends room events between connected
            devices.
          </Text>

          <Text style={styles.sectionTitle}>
            Inspiration
          </Text>

          <Text style={styles.paragraph}>
            This digital version was inspired by a video explanation of Hedron.
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

export default HedronInfo