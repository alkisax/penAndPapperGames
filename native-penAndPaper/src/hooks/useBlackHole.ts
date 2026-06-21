import { useState } from "react";

export const useBlackHole = () => {
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)

  const handleCellPress = (cellId: number) => {
    console.log(`Player ${currentPlayer} selected cell ${cellId}`)
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
  }
  return {
    currentPlayer,
    handleCellPress
  }
}