import { Linking, Pressable, ScrollView, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useContext } from 'react'

import { ThemeContext } from '@/context/ThemeContext'
import { createInfoStyles } from '@/styles/info.styles'
import Navbar from '@/layout/Navbar'

const DANDELIONS_VIDEO_URL =
  'https://www.youtube.com/watch?v=-IZlSIb5n74&list=PL4YNSBiTVKSYil3do47iAs7QfFRtTHJUr&index=17'

const DandelionsInfo = () => {
  const { colors } = useContext(ThemeContext)

  const styles = createInfoStyles(colors)

  const openVideo = async () => {
    await Linking.openURL(DANDELIONS_VIDEO_URL)
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
            Dandelions
          </Text>

          <Text style={styles.paragraph}>
            Dandelions is a simple asymmetric pen-and-paper strategy game.
            One player controls the dandelions, while the other player controls
            the wind.
          </Text>

          <Text style={styles.sectionTitle}>
            How to draw the board on paper
          </Text>

          <Text style={styles.paragraph}>
            Draw a 6 by 6 grid.
          </Text>

          <Text style={styles.rulesExample}>
            □ □ □ □ □ □{'\n'}
            □ □ □ □ □ □{'\n'}
            □ □ □ □ □ □{'\n'}
            □ □ □ □ □ □{'\n'}
            □ □ □ □ □ □{'\n'}
            □ □ □ □ □ □
          </Text>

          <Text style={styles.paragraph}>
            Next to the grid, draw a compass with 8 directions:
          </Text>

          <Text style={styles.rulesExample}>
            N, NE, E, SE, S, SW, W, NW
          </Text>

          <Text style={styles.sectionTitle}>
            Players
          </Text>

          <Text style={styles.paragraph}>
            Dandelion places flowers on the board.
          </Text>

          <Text style={styles.paragraph}>
            Wind chooses directions from the compass.
          </Text>

          <Text style={styles.sectionTitle}>
            Turn order
          </Text>

          <Text style={styles.paragraph}>
            Dandelion plays first by placing one flower on any empty cell.
          </Text>

          <Text style={styles.paragraph}>
            Then Wind chooses one unused direction.
          </Text>

          <Text style={styles.paragraph}>
            Seeds spread from every flower in that direction, filling every
            empty cell in a straight line until the edge of the board.
          </Text>

          <Text style={styles.paragraph}>
            Then Dandelion places another flower, and Wind chooses another
            unused direction.
          </Text>

          <Text style={styles.sectionTitle}>
            Wind directions
          </Text>

          <Text style={styles.paragraph}>
            Each wind direction can be used only once.
          </Text>

          <Text style={styles.paragraph}>
            The game uses 7 wind moves. This means one of the 8 directions will
            remain unused.
          </Text>

          <Text style={styles.sectionTitle}>
            Winning
          </Text>

          <Text style={styles.paragraph}>
            Dandelion wins if the whole board becomes filled with flowers or
            seeds.
          </Text>

          <Text style={styles.paragraph}>
            Wind wins if, after the 7th wind move, at least one cell is still
            empty.
          </Text>

          <Text style={styles.sectionTitle}>
            App modes
          </Text>

          <Text style={styles.paragraph}>
            This app supports local play, AI-controlled players, and online
            multiplayer through room codes.
          </Text>

          <Text style={styles.paragraph}>
            You can turn on Dandelion AI, Wind AI, or both. If both are enabled,
            the game plays automatically until there is a winner.
          </Text>

          <Text style={styles.sectionTitle}>
            Multiplayer
          </Text>

          <Text style={styles.paragraph}>
            Multiplayer works through room codes. Two devices enter the same
            room code and connect to the same online room.
          </Text>

          <Text style={styles.paragraph}>
            Player 1 controls Dandelion. Player 2 controls Wind. Extra
            connected devices can watch as spectators.
          </Text>

          <Text style={styles.paragraph}>
            The backend is a reusable SignalR relay server. It only forwards
            game events between connected devices.
          </Text>

          <Text style={styles.sectionTitle}>
            Inspiration
          </Text>

          <Text style={styles.paragraph}>
            This digital version was inspired by a pen-and-paper game explained
            in a The Tabletop Family YouTube channel video.
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

export default DandelionsInfo