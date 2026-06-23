// native-penAndPaper\src\hooks\useBlackHole.ts
import {
  Cell,
  NumberOfPlayers,
  PlayerControllers,
} from "@/types/blackHole.types";
import { createBoard } from "@/utils/blackHoleUtils/createBoard";
import { suggestMove } from "@/utils/blackHoleUtils/suggestMove";
import { useState, useEffect } from "react";
import { calculateBlackHoleResult } from "@/utils/blackHoleUtils/calculateBlackHoleResult";

type props = {
  numberOfPlayers: number;
  playerControllers: PlayerControllers;
};

export const useBlackHole = ({
  numberOfPlayers = 2,
  playerControllers,
}: props) => {
  const [currentPlayer, setCurrentPlayer] = useState<NumberOfPlayers>(1);
  const [cells, setCells] = useState<Cell[]>(createBoard(numberOfPlayers));
  const [player1Value, setPlayer1Value] = useState(1);
  const [player2Value, setPlayer2Value] = useState(1);
  const [player3Value, setPlayer3Value] = useState(1);
  const [winners, setWinners] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({
    player1: 0,
    player2: 0,
    player3: 0,
  });

  const getCurrentPlayerController = () => {
    if (currentPlayer === 1) return playerControllers.player1;
    if (currentPlayer === 2) return playerControllers.player2;

    return playerControllers.player3;
  };

  useEffect(() => {
    setCells(createBoard(numberOfPlayers));
    setCurrentPlayer(1);
    setPlayer1Value(1);
    setPlayer2Value(1);
    setPlayer3Value(1);
    setWinners([]);
    setGameOver(false);
  }, [numberOfPlayers]);

  // ai player in useEffect
  useEffect(() => {
    if (getCurrentPlayerController() !== "ai") return;
    if (gameOver) return;

    const suggestedMove = suggestMove({
      cells,
    });

    if (suggestedMove === null) return;

    const timeoutId = setTimeout(() => {
      handleCellPress(suggestedMove);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentPlayer, playerControllers, gameOver, cells]);

  const handleCellPress = (cellId: number) => {
    if (gameOver) return;

    const currentPlayerController = getCurrentPlayerController();

    if (currentPlayerController === "remote") {
      console.log(`Player ${currentPlayer} is remote`);
      return;
    }

    let value = player1Value;

    if (currentPlayer === 2) {
      value = player2Value;
    } else if (currentPlayer === 3) {
      value = player3Value;
    }

    const selectedCell = cells.find((cell) => cell.id === cellId);

    if (!selectedCell) return;
    if (selectedCell.owner !== null) return;

    const updatedCells = cells.map((cell) => {
      if (cell.id !== cellId) return cell;

      return {
        ...cell,
        owner: currentPlayer,
        color:
          currentPlayer === 1 ? "blue" : currentPlayer === 2 ? "green" : "red",
        value,
      };
    });

    const emptyCells = updatedCells.filter((cell) => cell.owner === null);

    if (emptyCells.length === 1) {
      const blackHoleId = emptyCells[0].id;

      updatedCells.forEach((cell) => {
        if (cell.id === blackHoleId) {
          cell.isBlackHole = true;
          cell.color = "black";
        }
      });

      const result = calculateBlackHoleResult(updatedCells, numberOfPlayers);

      if (result) {
        setScores(result.scores);
        setWinners(result.winners);
        setGameOver(true);

        console.log("Winners:", result.winners);
      }
    }

    setCells(updatedCells);

    if (currentPlayer === 1) {
      setPlayer1Value(player1Value + 1);
    } else if (currentPlayer === 2) {
      setPlayer2Value(player2Value + 1);
    } else {
      setPlayer3Value(player3Value + 1);
    }

    console.log(`Player ${currentPlayer} selected cell ${cellId}`);

    let nextPlayer: NumberOfPlayers;

    if (numberOfPlayers === 3) {
      if (currentPlayer === 1) {
        nextPlayer = 2;
      } else if (currentPlayer === 2) {
        nextPlayer = 3;
      } else {
        nextPlayer = 1;
      }
    } else {
      nextPlayer = currentPlayer === 1 ? 2 : 1;
    }
    setCurrentPlayer(nextPlayer);
  };

  const playAgain = () => {
    setCells(createBoard(numberOfPlayers));
    setCurrentPlayer(1);
    setPlayer1Value(1);
    setPlayer2Value(1);
    setPlayer3Value(1);

    setWinners([]);
    setGameOver(false);
  };

  return {
    currentPlayer,
    handleCellPress,
    cells,
    winners,
    gameOver,
    playAgain,
    scores,
  };
};
