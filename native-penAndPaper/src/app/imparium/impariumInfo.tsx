// native-penAndPaper/src/app/imparium/impariumInfo.tsx

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

const IMPARIUM_ARTICLE_URL =
  'https://mathwithbaddrawings.com/2020/04/22/six-strategic-games-from-a-strange-and-bottomless-mind/'

const ImpariumInfo = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createInfoStyles(colors)

  const openArticle = async () => {
    await Linking.openURL(IMPARIUM_ARTICLE_URL)
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
            Imparium
          </Text>

          <Text style={styles.paragraph}>
            Imparium is a small abstract strategy game played on a square grid.
            Players place dominoes to create fences and try to claim enclosed
            regions.
          </Text>

          <Text style={styles.sectionTitle}>
            Goal
          </Text>

          <Text style={styles.paragraph}>
            The goal is to claim more squares than your opponent by the end of
            the game.
          </Text>

          <Text style={styles.paragraph}>
            Covered domino squares belong to nobody. Only claimed enclosed
            squares count for scoring.
          </Text>

          <Text style={styles.sectionTitle}>
            Board
          </Text>

          <Text style={styles.paragraph}>
            This version is played on a 6 × 6 grid.
          </Text>

          <Text style={styles.paragraph}>
            Blue is Player 1. Red is Player 2.
          </Text>

          <Text style={styles.sectionTitle}>
            How to play
          </Text>

          <Text style={styles.paragraph}>
            Players take turns covering two adjacent empty squares, like placing
            a domino.
          </Text>

          <Text style={styles.rulesExample}>
            1. Select one empty square.{'\n'}
            2. Select a second empty square next to it.{'\n'}
            3. The two squares become covered.
          </Text>

          <Text style={styles.paragraph}>
            Dominoes may be placed horizontally or vertically. Diagonal dominoes
            are not allowed.
          </Text>

          <Text style={styles.sectionTitle}>
            Covered squares
          </Text>

          <Text style={styles.paragraph}>
            Covered squares are used as fences. They cannot be used again and
            they do not belong to either player for scoring.
          </Text>

          <Text style={styles.paragraph}>
            In this app, covered squares are shown as faint colored blocks so it
            is easier to see who placed each domino.
          </Text>

          <Text style={styles.sectionTitle}>
            Claiming regions
          </Text>

          <Text style={styles.paragraph}>
            After every domino placement, the app checks whether a new enclosed
            empty region has been created.
          </Text>

          <Text style={styles.paragraph}>
            If the enclosed region has an odd number of squares, and its size is
            1, 3, 5, 7, or 9, the player who placed the domino claims that
            region.
          </Text>

          <Text style={styles.rulesExample}>
            Closed region of 1 square: claimed.{'\n'}
            Closed region of 3 squares: claimed.{'\n'}
            Closed region of 5 squares: claimed.{'\n'}
            Closed region of 2, 4, 6, or 8 squares: not claimed.
          </Text>

          <Text style={styles.paragraph}>
            Claimed regions are shown with dots in the player&apos;s color.
          </Text>

          <Text style={styles.sectionTitle}>
            Legal moves
          </Text>

          <Text style={styles.paragraph}>
            A legal move must cover exactly two empty squares that share an
            edge.
          </Text>

          <Text style={styles.paragraph}>
            You cannot place a domino on an already covered or already claimed
            square.
          </Text>

          <Text style={styles.sectionTitle}>
            End of the game
          </Text>

          <Text style={styles.paragraph}>
            The game ends when there is no legal domino move left.
          </Text>

          <Text style={styles.paragraph}>
            In other words, the game is over when there are no two adjacent
            empty squares available.
          </Text>

          <Text style={styles.sectionTitle}>
            Scoring
          </Text>

          <Text style={styles.paragraph}>
            At the end of the game, the app counts claimed squares for each
            player.
          </Text>

          <Text style={styles.rulesExample}>
            Example:{'\n'}
            Blue claimed squares: 7{'\n'}
            Red claimed squares: 5{'\n'}
            Blue wins.
          </Text>

          <Text style={styles.paragraph}>
            If both players have claimed the same number of squares, the game is
            a draw.
          </Text>

          <Text style={styles.sectionTitle}>
            App modes
          </Text>

          <Text style={styles.paragraph}>
            The app supports local two-player play on one device.
          </Text>

          <Text style={styles.paragraph}>
            Player 2 can also be controlled by AI in offline mode. The AI uses a
            simple move suggestion system with some randomness.
          </Text>

          <Text style={styles.sectionTitle}>
            Multiplayer
          </Text>

          <Text style={styles.paragraph}>
            Multiplayer works through room codes. Players enter the same room
            code and connect to the same online room.
          </Text>

          <Text style={styles.paragraph}>
            The first connected device controls Blue. The second connected
            device controls Red. Extra connected devices can watch as
            spectators.
          </Text>

          <Text style={styles.paragraph}>
            The backend is a reusable SignalR relay server. It does not know the
            rules of Imparium. It only sends room events between connected
            devices.
          </Text>

          <Text style={styles.sectionTitle}>
            Inspiration
          </Text>

          <Text style={styles.paragraph}>
            This digital version was inspired by the game Imparium from the
            article “Six Strategic Games from a Strange and Bottomless Mind” by
            Math with Bad Drawings.
          </Text>

          <Pressable onPress={openArticle}>
            <Text style={styles.linkText}>
              Read the article
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

export default ImpariumInfo