import {
  Text,
  View,
} from 'react-native'
import { useContext } from 'react'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'

const DotsAndBoxes = () => {
  const { colors } = useContext(ThemeContext)

  const globalStyles = createGlobalStyles(colors)

  return (
    <View style={globalStyles.screen}>
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

      <View style={globalStyles.centerContent}>
        <Text style={globalStyles.title}>
          Dots and Boxes
        </Text>

        <Text style={globalStyles.text}>
          Hello Dots and Boxes
        </Text>
      </View>
    </View>
  )
}

export default DotsAndBoxes