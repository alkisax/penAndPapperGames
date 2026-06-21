// native-penAndPaper\src\utils\blackHoleUtils\createBoard.ts
import type { Cell } from "@/types/blackHole.types";

export const createBoard = (numberOfPlayers = 2): Cell[] => {
  const cells: Cell[] = [];
  let id = 1;
  const numberOfRows = numberOfPlayers === 3 ? 7 : 6;
  for (let row = 0; row < numberOfRows; row++) {
    for (let col = 0; col <= row; col++) {
      cells.push({
        id,
        row,
        col,
        owner: null,
        value: null,
        color: "white",
        isBlackHole: false,
      });

      id += 1;
    }
  }
  return cells;
};

export const getNeighbors = (targetCell: Cell, cells: Cell[]): Cell[] => {
  const positions = [
    { row: targetCell.row, col: targetCell.col - 1 },
    { row: targetCell.row, col: targetCell.col + 1 },

    { row: targetCell.row - 1, col: targetCell.col - 1 },
    { row: targetCell.row - 1, col: targetCell.col },

    { row: targetCell.row + 1, col: targetCell.col },
    { row: targetCell.row + 1, col: targetCell.col + 1 },
  ];

  return positions
    .map((position) =>
      cells.find(
        (cell) => cell.row === position.row && cell.col === position.col,
      ),
    )
    .filter((cell): cell is Cell => cell !== undefined);
};
