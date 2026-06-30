import { useEffect, useState } from "react";

import {
  checkHexWinner,
  createHexCells,
  getNextHexPlayer,
} from "@/utils/hexUtils/hexUtils";

import type { HexCell, HexPlayer } from "@/utils/hexUtils/hexUtils";
import { suggestHexMove } from "@/utils/hexUtils/suggestHexMove";

type Props = {
  boardSize: number;
  isPlayer2Ai?: boolean;
};

export const useHex = ({ boardSize, isPlayer2Ai = false }: Props) => {
  const [cells, setCells] = useState<HexCell[]>(() =>
    createHexCells(boardSize),
  );

  const [currentPlayer, setCurrentPlayer] = useState<HexPlayer>("player1");

  const [winner, setWinner] = useState<HexPlayer | null>(null);

  const [moveCount, setMoveCount] = useState(0);
  const [swapAvailable, setSwapAvailable] = useState(false);

  const handleCellPress = (cellId: number) => {
    if (winner) return false;

    const selectedCell = cells.find((cell) => cell.id === cellId);

    if (!selectedCell) return false;
    if (selectedCell.owner !== null) return false;

    const nextCells = cells.map((cell) => {
      if (cell.id !== cellId) return cell;

      return {
        ...cell,
        owner: currentPlayer,
      };
    });

    setCells(nextCells);

    const hasWinner = checkHexWinner({
      cells: nextCells,
      player: currentPlayer,
      boardSize,
    });

    if (hasWinner) {
      setWinner(currentPlayer);
      return true;
    }

    const nextMoveCount = moveCount + 1;

    setMoveCount(nextMoveCount);

    // Μετά την πρώτη κίνηση του Player 1,
    // ο Player 2 μπορεί να κάνει swap.
    if (currentPlayer === "player1" && moveCount === 0) {
      setSwapAvailable(true);
      setCurrentPlayer("player2");
      return true;
    }

    // Αν ο Player 2 παίξει κανονικά αντί για swap,
    // το swap παύει να είναι διαθέσιμο.
    if (currentPlayer === "player2" && moveCount === 1) {
      setSwapAvailable(false);
    }

    setCurrentPlayer(getNextHexPlayer(currentPlayer));

    return true;
  };

  const handleSwapOpeningMove = () => {
    if (winner) return false;
    if (!swapAvailable) return false;
    if (moveCount !== 1) return false;
    if (currentPlayer !== "player2") return false;

    const nextCells = cells.map((cell) => {
      if (cell.owner !== "player1") return cell;

      return {
        ...cell,
        owner: "player2" as const,
      };
    });

    setCells(nextCells);
    setSwapAvailable(false);

    // Ο Player 2 πήρε την πρώτη κίνηση.
    // Τώρα παίζει ξανά ο Player 1.
    setCurrentPlayer("player1");

    return true;
  };

  useEffect(() => {
    if (!isPlayer2Ai) return;
    if (winner) return;
    if (currentPlayer !== "player2") return;

    const timeoutId = setTimeout(() => {
      const suggestedMove = suggestHexMove({
        cells,
        aiPlayer: "player2",
        boardSize,
      });

      if (!suggestedMove) return;

      console.log("Hex AI move:", suggestedMove);

      handleCellPress(suggestedMove.cellId);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isPlayer2Ai, winner, currentPlayer, cells, boardSize]);

  const restartGame = () => {
    setCells(createHexCells(boardSize));
    setCurrentPlayer("player1");
    setWinner(null);
    setMoveCount(0);
    setSwapAvailable(false);
  };

  return {
    boardSize,
    cells,
    currentPlayer,
    winner,
    moveCount,
    swapAvailable,

    handleCellPress,
    handleSwapOpeningMove,
    restartGame,
  };
};
