// native-penAndPaper\src\components\svg\nab\NabBoardSvg.tsx
import { useEffect, useState } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Svg, { Circle, G, Line } from 'react-native-svg'
import { scheduleOnRN } from 'react-native-worklets'

import {
  getNabCoordinates,
  getNearestAlignedNabCell,
  getNearestNabCell,
  NAB_RADIUS,
  NAB_SVG_HEIGHT,
  NAB_SVG_WIDTH,
} from '@/utils/nab/nabSvgUtils'
import type { NabCell, NabLine } from '@/utils/nab/nabSvgUtils'
import { getNabPlayerColor } from '@/utils/nab/nabGameUtils'
import type { NabPlayer } from '@/utils/nab/nabGameUtils'

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

  // Καθαρίζει μόνο το προσωρινό gesture state.
  // Το πραγματικό game state το κρατάει το useNab.
  useEffect(() => {
    setDragStartCell(null)
    setDragX(0)
    setDragY(0)
    setIsDragging(false)
  }, [resetVersion])

  const clearDrag = () => {
    scheduleOnRN(setDragStartCell, null)
    scheduleOnRN(setDragX, 0)
    scheduleOnRN(setDragY, 0)
    scheduleOnRN(setIsDragging, false)
  }

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      if (winner) return

      const startCell = getNearestNabCell(
        event.x,
        event.y,
        cells,
      )

      if (!startCell) return
      if (usedCellIds.includes(startCell.id)) return

      const startPosition = getNabCoordinates(startCell)

      scheduleOnRN(setDragStartCell, startCell)
      scheduleOnRN(setDragX, startPosition.x)
      scheduleOnRN(setDragY, startPosition.y)
      scheduleOnRN(setIsDragging, true)
    })
    .onUpdate((event) => {
      // Το gesture τρέχει έξω από το React.
      // Με scheduleOnRN στέλνουμε το state update πίσω στο React.
      scheduleOnRN(setDragX, event.x)
      scheduleOnRN(setDragY, event.y)
    })
    .onEnd((event) => {
      if (!dragStartCell) {
        clearDrag()
        return
      }

      const endCell = getNearestAlignedNabCell(
        event.x,
        event.y,
        dragStartCell,
        cells,
      )

      if (!endCell) {
        clearDrag()
        return
      }

      // Το SVG δεν αποφασίζει αν η κίνηση είναι valid.
      // Απλώς λέει στο hook: “ο χρήστης προσπάθησε από A σε B”.
      scheduleOnRN(
        onMoveAttempt,
        dragStartCell.id,
        endCell.id,
      )

      clearDrag()
    })

  return (
    <GestureDetector gesture={panGesture}>
      <Svg
        width={NAB_SVG_WIDTH}
        height={NAB_SVG_HEIGHT}
      >
        {cells.map((cell) => {
          const { x, y } = getNabCoordinates(cell)

          return (
            <G key={cell.id}>
              <Circle
                cx={x}
                cy={y}
                r={NAB_RADIUS}
                fill={cell.color}
                stroke='black'
                strokeWidth={2}
                onPress={() => handleCellPress(cell.id)}
              />
            </G>
          )
        })}

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
    </GestureDetector>
  )
}

export default NabBoardSvg