// native-penAndPaper/src/hooks/imparium/useImparium.ts

import {
  useEffect,
  useState,
} from 'react'

import type {
  ImpariumCell,
} from '@/components/svg/imparium/ImpariumBoardSvg'

import {
  areOrthogonallyAdjacent,
  calculateImpariumWinner,
  claimNewClosedRegions,
  countImpariumClaimedCells,
  createImpariumCells,
  getCoveredState,
  getImpariumPlayerLabel,
  getNextImpariumPlayer,
  hasAvailableDominoMove,
} from '@/utils/imparium/impariumUtils'

import type {
  ImpariumPlayer,
  ImpariumWinner,
} from '@/utils/imparium/impariumUtils'

import {
  suggestImpariumMove,
} from '@/utils/imparium/suggestImpariumMove'

export type ImpariumMove = {
  firstCellId: string
  secondCellId: string
}

export type {
  ImpariumPlayer,
  ImpariumWinner,
}

type UseImpariumParams = {
  enableAi?: boolean
}

export const useImparium = ({
  enableAi = true,
}: UseImpariumParams = {}) => {
  const [cells, setCells] =
    useState<ImpariumCell[]>(createImpariumCells)

  const [currentPlayer, setCurrentPlayer] =
    useState<ImpariumPlayer>('player1')

  const [selectedCellId, setSelectedCellId] =
    useState<string | null>(null)

  const [gameOver, setGameOver] =
    useState(false)

  const [winner, setWinner] =
    useState<ImpariumWinner>(null)

  const [isPlayer2Ai, setIsPlayer2Ai] =
    useState(false)

  const applyImpariumMove = (
    move: ImpariumMove,
    player: ImpariumPlayer,
  ) => {
    if (gameOver) return false

    const firstCell = cells.find((cell) =>
      cell.id === move.firstCellId
    )

    const secondCell = cells.find((cell) =>
      cell.id === move.secondCellId
    )

    if (!firstCell || !secondCell) return false
    if (firstCell.state !== 'empty') return false
    if (secondCell.state !== 'empty') return false

    if (!areOrthogonallyAdjacent(firstCell, secondCell)) {
      return false
    }

    const cellsAfterDomino: ImpariumCell[] = cells.map((cell) => {
      if (
        cell.id === firstCell.id ||
        cell.id === secondCell.id
      ) {
        return {
          ...cell,
          state: getCoveredState(player),
        }
      }

      return cell
    })

    const cellsAfterClaims = claimNewClosedRegions(
      cellsAfterDomino,
      player,
    )

    const hasMoveAfterThis =
      hasAvailableDominoMove(cellsAfterClaims)

    setCells(cellsAfterClaims)
    setSelectedCellId(null)

    if (!hasMoveAfterThis) {
      setGameOver(true)
      setWinner(
        calculateImpariumWinner(cellsAfterClaims),
      )

      return true
    }

    setCurrentPlayer(
      getNextImpariumPlayer(player),
    )

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

    if (!selectedCellId) {
      setSelectedCellId(cellId)

      console.log('imparium first cell:', {
        row,
        col,
        cellId,
        currentPlayer,
      })

      return true
    }

    if (selectedCellId === cellId) {
      setSelectedCellId(null)
      return true
    }

    const moveWasApplied = applyImpariumMove(
      {
        firstCellId: selectedCellId,
        secondCellId: cellId,
      },
      currentPlayer,
    )

    if (!moveWasApplied) {
      console.log('invalid imparium domino:', {
        selectedCellId,
        cellId,
      })

      setSelectedCellId(null)
      return false
    }

    return true
  }

  useEffect(() => {
    if (!enableAi) return
    if (!isPlayer2Ai) return
    if (gameOver) return
    if (currentPlayer !== 'player2') return
    if (selectedCellId) return

    const timeoutId = setTimeout(() => {
      const suggestedMove = suggestImpariumMove({
        cells,
        player: 'player2',
      })

      if (!suggestedMove) return

      applyImpariumMove(
        {
          firstCellId: suggestedMove.firstCellId,
          secondCellId: suggestedMove.secondCellId,
        },
        'player2',
      )
    }, 600)

    return () => clearTimeout(timeoutId)
  }, [
    enableAi,
    isPlayer2Ai,
    gameOver,
    currentPlayer,
    selectedCellId,
    cells,
  ])

  const restartGame = () => {
    setCells(createImpariumCells())
    setCurrentPlayer('player1')
    setSelectedCellId(null)
    setGameOver(false)
    setWinner(null)
  }

  const score = countImpariumClaimedCells(cells)

  const turnText = gameOver
    ? 'Game over'
    : enableAi && isPlayer2Ai && currentPlayer === 'player2'
      ? 'Red AI thinking...'
      : selectedCellId
        ? `${getImpariumPlayerLabel(currentPlayer)}: choose adjacent cell`
        : `${getImpariumPlayerLabel(currentPlayer)}: place domino`

  return {
    cells,
    currentPlayer,
    selectedCellId,

    gameOver,
    winner,
    score,
    turnText,

    isPlayer2Ai,
    setIsPlayer2Ai,

    handleCellPress,
    applyImpariumMove,
    restartGame,
  }
}