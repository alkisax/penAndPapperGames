import {
  useEffect,
  useState,
} from 'react'
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler'
import Svg, {
  Circle,
  G,
  Line,
} from 'react-native-svg'
import { scheduleOnRN } from 'react-native-worklets'

import type { ExternalNabMove } from '@/hooks/nab/useNab'
import {
  createNabCells,
  getNabCellsInLine,
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

type NabPlayer = 'player1' | 'player2'

type Props = {
  handleCellPress: (cellId: number) => void
  currentPlayer: NabPlayer
  onValidMove: (usedCellIds: number[]) => void
  resetVersion: number
  winner: NabPlayer | null
  externalMove: ExternalNabMove | null
  externalMoveVersion: number
}

const NabBoardSvg = ({
  handleCellPress,
  currentPlayer,
  winner,
  onValidMove,
  resetVersion,
  externalMove,
  externalMoveVersion,
}: Props) => {
  const [dragStartCell, setDragStartCell] = useState<NabCell | null>(null)
  const [dragX, setDragX] = useState(0)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [savedLines, setSavedLines] = useState<NabLine[]>([])
  const [usedCellIds, setUsedCellIds] = useState<number[]>([])

  const cells = createNabCells()

  const getPlayerColor = (player: NabPlayer) => {
    if (player === 'player1') {
      return 'blue'
    }

    return 'red'
  }

  const clearDrag = () => {
    scheduleOnRN(setDragStartCell, null)
    scheduleOnRN(setDragX, 0)
    scheduleOnRN(setDragY, 0)
    scheduleOnRN(setIsDragging, false)
  }

  const createLineFromMove = (
    fromCellId: number,
    toCellId: number,
    player: NabPlayer,
  ): NabLine | null => {
    const startCell = cells.find((cell) => cell.id === fromCellId)
    const endCell = cells.find((cell) => cell.id === toCellId)

    if (!startCell || !endCell) return null

    const startPosition = getNabCoordinates(startCell)
    const endPosition = getNabCoordinates(endCell)

    const isSingleCellMove = startCell.id === endCell.id

    const newLineX1 = isSingleCellMove
      ? startPosition.x - NAB_RADIUS * 0.65
      : startPosition.x

    const newLineX2 = isSingleCellMove
      ? startPosition.x + NAB_RADIUS * 0.65
      : endPosition.x

    return {
      id: `line-${Date.now()}-${Math.random()}`,
      fromCellId: startCell.id,
      toCellId: endCell.id,
      x1: newLineX1,
      y1: startPosition.y,
      x2: newLineX2,
      y2: endPosition.y,
      color: getPlayerColor(player),
    }
  }

  useEffect(() => {
    setDragStartCell(null)
    setDragX(0)
    setDragY(0)
    setIsDragging(false)
    setSavedLines([])
    setUsedCellIds([])
  }, [resetVersion])

  useEffect(() => {
    if (!externalMove) return

    const newLine = createLineFromMove(
      externalMove.fromCellId,
      externalMove.toCellId,
      externalMove.player,
    )

    if (!newLine) return

    setSavedLines((prev) => [
      ...prev,
      newLine,
    ])

    setUsedCellIds((prev) => {
      const next = [...prev]

      externalMove.usedCellIds.forEach((cellId) => {
        if (!next.includes(cellId)) {
          next.push(cellId)
        }
      })

      return next
    })
  }, [externalMoveVersion])

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

      console.log('gesture start cell:', startCell.id)
    })
    .onUpdate((event) => {
      // Το gesture τρέχει έξω από το React,
      // άρα με scheduleOnRN αλλάζουμε React state με ασφαλή τρόπο.
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

      if (usedCellIds.includes(endCell.id)) {
        clearDrag()
        return
      }

      const lineCells = getNabCellsInLine(
        dragStartCell,
        endCell,
        cells,
      )

      const lineCellIds = lineCells.map((cell) => cell.id)

      const linePassesThroughUsedCell =
        lineCellIds.some((cellId) =>
          usedCellIds.includes(cellId),
        )

      if (linePassesThroughUsedCell) {
        console.log(
          'invalid line, passes through used cell:',
          lineCellIds,
        )

        clearDrag()
        return
      }

      const newLine = createLineFromMove(
        dragStartCell.id,
        endCell.id,
        currentPlayer,
      )

      if (!newLine) {
        clearDrag()
        return
      }

      scheduleOnRN(setSavedLines, (prev) => [
        ...prev,
        newLine,
      ])

      scheduleOnRN(setUsedCellIds, (prev) => {
        const next = [...prev]

        lineCellIds.forEach((cellId) => {
          if (!next.includes(cellId)) {
            next.push(cellId)
          }
        })

        return next
      })

      scheduleOnRN(onValidMove, lineCellIds)

      console.log('saved nab line:', {
        from: dragStartCell.id,
        to: endCell.id,
        used: lineCellIds,
      })

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
            stroke={getPlayerColor(currentPlayer)}
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