import {
  useEffect,
  useState,
} from 'react'

import type {
  CollectorCell,
} from '@/components/svg/collector/CollectorCellsLayer'

import {
  calculateWinner,
  createAllConnectionLines,
  createCollectorCells,
  getAdjacentEmptyCells,
  getBlockedState,
  getNextPlayer,
  hasLegalTurn,
  areAdjacent,
} from '@/utils/collector/collectorUtils'

import type {
  CollectorConnectionLine,
  CollectorPlayer,
  CollectorWinner,
} from '@/utils/collector/collectorUtils'

import {
  suggestCollectorMove,
} from '@/utils/collector/suggestCollectorMove'

import type {
  CollectorSuggestedMove,
} from '@/utils/collector/suggestCollectorMove'

type CollectorPhase = 'mark' | 'eliminate'

export type CollectorMove = {
  markCellId: string
  blockCellId: string
}

export type {
  CollectorConnectionLine,
  CollectorPlayer,
  CollectorWinner,
  CollectorSuggestedMove,
}

export const useCollector = () => {
  const [cells, setCells] =
    useState<CollectorCell[]>(createCollectorCells)

  const [currentPlayer, setCurrentPlayer] =
    useState<CollectorPlayer>('player1')

  const [phase, setPhase] =
    useState<CollectorPhase>('mark')

  const [markedCellIdThisTurn, setMarkedCellIdThisTurn] =
    useState<string | null>(null)

  const [gameOver, setGameOver] =
    useState(false)

  const [winner, setWinner] =
    useState<CollectorWinner>(null)

  const [player1LargestGroup, setPlayer1LargestGroup] =
    useState(0)

  const [player2LargestGroup, setPlayer2LargestGroup] =
    useState(0)

  const [suggestedMove, setSuggestedMove] =
    useState<CollectorSuggestedMove | null>(null)

  const finishGameIfNeeded = (
    nextCells: CollectorCell[],
  ) => {
    if (hasLegalTurn(nextCells)) {
      return false
    }

    const result = calculateWinner(nextCells)

    setWinner(result.winner)
    setPlayer1LargestGroup(result.player1LargestGroup)
    setPlayer2LargestGroup(result.player2LargestGroup)
    setGameOver(true)

    return true
  }

  const applyCollectorMove = (
    move: CollectorMove,
    player: CollectorPlayer,
  ) => {
    if (gameOver) return false

    const markCell = cells.find((cell) =>
      cell.id === move.markCellId
    )

    const blockCell = cells.find((cell) =>
      cell.id === move.blockCellId
    )

    if (!markCell || !blockCell) return false
    if (markCell.state !== 'empty') return false
    if (blockCell.state !== 'empty') return false
    if (!areAdjacent(markCell, blockCell)) return false

    const nextCells: CollectorCell[] = cells.map((cell) => {
      if (cell.id === move.markCellId) {
        return {
          ...cell,
          state: player,
        }
      }

      if (cell.id === move.blockCellId) {
        return {
          ...cell,
          state: getBlockedState(player),
        }
      }

      return cell
    })

    setCells(nextCells)
    setMarkedCellIdThisTurn(null)
    setPhase('mark')

    const gameFinished = finishGameIfNeeded(nextCells)

    if (!gameFinished) {
      setCurrentPlayer(getNextPlayer(player))
    }

    return true
  }

  const handleCellPress = (
    row: number,
    col: number,
    cellId: string,
  ) => {
    if (gameOver) return false

    const selectedCell = cells.find((cell) =>
      cell.id === cellId
    )

    if (!selectedCell) return false
    if (selectedCell.state !== 'empty') return false

    if (phase === 'mark') {
      const adjacentEmptyCells = getAdjacentEmptyCells(
        selectedCell,
        cells,
      )

      if (adjacentEmptyCells.length === 0) {
        console.log(
          'cannot mark cell - no adjacent empty cell:',
          {
            row,
            col,
            cellId,
            currentPlayer,
          },
        )

        return false
      }

      const nextCells: CollectorCell[] = cells.map((cell) => {
        if (cell.id !== cellId) return cell

        return {
          ...cell,
          state: currentPlayer,
        }
      })

      setCells(nextCells)
      setMarkedCellIdThisTurn(cellId)
      setPhase('eliminate')

      console.log('collector mark:', {
        row,
        col,
        cellId,
        currentPlayer,
      })

      return true
    }

    if (!markedCellIdThisTurn) return false

    const markedCell = cells.find((cell) =>
      cell.id === markedCellIdThisTurn
    )

    if (!markedCell) return false

    if (!areAdjacent(markedCell, selectedCell)) {
      console.log('not adjacent:', {
        markedCell,
        selectedCell,
      })

      return false
    }

    const nextCells: CollectorCell[] = cells.map((cell) => {
      if (cell.id !== cellId) return cell

      return {
        ...cell,
        state: getBlockedState(currentPlayer),
      }
    })

    setCells(nextCells)

    console.log('collector eliminate:', {
      row,
      col,
      cellId,
      currentPlayer,
    })

    setMarkedCellIdThisTurn(null)
    setPhase('mark')

    const gameFinished = finishGameIfNeeded(nextCells)

    if (gameFinished) {
      return true
    }

    setCurrentPlayer((prev) =>
      getNextPlayer(prev)
    )

    return true
  }

  useEffect(() => {
    if (gameOver) {
      setSuggestedMove(null)
      return
    }

    if (phase !== 'mark') {
      setSuggestedMove(null)
      return
    }

    const nextSuggestedMove = suggestCollectorMove(
      cells,
      currentPlayer,
    )

    setSuggestedMove(nextSuggestedMove)
  }, [
    cells,
    currentPlayer,
    phase,
    gameOver,
  ])

  const restartGame = () => {
    setCells(createCollectorCells())
    setCurrentPlayer('player1')
    setPhase('mark')
    setMarkedCellIdThisTurn(null)
    setGameOver(false)
    setWinner(null)
    setPlayer1LargestGroup(0)
    setPlayer2LargestGroup(0)
    setSuggestedMove(null)
  }

  const connectionLines =
    createAllConnectionLines(cells)

  return {
    cells,
    currentPlayer,
    phase,
    markedCellIdThisTurn,

    gameOver,
    winner,
    player1LargestGroup,
    player2LargestGroup,
    connectionLines,
    suggestedMove,

    handleCellPress,
    applyCollectorMove,
    restartGame,
  }
}