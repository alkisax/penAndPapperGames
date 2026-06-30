import {
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

const DotsAndBoxesInfo = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createInfoStyles(colors)

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
            Dots and Boxes
          </Text>

          <Text style={styles.paragraph}>
            Dots and Boxes is a classic pen-and-paper strategy game for two
            players. Players take turns drawing lines between dots and try to
            complete boxes.
          </Text>

          <Text style={styles.sectionTitle}>
            Goal
          </Text>

          <Text style={styles.paragraph}>
            The goal is to claim more boxes than your opponent before the board
            is full.
          </Text>

          <Text style={styles.sectionTitle}>
            How to draw the board on paper
          </Text>

          <Text style={styles.paragraph}>
            Draw a grid of dots. The dots should be arranged in rows and
            columns.
          </Text>

          <Text style={styles.paragraph}>
            In this app, the board uses a 10 by 10 dot grid. That creates 9 by 9
            possible boxes.
          </Text>

          <Text style={styles.sectionTitle}>
            How to play
          </Text>

          <Text style={styles.paragraph}>
            Players take turns drawing one line between two neighboring dots.
          </Text>

          <Text style={styles.paragraph}>
            Lines can only be horizontal or vertical. Diagonal lines are not
            allowed.
          </Text>

          <Text style={styles.paragraph}>
            In the app, tap between two dots to draw a line.
          </Text>

          <Text style={styles.sectionTitle}>
            Claiming boxes
          </Text>

          <Text style={styles.paragraph}>
            When a player draws the fourth side of a box, that player claims
            the box.
          </Text>

          <Text style={styles.paragraph}>
            Claimed boxes are filled with the player&apos;s color.
          </Text>

          <Text style={styles.rulesExample}>
            Blue claims blue boxes.{'\n'}
            Red claims red boxes.
          </Text>

          <Text style={styles.sectionTitle}>
            Extra turn rule
          </Text>

          <Text style={styles.paragraph}>
            If a player completes a box, they get another turn.
          </Text>

          <Text style={styles.paragraph}>
            If a move does not complete a box, the turn passes to the other
            player.
          </Text>

          <Text style={styles.sectionTitle}>
            Double box moves
          </Text>

          <Text style={styles.paragraph}>
            Sometimes one line can complete two boxes at the same time.
          </Text>

          <Text style={styles.paragraph}>
            In that case, the player claims both boxes and still gets another
            turn.
          </Text>

          <Text style={styles.sectionTitle}>
            Scoring
          </Text>

          <Text style={styles.paragraph}>
            Each claimed box is worth one point.
          </Text>

          <Text style={styles.paragraph}>
            When all boxes have been claimed, the player with the most boxes
            wins.
          </Text>

          <Text style={styles.paragraph}>
            If both players have the same number of boxes, the game is a draw.
          </Text>

          <Text style={styles.sectionTitle}>
            Strategy
          </Text>

          <Text style={styles.paragraph}>
            The game is not only about taking boxes. You also need to avoid
            giving your opponent an easy box on the next turn.
          </Text>

          <Text style={styles.paragraph}>
            Near the end of the game, chains of boxes can appear. Giving away
            one line at the wrong time can let the opponent claim many boxes in
            a row.
          </Text>

          <Text style={styles.sectionTitle}>
            App modes
          </Text>

          <Text style={styles.paragraph}>
            The app supports local two-player play on one device.
          </Text>

          <Text style={styles.paragraph}>
            Player 2 can also be controlled by AI in offline mode. The AI tries
            to claim boxes when possible and avoid moves that immediately give
            boxes to the opponent.
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
            rules of Dots and Boxes. It only sends room events between connected
            devices.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default DotsAndBoxesInfo