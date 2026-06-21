// native-penAndPaper\src\hooks\useBlackHole.ts
import { Cell, NumberOfPlayers } from "@/types/blackHole.types";
import { createBoard, getNeighbors } from "@/utils/blackHoleUtils/createBoard";
import { suggestMove } from "@/utils/blackHoleUtils/suggestMove";
import { useState, useEffect } from "react";

type props = {
  numberOfPlayers: number;
};

export const useBlackHole = ({ numberOfPlayers = 2 }: props) => {
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

  useEffect(() => {
    setCells(createBoard(numberOfPlayers));
    setCurrentPlayer(1);
    setPlayer1Value(1);
    setPlayer2Value(1);
    setPlayer3Value(1);
    setWinners([]);
    setGameOver(false);
  }, [numberOfPlayers]);

  const handleCellPress = (cellId: number) => {
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

      calculateScores(updatedCells);
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

    if (nextPlayer === 2) {
      suggestMove({cells});
    }
  };

  const calculateScores = (updatedCells: Cell[]) => {
    const blackHole = cells.find((cell) => cell.isBlackHole);

    if (!blackHole) return;

    const neighbors = getNeighbors(blackHole, cells);

    let player1Score = 0;
    let player2Score = 0;
    let player3Score = 0;

    neighbors.forEach((cell) => {
      if (cell.owner === 1) {
        player1Score += cell.value ?? 0;
      }

      if (cell.owner === 2) {
        player2Score += cell.value ?? 0;
      }

      if (cell.owner === 3) {
        player3Score += cell.value ?? 0;
      }
    });

    // console.log("Player 1:", player1Score);
    // console.log("Player 2:", player2Score);
    // console.log("Player 3:", player3Score);
    setScores({
      player1: player1Score,
      player2: player2Score,
      player3: player3Score,
    });

    const scores = [
      { player: 1, score: player1Score },
      { player: 2, score: player2Score },
      { player: 3, score: player3Score },
    ];

    const minScore =
      numberOfPlayers === 2
        ? Math.min(player1Score, player2Score)
        : Math.min(player1Score, player2Score, player3Score);

    const winners: number[] = [];

    if (player1Score === minScore) winners.push(1);
    if (player2Score === minScore) winners.push(2);

    if (numberOfPlayers === 3 && player3Score === minScore) {
      winners.push(3);
    }

    console.log("Winners:", winners);
    setWinners(winners);
    setGameOver(true);
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
