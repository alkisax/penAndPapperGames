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

const SNAKE_FIGHT_ARTICLE_URL =
  'https://mathwithbaddrawings.com/2020/04/22/six-strategic-games-from-a-strange-and-bottomless-mind/'

const SnakeFightInfo = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createInfoStyles(colors)

  const openArticle = async () => {
    await Linking.openURL(SNAKE_FIGHT_ARTICLE_URL)
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
            Snake Fight
          </Text>

          <Text style={styles.paragraph}>
            Snake Fight is a two-player pencil-and-paper strategy game. Each
            player controls a snake that grows across a small grid of dots.
          </Text>

          <Text style={styles.sectionTitle}>
            Goal
          </Text>

          <Text style={styles.paragraph}>
            The goal is to cross the enemy snake as many times as possible.
          </Text>

          <Text style={styles.paragraph}>
            Each time your new line crosses the opponent&apos;s snake, you score
            one point.
          </Text>

          <Text style={styles.sectionTitle}>
            Board
          </Text>

          <Text style={styles.paragraph}>
            This version is played on a 5 × 5 array of dots.
          </Text>

          <Text style={styles.paragraph}>
            Blue starts in one corner. Red starts in the opposite corner.
          </Text>

          <Text style={styles.sectionTitle}>
            How to play
          </Text>

          <Text style={styles.paragraph}>
            Players take turns extending their snake from its current head.
          </Text>

          <Text style={styles.rulesExample}>
            On your turn:{'\n'}
            1. Start from your snake&apos;s head.{'\n'}
            2. Draw a straight line to another dot.{'\n'}
            3. The line may be horizontal, vertical, or diagonal.
          </Text>

          <Text style={styles.paragraph}>
            The line may travel more than one dot, as long as it stays in a
            single straight direction.
          </Text>

          <Text style={styles.sectionTitle}>
            Legal moves
          </Text>

          <Text style={styles.paragraph}>
            Your snake can never cross or touch itself.
          </Text>

          <Text style={styles.paragraph}>
            You also cannot trace over a segment that has already been drawn by
            either player.
          </Text>

          <Text style={styles.paragraph}>
            The border of the board also counts as an already drawn line, so you
            cannot trace along the outer border.
          </Text>

          <Text style={styles.sectionTitle}>
            Crossing the enemy
          </Text>

          <Text style={styles.paragraph}>
            Crossing the opponent&apos;s snake scores one point.
          </Text>

          <Text style={styles.paragraph}>
            Passing through the opponent&apos;s head also counts as a crossing.
          </Text>

          <Text style={styles.paragraph}>
            Reaching the opponent&apos;s head can also count as a crossing,
            depending on the geometry of the move.
          </Text>

          <Text style={styles.sectionTitle}>
            End of the game
          </Text>

          <Text style={styles.paragraph}>
            The game continues until neither player has a legal move.
          </Text>

          <Text style={styles.paragraph}>
            If one player has no move but the other still can move, the turn
            stays with the player who can still move.
          </Text>

          <Text style={styles.sectionTitle}>
            Scoring
          </Text>

          <Text style={styles.paragraph}>
            The player with the higher number of crossings wins.
          </Text>

          <Text style={styles.rulesExample}>
            Example:{'\n'}
            Blue crossed Red: 4{'\n'}
            Red crossed Blue: 2{'\n'}
            Blue wins.
          </Text>

          <Text style={styles.paragraph}>
            If both players have the same number of crossings, the game is a
            draw.
          </Text>

          <Text style={styles.sectionTitle}>
            App modes
          </Text>

          <Text style={styles.paragraph}>
            The app supports local two-player play on one device.
          </Text>

          <Text style={styles.paragraph}>
            Player 2 can also be controlled by AI in offline mode. The AI tries
            to score crossings while keeping future moves available.
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
            rules of Snake Fight. It only sends room events between connected
            devices.
          </Text>

          <Text style={styles.sectionTitle}>
            Inspiration
          </Text>

          <Text style={styles.paragraph}>
            This digital version was inspired by the article “Six Strategic
            Games from a Strange and Bottomless Mind” from Math with Bad
            Drawings.
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

export default SnakeFightInfo