import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { router } from 'expo-router'
import Navbar from '@/layout/Navbar'

export default function Index() {
  return (
    <>
      <Navbar
        roomId=''
        setRoomId={() => { }}
        handleConnectSocket={async () => { }}
        isConnected={false}
        hasPeer={false}
      />

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/blackHole/blackHole')}
        >
          <Text style={styles.buttonText}>
            Black Hole
          </Text>
        </TouchableOpacity>
      </View>
    </>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
  },
})