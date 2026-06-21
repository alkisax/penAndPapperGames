// src/app/blackHole/blackHole.tsx
import { View, StyleSheet, Button, Text } from 'react-native'
import BlackHoleBoard from '@/components/svg/blackHoleBoard'
import Navbar from '@/layout/Navbar'
import { useBlackHole } from '@/hooks/useBlackHole'
import { useState } from 'react'

const BlackHole = () => {

  const [numberOfPlayers, setNumberOfPlayers] = useState(2)

  const {
    currentPlayer,
    cells,
    handleCellPress,
    winners,
    gameOver,
    playAgain,
  } = useBlackHole({
    numberOfPlayers,
  })

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

      <View style={styles.controls}>
        <Button
          title='2 Players'
          onPress={() => setNumberOfPlayers(2)}
        />

        <Button
          title='3 Players'
          onPress={() => setNumberOfPlayers(3)}
        />
      </View>

      <Text style={styles.playerText}>
        Now Playing: Player {currentPlayer}
      </Text>

      {gameOver && (
        <>
          <Text style={styles.playerText}>
            Winner{winners.length > 1 ? 's' : ''}: Player{' '}
            {winners.join(', Player ')}
          </Text>

          <Button
            title='Play Again'
            onPress={playAgain}
          />
        </>
      )}

      <View style={styles.container}>
        <BlackHoleBoard
          handleCellPress={handleCellPress}
          cells={cells}
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

  controls: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  playerText: {
    fontSize: 20,
    marginBottom: 20,
  },
})