// native-penAndPaper/src/app/slingshot/slingshot.tsx

import {
  Text,
  View,
} from 'react-native'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { useContext, useState } from 'react'
import SlingshotSvg from '@/components/svg/slingshot/SlingshotSvg'

const Slingshot = () => {
  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)

  const [power, setPower] = useState(0)
  const [angle, setAngle] = useState(0)

  return (
    <View style={globalStyles.screen}>
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

      <View style={globalStyles.centerContent}>
        <Text style={globalStyles.title}>
          Hello Slingshot
        </Text>

        <Text style={globalStyles.text}>
          Power: {power}%
        </Text>

        <Text style={globalStyles.text}>
          Angle: {angle}°
        </Text>

        <SlingshotSvg
          originX={160}
          originY={160}
          boardBackground={colors.boardBackground}
          circleColor='#2f80ed'
          lineColor={colors.text}
          onRelease={(result) => {
            setPower(result.power)
            setAngle(result.angle)
          }}
        />
      </View>
    </View>
  )
}

export default Slingshot