import {
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { router } from 'expo-router'
import { useContext } from 'react'

import { ThemeContext } from '@/context/ThemeContext'
import { createInfoStyles } from '@/styles/info.styles'
import Navbar from '@/layout/Navbar'

const HEX_VIDEO_URL =
  'https://www.youtube.com/watch?v=z39G02bt6A4'

const HexInfo = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createInfoStyles(colors)

  const openVideo = async () => {
    await Linking.openURL(HEX_VIDEO_URL)
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
            Hex
          </Text>

          <Text style={styles.paragraph}>
            Hex is a two-player connection strategy game played on a board of
            hexagonal cells. Each player tries to build an unbroken chain
            between their two opposite sides of the board.
          </Text>

          <Text style={styles.sectionTitle}>
            How to draw the board on paper
          </Text>

          <Text style={styles.paragraph}>
            Draw a diamond-shaped board made of hexagons. This app uses a 9 by
            9 board, but the game can also be played on smaller or larger boards.
          </Text>

          <Text style={styles.rulesExample}>
            ◇ ◇ ◇ ◇ ◇ ◇ ◇ ◇ ◇{'\n'}
             ◇ ◇ ◇ ◇ ◇ ◇ ◇ ◇ ◇{'\n'}
              ◇ ◇ ◇ ◇ ◇ ◇ ◇ ◇ ◇
          </Text>

          <Text style={styles.paragraph}>
            Mark two opposite sides for Player 1 and the other two opposite
            sides for Player 2.
          </Text>

          <Text style={styles.sectionTitle}>
            Players
          </Text>

          <Text style={styles.paragraph}>
            Player 1 tries to connect the left side of the board to the right
            side.
          </Text>

          <Text style={styles.paragraph}>
            Player 2 tries to connect the top side of the board to the bottom
            side.
          </Text>

          <Text style={styles.sectionTitle}>
            Turn order
          </Text>

          <Text style={styles.paragraph}>
            Players take turns placing one stone on any empty hex.
          </Text>

          <Text style={styles.paragraph}>
            Once a hex is occupied, it cannot be used again.
          </Text>

          <Text style={styles.sectionTitle}>
            Winning
          </Text>

          <Text style={styles.paragraph}>
            Player 1 wins by creating a continuous connected path from the left
            side to the right side.
          </Text>

          <Text style={styles.paragraph}>
            Player 2 wins by creating a continuous connected path from the top
            side to the bottom side.
          </Text>

          <Text style={styles.paragraph}>
            Connections are made through neighboring hexes of the same color.
          </Text>

          <Text style={styles.sectionTitle}>
            Swap rule
          </Text>

          <Text style={styles.paragraph}>
            Because the first player has an advantage, this app uses the swap
            rule.
          </Text>

          <Text style={styles.paragraph}>
            Player 1 places the first stone. Then Player 2 may either place a
            normal stone, or swap and take Player 1&apos;s opening move.
          </Text>

          <Text style={styles.paragraph}>
            If Player 2 swaps, the first stone changes color and becomes Player
            2&apos;s stone. Then Player 1 plays the next turn.
          </Text>

          <Text style={styles.sectionTitle}>
            Strategy
          </Text>

          <Text style={styles.paragraph}>
            Hex is about building connections while blocking your opponent.
            A move can be useful even if it does not immediately touch your
            existing stones.
          </Text>

          <Text style={styles.paragraph}>
            Corners and central positions can become very important because
            they help connect multiple routes.
          </Text>

          <Text style={styles.sectionTitle}>
            App modes
          </Text>

          <Text style={styles.paragraph}>
            This version currently supports local two-player play on the same
            device.
          </Text>

          <Text style={styles.paragraph}>
            The app checks the winning path automatically after every move.
          </Text>

          <Text style={styles.sectionTitle}>
            Multiplayer
          </Text>

          <Text style={styles.paragraph}>
            Multiplayer can be added with the same reusable SignalR room system
            used by the other games in this app.
          </Text>

          <Text style={styles.paragraph}>
            The multiplayer version will send moves, swaps, and resets as room
            events between connected devices.
          </Text>

          <Text style={styles.sectionTitle}>
            Inspiration
          </Text>

          <Text style={styles.paragraph}>
            This digital version was inspired by a video explanation of Hex.
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

export default HexInfo