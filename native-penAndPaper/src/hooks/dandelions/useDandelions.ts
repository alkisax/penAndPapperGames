// native-penAndPaper/src/hooks/dandelions/useDandelions.ts

import { useState } from "react";

type PlayerTurn = "dandelion" | "wind";

type DandelionCell = {
  id: number;
  row: number;
  col: number;
  hasDandelion: boolean;
  hasSeed: boolean;
};

type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

const blowSeeds = (
  cells: DandelionCell[],
  direction: Direction,
): DandelionCell[] => {
  const delta = DIRECTION_DELTAS[direction];

  const dandelions = cells.filter((cell) => cell.hasDandelion);

  const seedCellIds = new Set<number>();

  dandelions.forEach((dandelion) => {
    let nextRow = dandelion.row + delta.row;
    let nextCol = dandelion.col + delta.col;

    while (
      nextRow >= 0 &&
      nextRow < BOARD_SIZE &&
      nextCol >= 0 &&
      nextCol < BOARD_SIZE
    ) {
      const targetCell = cells.find(
        (cell) => cell.row === nextRow && cell.col === nextCol,
      );

      if (targetCell && !targetCell.hasDandelion) {
        seedCellIds.add(targetCell.id);
      }

      nextRow += delta.row;
      nextCol += delta.col;
    }
  });

  return cells.map((cell) => {
    if (!seedCellIds.has(cell.id)) {
      return cell;
    }

    return {
      ...cell,
      hasSeed: true,
    };
  });
};

const DIRECTION_DELTAS: Record<Direction, { row: number; col: number }> = {
  N: { row: -1, col: 0 },
  NE: { row: -1, col: 1 },
  E: { row: 0, col: 1 },
  SE: { row: 1, col: 1 },
  S: { row: 1, col: 0 },
  SW: { row: 1, col: -1 },
  W: { row: 0, col: -1 },
  NW: { row: -1, col: -1 },
};

const BOARD_SIZE = 6;

const createInitialCells = (): DandelionCell[] => {
  return Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;

    return {
      id: index + 1,
      row,
      col,
      hasDandelion: false,
      hasSeed: false,
    };
  });
};

const useDandelions = () => {
  const [playerTurn, setPlayerTurn] = useState<PlayerTurn>("dandelion");
  const [cells, setCells] = useState<DandelionCell[]>(createInitialCells);
  const [usedDirections, setUsedDirections] = useState<Direction[]>([]);

  const handleResetGame = () => {
    setCells(createInitialCells());
    setPlayerTurn("dandelion");
    setUsedDirections([]);
  };

  const currentPlayerText = `You are playing - ${playerTurn}`;

  const waitingText =
    playerTurn === "dandelion"
      ? "Wind is waiting for move"
      : "Dandelion is waiting for move";

  const switchTurn = () => {
    setPlayerTurn((currentTurn) =>
      currentTurn === "dandelion" ? "wind" : "dandelion",
    );
  };

  const handleWindDirectionPress = (direction: Direction) => {
    if (playerTurn !== "wind") {
      return;
    }
    if (usedDirections.includes(direction)) {
      return;
    }

    console.log("wind direction:", direction);
    setCells((currentCells) => blowSeeds(currentCells, direction));
    setUsedDirections((currentDirections) => [...currentDirections, direction]);
    setPlayerTurn("dandelion");
  };

  const handleCellPress = (row: number, col: number, id: number) => {
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

  return {
    cells,
    playerTurn,
    currentPlayerText,
    waitingText,
    handleCellPress,
    usedDirections,
    handleWindDirectionPress,
    handleResetGame,
  };
};

export default useDandelions;
