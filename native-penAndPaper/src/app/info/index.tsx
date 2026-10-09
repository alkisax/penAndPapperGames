import { useContext } from 'react'
import { ScrollView, Text, View } from 'react-native'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createInfoStyles } from '@/styles/info.styles'
import PrivacyChoicesButton from '@/ads/components/PrivacyChoicesButton'

const Info = () => {
  const { colors } = useContext(ThemeContext)
  const styles = createInfoStyles(colors)

  return (
    <View style={styles.screen}>
      <Navbar
        minimal
        roomId=''
        setRoomId={() => {}}
        handleConnectSocket={async () => { }}
        handleDisconnectSocket={async () => {}}
        isConnected={false}
        hasPeer={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            About this app
          </Text>

          <Text style={styles.paragraph}>
            This is a portfolio project: a collection of simple strategy games
            that can also be played with pencil and paper.
          </Text>

          <Text style={styles.paragraph}>
            It was built with React Native and Expo, with a .NET SignalR
            backend for online rooms. It was also a chance to practise
            SVG-based game boards and mobile UI.
          </Text>

          <Text style={styles.paragraph}>
            ChatGPT and other AI coding assistance were used during development.
          </Text>

          <Text style={styles.sectionTitle}>
            Playing the games
          </Text>

          <Text style={styles.paragraph}>
            Each game has an 'i' button with its own rules and instructions.
            Games can be played locally by two players on one device, against a
            simple AI opponent where available, or online on two remote devices.
          </Text>

          <Text style={styles.sectionTitle}>
            Online rooms
          </Text>

          <Text style={styles.paragraph}>
            Open the hamburger menu, enter the same agreed room code, set a
            username, and connect.
          </Text>

          <Text style={styles.paragraph}>
            One green indicator means you are connected to the room. Two green
            indicators mean another player is also there. Extra connected
            devices may watch as spectators.
          </Text>
        </View>

        <PrivacyChoicesButton />
      </ScrollView>
    </View>

  )
}

export default Info
