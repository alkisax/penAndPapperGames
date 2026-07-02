export type NabCell = {
  id: number;
  row: number;
  col: number;
  color: string;
  value?: string;
};

export type NabLine = {
  id: string;
  fromCellId: number;
  toCellId: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
};

export const NAB_RADIUS = 18;
export const NAB_H_SPACING = 48;
export const NAB_V_SPACING = 48;
export const NAB_SVG_WIDTH = 350;
export const NAB_SVG_HEIGHT = 360;
export const NAB_CENTER_X = NAB_SVG_WIDTH / 2;

export const createNabCells = (): NabCell[] => {
  const cells: NabCell[] = [];

  let id = 1;

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col <= row; col++) {
      cells.push({
        id,
        row,
        col,
        color: "white",
        value: String(id),
      });

      id += 1;
    }
  }

  return cells;
};

export const getNabCoordinates = (cell: NabCell) => {
  return {
    x: NAB_CENTER_X - (cell.row * NAB_H_SPACING) / 2 + cell.col * NAB_H_SPACING,
    y: 45 + cell.row * NAB_V_SPACING,
  };
};

export const getNearestNabCell = (
  x: number,
  y: number,
  cells: NabCell[],
): NabCell | null => {
  let nearestCell: NabCell | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const cell of cells) {
    const cellPosition = getNabCoordinates(cell);

    const dx = x - cellPosition.x;
    const dy = y - cellPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCell = cell;
    }
  }

  if (nearestDistance > NAB_RADIUS * 1.8) {
    return null;
  }

  return nearestCell;
};

export const areNabCellsAligned = (a: NabCell, b: NabCell) => {
  if (a.id === b.id) return false;

  const sameRow = a.row === b.row;
  const sameCol = a.col === b.col;
  const sameDiagonal = a.row - a.col === b.row - b.col;

  return sameRow || sameCol || sameDiagonal;
};

export const getNearestAlignedNabCell = (
  x: number,
  y: number,
  startCell: NabCell,
  cells: NabCell[],
): NabCell | null => {
  let nearestCell: NabCell | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const cell of cells) {
    if (cell.id !== startCell.id && !areNabCellsAligned(startCell, cell)) {
      continue;
    }

    const cellPosition = getNabCoordinates(cell);

    const dx = x - cellPosition.x;
    const dy = y - cellPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCell = cell;
    }
  }

  if (nearestDistance > NAB_RADIUS * 1.8) {
    return null;
  }

  return nearestCell;
};

export const getNabCellsInLine = (
  startCell: NabCell,
  endCell: NabCell,
  cells: NabCell[],
): NabCell[] => {
  if (startCell.id === endCell.id) return [startCell];
  if (!areNabCellsAligned(startCell, endCell)) return [];
  if (startCell.row === endCell.row) {
    const minCol = Math.min(startCell.col, endCell.col);
    const maxCol = Math.max(startCell.col, endCell.col);

    return cells.filter(
      (cell) =>
        cell.row === startCell.row && cell.col >= minCol && cell.col <= maxCol,
    );
  }

  if (startCell.col === endCell.col) {
    const minRow = Math.min(startCell.row, endCell.row);
    const maxRow = Math.max(startCell.row, endCell.row);

    return cells.filter(
      (cell) =>
        cell.col === startCell.col && cell.row >= minRow && cell.row <= maxRow,
    );
  }

  const startDiagonal = startCell.row - startCell.col;

  if (startDiagonal === endCell.row - endCell.col) {
    const minRow = Math.min(startCell.row, endCell.row);
    const maxRow = Math.max(startCell.row, endCell.row);

    return cells.filter(
      (cell) =>
        cell.row - cell.col === startDiagonal &&
        cell.row >= minRow &&
        cell.row <= maxRow,
    );
  }

  return [];
};


