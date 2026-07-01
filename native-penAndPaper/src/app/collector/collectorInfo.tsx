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

const COLLECTOR_ARTICLE_URL =
  'https://mathwithbaddrawings.com/2020/04/22/six-strategic-games-from-a-strange-and-bottomless-mind/'

const CollectorInfo = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createInfoStyles(colors)

  const openArticle = async () => {
    await Linking.openURL(COLLECTOR_ARTICLE_URL)
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
            Collector
          </Text>

          <Text style={styles.paragraph}>
            Collector is a small abstract strategy game for two players. Players
            take turns placing their own pieces on a square grid while also
            removing empty spaces from future play.
          </Text>

          <Text style={styles.sectionTitle}>
            Goal
          </Text>

          <Text style={styles.paragraph}>
            The goal is to create the largest connected group of your own
            pieces.
          </Text>

          <Text style={styles.paragraph}>
            At the end of the game, each player&apos;s largest connected group
            is counted. The player with the larger group wins.
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
            Each turn has two steps.
          </Text>

          <Text style={styles.rulesExample}>
            1. Mark one empty cell with your color.{'\n'}
            2. Then eliminate one empty neighboring cell.
          </Text>

          <Text style={styles.paragraph}>
            The eliminated cell becomes blocked and can no longer be used by
            either player.
          </Text>

          <Text style={styles.paragraph}>
            In this app, blocked cells are shown as colored background squares.
            Regular player pieces are shown as circles.
          </Text>

          <Text style={styles.sectionTitle}>
            Neighbors
          </Text>

          <Text style={styles.paragraph}>
            Neighboring cells include horizontal, vertical, and diagonal
            neighbors.
          </Text>

          <Text style={styles.paragraph}>
            This means diagonal connections count both for eliminating cells and
            for connecting groups.
          </Text>

          <Text style={styles.sectionTitle}>
            Legal moves
          </Text>

          <Text style={styles.paragraph}>
            You can only mark an empty cell if it has at least one empty
            neighboring cell available to eliminate.
          </Text>

          <Text style={styles.paragraph}>
            This prevents a player from choosing a cell and then having no legal
            elimination step.
          </Text>

          <Text style={styles.sectionTitle}>
            End of the game
          </Text>

          <Text style={styles.paragraph}>
            The game ends when no complete legal turn is possible.
          </Text>

          <Text style={styles.paragraph}>
            A complete legal turn means choosing one empty cell and then
            eliminating an adjacent empty cell.
          </Text>

          <Text style={styles.sectionTitle}>
            Scoring
          </Text>

          <Text style={styles.paragraph}>
            When the game ends, the app finds the largest connected group for
            each player.
          </Text>

          <Text style={styles.rulesExample}>
            Example:{'\n'}
            Blue largest group: 7{'\n'}
            Red largest group: 5{'\n'}
            Blue wins.
          </Text>

          <Text style={styles.paragraph}>
            If both players have largest groups of the same size, the game is a
            draw.
          </Text>

          <Text style={styles.sectionTitle}>
            Connection lines
          </Text>

          <Text style={styles.paragraph}>
            The app draws lines between connected pieces of the same color.
            These lines are visual helpers and make it easier to see growing
            groups during the game.
          </Text>

          <Text style={styles.sectionTitle}>
            App modes
          </Text>

          <Text style={styles.paragraph}>
            The app supports local two-player play on one device.
          </Text>

          <Text style={styles.paragraph}>
            Player 2 can also be controlled by AI in offline mode. The AI uses a
            simple move suggestion system with some randomness, so it does not
            always play the same way.
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
            rules of Collector. It only sends room events between connected
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

export default CollectorInfo