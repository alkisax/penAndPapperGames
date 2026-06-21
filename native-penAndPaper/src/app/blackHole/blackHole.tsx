// src/app/blackHole/blackHole.tsx

import { View, StyleSheet } from 'react-native'
import BlackHoleBoard from '@/components/svg/blackHoleBoard'
import Navbar from '@/layout/Navbar'

const BlackHole = () => {
  return (
    <>
      <Navbar
        minimal
        roomId=''
        setRoomId={() => { }}
        handleConnectSocket={async () => { }}
        isConnected={false}
        hasPeer={false}
      />
      <View style={styles.container}>
        <BlackHoleBoard />
      </View>
    </>

  )
}

export default BlackHole

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})