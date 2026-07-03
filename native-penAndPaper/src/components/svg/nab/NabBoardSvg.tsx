// native-penAndPaper\src\components\svg\nab\NabBoardSvg.tsx
import { useEffect, useRef, useState } from 'react'
import {
  PanResponder,
  View,
} from 'react-native'
import Svg, {
  Circle,
  G,
  Line,
} from 'react-native-svg'

import {
  getNabCoordinates,
  getNearestAlignedNabCell,
  getNearestNabCell,
  NAB_RADIUS,
  NAB_SVG_HEIGHT,
  NAB_SVG_WIDTH,
} from '@/utils/nab/nabSvgUtils'
import type {
  NabCell,
  NabLine,
} from '@/utils/nab/nabSvgUtils'
import {
  getNabPlayerColor,
} from '@/utils/nab/nabGameUtils'
import type {
  NabPlayer,
} from '@/utils/nab/nabGameUtils'

type Props = {
  cells: NabCell[]
  savedLines: NabLine[]
  usedCellIds: number[]
  currentPlayer: NabPlayer
  winner: NabPlayer | null
  resetVersion: number
  onMoveAttempt: (fromCellId: number, toCellId: number) => void
  handleCellPress: (cellId: number) => void
}

const NabBoardSvg = ({
  cells,
  savedLines,
  usedCellIds,
  currentPlayer,
  winner,
  resetVersion,
  onMoveAttempt,
  handleCellPress,
}: Props) => {
  const [dragStartCell, setDragStartCell] = useState<NabCell | null>(null)
  const [dragX, setDragX] = useState(0)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const dragStartCellRef = useRef<NabCell | null>(null)

  const clearDrag = () => {
    dragStartCellRef.current = null
    setDragStartCell(null)
    setDragX(0)
    setDragY(0)
    setIsDragging(false)
  }

  // Καθαρίζει μόνο το προσωρινό gesture state.
  // Το πραγματικό game state το κρατάει το useNab.
  useEffect(() => {
    clearDrag()
  }, [resetVersion])

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !winner,
    onMoveShouldSetPanResponder: () => !winner,

    onPanResponderGrant: (event) => {
      if (winner) return

      const { locationX, locationY } = event.nativeEvent

      const startCell = getNearestNabCell(
        locationX,
        locationY,
        cells,
      )

      if (!startCell) return
      if (usedCellIds.includes(startCell.id)) return

      const startPosition = getNabCoordinates(startCell)

      dragStartCellRef.current = startCell
      setDragStartCell(startCell)
      setDragX(startPosition.x)
      setDragY(startPosition.y)
      setIsDragging(true)
    },

    onPanResponderMove: (event) => {
      if (!dragStartCellRef.current) return

      const { locationX, locationY } = event.nativeEvent

      setDragX(locationX)
      setDragY(locationY)
    },

    onPanResponderRelease: (event) => {
      const startCell = dragStartCellRef.current

      if (!startCell) {
        clearDrag()
        return
      }

      const { locationX, locationY } = event.nativeEvent

      const endCell = getNearestAlignedNabCell(
        locationX,
        locationY,
        startCell,
        cells,
      )

      if (!endCell) {
        clearDrag()
        return
      }

      // Το SVG δεν αποφασίζει αν η κίνηση είναι valid.
      // Απλώς λέει στο hook: “ο χρήστης προσπάθησε από A σε B”.
      onMoveAttempt(
        startCell.id,
        endCell.id,
      )

      clearDrag()
    },

    onPanResponderTerminate: () => {
      clearDrag()
    },
  })

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        width: NAB_SVG_WIDTH,
        height: NAB_SVG_HEIGHT,
      }}
    >
      <Svg
        width={NAB_SVG_WIDTH}
        height={NAB_SVG_HEIGHT}
      >
        {savedLines.map((line) => (
          <Line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color}
            strokeWidth={5}
            strokeLinecap='round'
            opacity={0.85}
          />
        ))}

        {cells.map((cell) => {
          const { x, y } = getNabCoordinates(cell)
          const isUsed = usedCellIds.includes(cell.id)

          return (
            <G key={cell.id}>
              <Circle
                cx={x}
                cy={y}
                r={NAB_RADIUS}
                fill={isUsed ? '#d0d0d0' : cell.color}
                stroke={isUsed ? '#777777' : 'black'}
                strokeWidth={2}
                opacity={isUsed ? 0.55 : 1}
                onPress={() => handleCellPress(cell.id)}
              />
            </G>
          )
        })}

        {isDragging && dragStartCell && (
          <Line
            x1={getNabCoordinates(dragStartCell).x}
            y1={getNabCoordinates(dragStartCell).y}
            x2={dragX}
            y2={dragY}
            stroke={getNabPlayerColor(currentPlayer)}
            strokeWidth={5}
            strokeLinecap='round'
            opacity={0.45}
          />
        )}
      </Svg>
    </View>
  )
}

export default NabBoardSvg