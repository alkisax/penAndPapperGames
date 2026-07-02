import {
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native'
import {
  useContext,
} from 'react'

import NabBoardSvg from '@/components/svg/nab/NabBoardSvg'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { createRibbonStyles } from '@/styles/ribbon.styles'
import { useNab } from '@/hooks/nab/useNab'

const Nab = () => {
  const { colors } = useContext(ThemeContext)

  const globalStyles = createGlobalStyles(colors)
  const ribbonStyles = createRibbonStyles(colors)

  const {
    currentPlayer,
    winner,
    resetVersion,
    turnText,

    isPlayer2Ai,
    setIsPlayer2Ai,

    externalMove,
    externalMoveVersion,

    handleValidMove,
    handleResetGame,
  } = useNab()

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.centerContent}>
        <View style={ribbonStyles.ribbon}>
          <View style={ribbonStyles.titleBlock}>
            <Text style={ribbonStyles.title}>
              Nab
            </Text>

            <Text style={ribbonStyles.subtitle}>
              {turnText}
            </Text>
          </View>

          <View style={ribbonStyles.actions}>
            <View
              style={{
                alignItems: 'center',
              }}
            >
              <Text
                style={[
                  globalStyles.text,
                  {
                    fontSize: 10,
                  },
                ]}
              >
                P2 AI
              </Text>

              <Switch
                value={isPlayer2Ai}
                onValueChange={setIsPlayer2Ai}
              />
            </View>

            <Pressable
              style={[
                ribbonStyles.button,
                ribbonStyles.buttonActive,
              ]}
              onPress={handleResetGame}
            >
              <Text
                style={[
                  ribbonStyles.buttonText,
                  ribbonStyles.buttonTextActive,
                ]}
              >
                ↻
              </Text>
            </Pressable>
          </View>
        </View>

        <NabBoardSvg
          currentPlayer={currentPlayer}
          winner={winner}
          resetVersion={resetVersion}
          externalMove={externalMove}
          externalMoveVersion={externalMoveVersion}
          onValidMove={handleValidMove}
          handleCellPress={(cellId) => {
            console.log('nab cell pressed:', cellId)
          }}
        />
      </View>
    </View>
  )
}

export default Nab