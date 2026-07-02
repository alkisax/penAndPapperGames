import { Linking, Pressable, ScrollView, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useContext } from 'react'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createInfoStyles } from '@/styles/info.styles'

const NAB_INSPIRATION_VIDEO_URL =
  'https://www.youtube.com/watch?v=z39G02bt6A4'

const NabInfo = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createInfoStyles(colors)

  const openInspirationVideo = async () => {
    await Linking.openURL(NAB_INSPIRATION_VIDEO_URL)
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
            Nab
          </Text>

          <Text style={styles.paragraph}>
            Nab is a small two-player abstract strategy game played on a
            triangular board of circles.
          </Text>

          <Text style={styles.paragraph}>
            Players take turns drawing straight lines through unused circles.
            The goal is to force the opponent to take the final remaining
            position.
          </Text>

          <Text style={styles.sectionTitle}>
            Goal
          </Text>

          <Text style={styles.paragraph}>
            Nab is played with a misère-style rule: the player who is forced to
            take the last available position loses.
          </Text>

          <Text style={styles.paragraph}>
            In this app, if after your move there are no moves left, the other
            player wins.
          </Text>

          <Text style={styles.sectionTitle}>
            Board
          </Text>

          <Text style={styles.paragraph}>
            The board is a pyramid of circles with rows of 1, 2, 3, 4, 5, and 6
            circles.
          </Text>

          <Text style={styles.paragraph}>
            Blue is Player 1. Red is Player 2.
          </Text>

          <Text style={styles.sectionTitle}>
            How to play
          </Text>

          <Text style={styles.paragraph}>
            On your turn, draw one straight line through one or more unused
            circles.
          </Text>

          <Text style={styles.rulesExample}>
            1. Touch an unused circle.{'\n'}
            2. Drag in a straight valid direction.{'\n'}
            3. Release on the final circle.
          </Text>

          <Text style={styles.paragraph}>
            The line claims every circle it passes through, including the first
            and last circle.
          </Text>

          <Text style={styles.sectionTitle}>
            Single-circle moves
          </Text>

          <Text style={styles.paragraph}>
            You may also claim only one circle. In the app this is shown as a
            short line across that circle.
          </Text>

          <Text style={styles.sectionTitle}>
            Valid directions
          </Text>

          <Text style={styles.paragraph}>
            Lines must follow one of the board&apos;s straight axes.
          </Text>

          <Text style={styles.rulesExample}>
            Valid lines can go:{'\n'}
            • horizontally across a row{'\n'}
            • diagonally along one side of the pyramid{'\n'}
            • diagonally along the other side of the pyramid
          </Text>

          <Text style={styles.paragraph}>
            The app finds the nearest valid end circle when you release the
            drag.
          </Text>

          <Text style={styles.sectionTitle}>
            Used circles
          </Text>

          <Text style={styles.paragraph}>
            A circle can only be used once.
          </Text>

          <Text style={styles.paragraph}>
            A new line cannot start on, end on, or pass through a circle that
            has already been used.
          </Text>

          <Text style={styles.sectionTitle}>
            End of the game
          </Text>

          <Text style={styles.paragraph}>
            The game ends when there are no unused circles left.
          </Text>

          <Text style={styles.paragraph}>
            Because single-circle moves are allowed, any unused circle is always
            a possible move.
          </Text>

          <Text style={styles.sectionTitle}>
            Winning condition
          </Text>

          <Text style={styles.paragraph}>
            After each move, the app checks whether another move is possible.
          </Text>

          <Text style={styles.rulesExample}>
            If Blue makes the last move:{'\n'}
            Red wins.{'\n\n'}
            If Red makes the last move:{'\n'}
            Blue wins.
          </Text>

          <Text style={styles.sectionTitle}>
            App controls
          </Text>

          <Text style={styles.paragraph}>
            Drag across the board to draw a line. The temporary line shows where
            your move is aiming before you release.
          </Text>

          <Text style={styles.paragraph}>
            Use the restart button to clear the board and start again from
            Blue.
          </Text>

          <Text style={styles.sectionTitle}>
            AI mode
          </Text>

          <Text style={styles.paragraph}>
            Player 2 can be controlled by AI in offline mode.
          </Text>

          <Text style={styles.paragraph}>
            The AI uses a simple move suggestion system with some randomness. It
            tries to avoid taking the last circle and sometimes chooses from a
            small group of good-looking moves.
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
            rules of Nab. It only sends room events between connected devices.
          </Text>

          <Text style={styles.sectionTitle}>
            Inspiration
          </Text>

          <Text style={styles.paragraph}>
            This digital version was inspired by a video demonstration of the
            original pen-and-paper game.
          </Text>

          <Pressable onPress={openInspirationVideo}>
            <Text style={styles.linkText}>
              Watch the inspiration video
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

export default NabInfo