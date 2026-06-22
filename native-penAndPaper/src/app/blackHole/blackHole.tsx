// src/app/blackHole/blackHole.tsx
import { View, StyleSheet, Button, Text, Switch } from 'react-native'
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
    scores,
    isPlayer2Ai,
    setIsPlayer2Ai,
  } = useBlackHole({
    numberOfPlayers,
  })

  return (
    <>
      <Navbar
        // minimal
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

      <View style={styles.controls}>
        <Text>Play against AI</Text>

        <Switch
          value={isPlayer2Ai}
          onValueChange={(value) => {
            setIsPlayer2Ai(value)
            console.log(
              `Player 2 is AI: ${value}`,
            )
          }}
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

          <Text style={styles.playerText}>
            Player 1 Score: {scores.player1}
          </Text>

          <Text style={styles.playerText}>
            Player 2 Score: {scores.player2}
          </Text>

          {numberOfPlayers === 3 && (
            <Text style={styles.playerText}>
              Player 3 Score: {scores.player3}
            </Text>
          )}

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