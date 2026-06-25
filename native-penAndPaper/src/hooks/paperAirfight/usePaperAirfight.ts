import { useEffect, useState } from "react";
import { AppColors } from "@/styles/global";
import { tweenPosition } from "@/utils/tweenPosition";
import { lineHitsCircle } from "@/utils/lineCircleCollision";
import { suggestPaperAirfightMove } from "@/utils/paperAirfightUtils/suggestPaperAirfightMove";

export type PaperAirfightPlayer = "x" | "o";

export type PaperAirfightPiece = {
  id: string;
  type: PaperAirfightPlayer;
  x: number;
  y: number;
  color: string;
  isAlive: boolean;
  size: number;
};

export type TrailLine = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
};

export type ShotResult = {
  power: number;
  angle: number;
};

type Props = {
  colors: AppColors;
  isOAi?: boolean;
};

const BOARD_WIDTH = 380;
const BOARD_HEIGHT = 620;
const MAX_MOVE_DISTANCE = BOARD_HEIGHT / 7;
const SPRITE_PADDING = 18;
const PIECE_SIZE = 12;

const createInitialPieces = (colors: AppColors): PaperAirfightPiece[] => [
  // X player
  {
    id: "x-1",
    type: "x",
    x: 90,
    y: 555,
    color: colors.player1,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "x-2",
    type: "x",
    x: 140,
    y: 535,
    color: colors.player1,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "x-3",
    type: "x",
    x: 190,
    y: 520,
    color: colors.player1,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "x-4",
    type: "x",
    x: 240,
    y: 535,
    color: colors.player1,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "x-5",
    type: "x",
    x: 290,
    y: 555,
    color: colors.player1,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "x-6",
    type: "x",
    x: 115,
    y: 585,
    color: colors.player1,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "x-7",
    type: "x",
    x: 165,
    y: 575,
    color: colors.player1,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "x-8",
    type: "x",
    x: 215,
    y: 575,
    color: colors.player1,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "x-9",
    type: "x",
    x: 265,
    y: 585,
    color: colors.player1,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "x-10",
    type: "x",
    x: 190,
    y: 600,
    color: colors.player1,
    isAlive: true,
    size: PIECE_SIZE,
  },

  // O player
  {
    id: "o-1",
    type: "o",
    x: 90,
    y: 65,
    color: colors.player3,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "o-2",
    type: "o",
    x: 140,
    y: 85,
    color: colors.player3,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "o-3",
    type: "o",
    x: 190,
    y: 100,
    color: colors.player3,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "o-4",
    type: "o",
    x: 240,
    y: 85,
    color: colors.player3,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "o-5",
    type: "o",
    x: 290,
    y: 65,
    color: colors.player3,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "o-6",
    type: "o",
    x: 115,
    y: 35,
    color: colors.player3,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "o-7",
    type: "o",
    x: 165,
    y: 45,
    color: colors.player3,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "o-8",
    type: "o",
    x: 215,
    y: 45,
    color: colors.player3,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "o-9",
    type: "o",
    x: 265,
    y: 35,
    color: colors.player3,
    isAlive: true,
    size: PIECE_SIZE,
  },
  {
    id: "o-10",
    type: "o",
    x: 190,
    y: 20,
    color: colors.player3,
    isAlive: true,
    size: PIECE_SIZE,
  },
];

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max));
};

export const usePaperAirfight = ({ colors, isOAi = false }: Props) => {
  // State
  const [power, setPower] = useState(0);
  const [angle, setAngle] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState<PaperAirfightPlayer>("x");
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pieces, setPieces] = useState<PaperAirfightPiece[]>(() =>
    createInitialPieces(colors),
  );
  const [ghostPieces, setGhostPieces] = useState<PaperAirfightPiece[]>([]);
  const [trailLines, setTrailLines] = useState<TrailLine[]>([]);
  const [winner, setWinner] = useState<PaperAirfightPlayer | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Derived state
  const selectedPiece = pieces.find(
    (piece) =>
      piece.id === selectedPieceId &&
      piece.isAlive &&
      piece.type === currentPlayer,
  );

  // Select
  const handleSelectPiece = (pieceId: string) => {
    if (isAnimating) return;

    const piece = pieces.find((piece) => piece.id === pieceId);

    if (!piece) return;
    if (!piece.isAlive) return;
    if (piece.type !== currentPlayer) return;

    setSelectedPieceId(pieceId);
  };

  // Shot by explicit piece id - useful for multiplayer
  const handleShotForPiece = (pieceId: string, result: ShotResult) => {
    if (gameOver) return false;
    if (isAnimating) return false;

    const piece = pieces.find(
      (piece) =>
        piece.id === pieceId && piece.isAlive && piece.type === currentPlayer,
    );

    if (!piece) return false;

    setIsAnimating(true);
    setPower(result.power);
    setAngle(result.angle);
    setSelectedPieceId(null);

    const distance = (result.power / 100) * MAX_MOVE_DISTANCE;
    const radians = (result.angle * Math.PI) / 180;
    const nextX = piece.x + Math.cos(radians) * distance;
    const nextY = piece.y + Math.sin(radians) * distance;
    const clampedX = clamp(nextX, SPRITE_PADDING, BOARD_WIDTH - SPRITE_PADDING);
    const clampedY = clamp(
      nextY,
      SPRITE_PADDING,
      BOARD_HEIGHT - SPRITE_PADDING,
    );

    const isInsideGoal = (
      player: PaperAirfightPlayer,
      x: number,
      y: number,
    ) => {
      const goalWidth = BOARD_WIDTH * 0.2;
      const goalHeight = 42;

      const goalLeft = BOARD_WIDTH / 2 - goalWidth / 2;
      const goalRight = BOARD_WIDTH / 2 + goalWidth / 2;

      const isInsideGoalX = x >= goalLeft && x <= goalRight;

      if (player === "x") {
        return isInsideGoalX && y <= goalHeight;
      }

      return isInsideGoalX && y >= BOARD_HEIGHT - goalHeight;
    };

    // Collision check
    const hitPieceIds = pieces
      .filter((targetPiece) => targetPiece.isAlive)
      .filter((targetPiece) => targetPiece.id !== piece.id)
      .filter((targetPiece) => targetPiece.type !== piece.type)
      .filter((targetPiece) =>
        lineHitsCircle(
          { x: piece.x, y: piece.y },
          { x: clampedX, y: clampedY },
          { x: targetPiece.x, y: targetPiece.y },
          targetPiece.size,
        ),
      )
      .map((targetPiece) => targetPiece.id);

    // Old position ghost
    setGhostPieces((prev) => [
      ...prev,
      {
        ...piece,
        id: `ghost-${Date.now()}`,
        color: colors.ghostPiece,
      },
    ]);

    // Move selected piece
    tweenPosition({
      from: {
        x: piece.x,
        y: piece.y,
      },
      to: {
        x: clampedX,
        y: clampedY,
      },
      onUpdate: (position) => {
        // Visual trail trick: start -> current frame
        const previousPosition = {
          x: piece.x,
          y: piece.y,
        };

        setPieces((prev) =>
          prev.map((currentPiece) => {
            if (currentPiece.id !== piece.id) return currentPiece;

            return {
              ...currentPiece,
              x: position.x,
              y: position.y,
            };
          }),
        );

        setTrailLines((prev) => [
          ...prev,
          {
            id: `trail-${Date.now()}-${prev.length}`,
            x1: previousPosition.x,
            y1: previousPosition.y,
            x2: position.x,
            y2: position.y,
            color: piece.color,
          },
        ]);
      },
      onComplete: () => {
        const scoredGoal = isInsideGoal(piece.type, clampedX, clampedY);

        setPieces((prev) => {
          const nextPieces = prev.map((currentPiece) => {
            if (!hitPieceIds.includes(currentPiece.id)) {
              return currentPiece;
            }

            return {
              ...currentPiece,
              isAlive: false,
              color: colors.deadPiece,
            };
          });

          const opponentAlivePieces = nextPieces.filter(
            (currentPiece) =>
              currentPiece.type !== piece.type && currentPiece.isAlive,
          );

          if (scoredGoal || opponentAlivePieces.length === 0) {
            setWinner(piece.type);
            setGameOver(true);
            setIsAnimating(false);
            return nextPieces;
          }

          setIsAnimating(false);
          setCurrentPlayer((prevPlayer) => (prevPlayer === "x" ? "o" : "x"));

          return nextPieces;
        });
      },
    });

    return true;
  };

  // Shot from selected piece - used by slingshot
  const handleShot = (result: ShotResult) => {
    if (!selectedPieceId) return false;

    return handleShotForPiece(selectedPieceId, result);
  };

  // Reset
  const restartGame = () => {
    setPower(0);
    setAngle(0);
    setCurrentPlayer("x");
    setSelectedPieceId(null);
    setIsAnimating(false);
    setWinner(null);
    setGameOver(false);
    setPieces(createInitialPieces(colors));
    setGhostPieces([]);
    setTrailLines([]);
  };

  useEffect(() => {
    if (!isOAi) return;
    if (currentPlayer !== "o") return;
    if (isAnimating) return;

    const timeoutId = setTimeout(() => {
      const suggestedMove = suggestPaperAirfightMove({
        aiPlayer: "o",
        pieces,
        boardWidth: BOARD_WIDTH,
        boardHeight: BOARD_HEIGHT,
        maxMoveDistance: MAX_MOVE_DISTANCE,
      });

      if (!suggestedMove) return;

      handleShotForPiece(suggestedMove.pieceId, suggestedMove.shot);
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [currentPlayer, handleShotForPiece, isAnimating, isOAi, pieces]);

  return {
    boardWidth: BOARD_WIDTH,
    boardHeight: BOARD_HEIGHT,
    power,
    angle,
    currentPlayer,
    selectedPieceId,
    selectedPiece,
    pieces,
    ghostPieces,
    trailLines,
    isAnimating,
    handleSelectPiece,
    handleShot,
    handleShotForPiece,
    restartGame,
    isOAi,
    winner,
    gameOver,
  };
};
