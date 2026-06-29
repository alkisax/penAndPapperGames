import { Direction, PlayerTurn } from "@/types/dandelion.types";
import { blowDandelionSeeds } from "@/utils/dandelionUtils/blowDandelionSeeds";
import { checkDandelionsWinner } from "@/utils/dandelionUtils/checkDandelionsWinner";
import { createDandelionBoard } from "@/utils/dandelionUtils/createDandelionBoard";
import { useState } from "react";

const useDandelions = () => {
  const [playerTurn, setPlayerTurn] = useState<PlayerTurn>("dandelion");
  const [cells, setCells] = useState(createDandelionBoard);
  const [usedDirections, setUsedDirections] = useState<Direction[]>([]);
  const [winner, setWinner] = useState<"dandelion" | "wind" | null>(null);

  const currentPlayerText = `You are playing - ${playerTurn}`;

  const waitingText =
    playerTurn === "dandelion"
      ? "Wind is waiting for move"
      : "Dandelion is waiting for move";

  const handleCellPress = (row: number, col: number, id: number) => {
    if (winner) {
      return;
    }
    if (playerTurn !== "dandelion") {
      return;
    }

    const selectedCell = cells.find((cell) => cell.id === id);

    if (!selectedCell) {
      return;
    }

    if (selectedCell.hasDandelion || selectedCell.hasSeed) {
      return;
    }

    setCells((currentCells) =>
      currentCells.map((cell) => {
        if (cell.id !== id) {
          return cell;
        }

        return {
          ...cell,
          hasDandelion: true,
        };
      }),
    );

    setPlayerTurn("wind");
  };

  const handleWindDirectionPress = (direction: Direction) => {
    if (winner) {
      return;
    }

    if (playerTurn !== "wind") {
      return;
    }

    if (usedDirections.includes(direction)) {
      return;
    }

    const newCells = blowDandelionSeeds(cells, direction);

    const newUsedDirections = [...usedDirections, direction];

    const newWinner = checkDandelionsWinner(newCells, newUsedDirections);

    setCells(newCells);
    setUsedDirections(newUsedDirections);
    setWinner(newWinner);

    if (newWinner) {
      return;
    }

    setPlayerTurn("dandelion");
  };

  const handleResetGame = () => {
    setCells(createDandelionBoard());
    setPlayerTurn("dandelion");
    setUsedDirections([]);
    setWinner(null);
  };

  return {
    cells,
    playerTurn,
    currentPlayerText,
    waitingText,
    usedDirections,
    winner,
    gameOver: winner !== null,
    handleCellPress,
    handleWindDirectionPress,
    handleResetGame,
  };
};

export default useDandelions;
