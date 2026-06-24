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

const PFERD_APFEL_VIDEO_URL =
  'https://www.youtube.com/watch?v=KvgRNmXms0M&list=PL4YNSBiTVKSYil3do47iAs7QfFRtTHJUr&index=8'

const PferdApfelInfo = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createInfoStyles(colors)

  const openVideo = async () => {
    await Linking.openURL(PFERD_APFEL_VIDEO_URL)
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
            Pferdäpfel
          </Text>

          <Text style={styles.paragraph}>
            Pferdäpfel is a simple chase game played on an 8 by 8 board. Each
            player controls a knight. The goal is to capture the opponent or
            trap them so they have no legal moves.
          </Text>

          <Text style={styles.sectionTitle}>
            How to draw the board on paper
          </Text>

          <Text style={styles.paragraph}>
            Draw an 8 by 8 square grid, like a chess board.
          </Text>

          <Text style={styles.paragraph}>
            One player starts in one corner. The other player starts in the
            opposite corner.
          </Text>

          <Text style={styles.rulesExample}>
            Blue: bottom-left corner{'\n'}
            Red: top-right corner
          </Text>

          <Text style={styles.sectionTitle}>
            Movement
          </Text>

          <Text style={styles.paragraph}>
            Players move like knights in chess.
          </Text>

          <Text style={styles.paragraph}>
            A knight move means moving two cells in one direction and one cell
            sideways.
          </Text>

          <Text style={styles.rulesExample}>
            2 rows + 1 column{'\n'}
            or{'\n'}
            1 row + 2 columns
          </Text>

          <Text style={styles.paragraph}>
            Players take turns moving their knight to a legal square.
          </Text>

          <Text style={styles.sectionTitle}>
            Blocked cells
          </Text>

          <Text style={styles.paragraph}>
            After a player moves, the cell they just left is marked with an X.
          </Text>

          <Text style={styles.paragraph}>
            A blocked cell cannot be used again by either player for the rest
            of the game.
          </Text>

          <Text style={styles.paragraph}>
            This means you cannot simply go back to where you came from. Every
            move slowly reduces the available board.
          </Text>

          <Text style={styles.sectionTitle}>
            How to win
          </Text>

          <Text style={styles.paragraph}>
            You win by landing directly on your opponent&apos;s square with a
            legal knight move.
          </Text>

          <Text style={styles.paragraph}>
            You also win if your opponent has no legal moves left on their
            turn.
          </Text>

          <Text style={styles.sectionTitle}>
            Strategy
          </Text>

          <Text style={styles.paragraph}>
            The game is about chasing without becoming vulnerable. Sometimes
            moving closer is dangerous, because the opponent may be able to
            capture you on the next turn.
          </Text>

          <Text style={styles.paragraph}>
            You also need to watch the blocked cells. A safe escape route can
            disappear after only a few turns.
          </Text>

          <Text style={styles.sectionTitle}>
            App modes
          </Text>

          <Text style={styles.paragraph}>
            This app supports local 2-player play.
          </Text>

          <Text style={styles.paragraph}>
            Red can also be controlled by AI in offline mode. The AI chooses a
            legal move automatically. It first looks for a capture move, then
            chooses a move that brings it closer to the opponent.
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
            device controls Red.
          </Text>

          <Text style={styles.paragraph}>
            The app sends game events such as moves and resets between connected
            devices.
          </Text>

          <Text style={styles.paragraph}>
            The backend is a reusable SignalR relay server. It does not know the
            rules of Pferdäpfel. It only sends room messages from one device to
            the others.
          </Text>

          <Text style={styles.sectionTitle}>
            Current multiplayer note
          </Text>

          <Text style={styles.paragraph}>
            In this version, player assignment is simple. The first connected
            device becomes Blue, and the second connected device becomes Red.
          </Text>

          <Text style={styles.paragraph}>
            Extra connected devices can watch as spectators.
          </Text>

          <Text style={styles.sectionTitle}>
            Inspiration
          </Text>

          <Text style={styles.paragraph}>
            This digital version was inspired by a pen-and-paper game explained
            in a The Tabletop Family YouTube channel video. In the video, the
            game is called Night Chase.
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

export default PferdApfelInfo