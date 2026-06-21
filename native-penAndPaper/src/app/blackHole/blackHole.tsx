// src/app/blackHole/blackHole.tsx

import { View, StyleSheet } from 'react-native'
import BlackHoleBoard from '@/components/svg/blackHoleBoard'
import Navbar from '@/layout/Navbar'
import { useBlackHole } from '@/hooks/useBlackHole'

const BlackHole = () => {
  const {
    currentPlayer,
    handleCellPress,
  } = useBlackHole()

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
        <BlackHoleBoard
          handleCellPress={handleCellPress}
        />
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