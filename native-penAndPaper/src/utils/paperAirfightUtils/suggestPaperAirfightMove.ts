import {
  PaperAirfightPiece,
  ShotResult,
} from "@/hooks/paperAirfight/usePaperAirfight";
import { lineHitsCircle } from "@/utils/lineCircleCollision";
import { distortShot } from "@/utils/paperAirfightUtils/distortShot";

type Props = {
  aiPlayer: "x" | "o";
  pieces: PaperAirfightPiece[];
  boardWidth: number;
  boardHeight: number;
  maxMoveDistance: number;
};

type CandidateMove = {
  pieceId: string;
  shot: ShotResult;
  score: number;
  scoredGoal: boolean;
  hitCount: number;
};

/**
 * Paper Airfight AI logic.
 *
 * Η λογική είναι:
 *
 * 1. Δημιουργούμε πολλά πιθανά shots για όλα τα ζωντανά AI pieces.
 *    Δεν κοιτάμε μόνο ένα πιόνι. Κοιτάμε όλα τα διαθέσιμα πιόνια.
 *
 * 2. Για κάθε shot υπολογίζουμε:
 *    - πού θα καταλήξει το πιόνι
 *    - αν μπαίνει στο goal
 *    - αν η γραμμή της κίνησης χτυπάει αντίπαλα pieces
 *    - αν πλησιάζει προς το αντίπαλο goal
 *
 * 3. Αν υπάρχει winning move, το AI το παίρνει πάντα.
 *
 * 4. Αν δεν υπάρχει winning move αλλά υπάρχει kill, παίρνει κάποιο καλό kill.
 *    Εδώ υπάρχει λίγη τυχαιότητα ανάμεσα στα καλύτερα kills, για να μην είναι
 *    πάντα ίδιο.
 *
 * 5. Αν δεν υπάρχει ούτε goal ούτε kill, τότε παίζει ένα από τα καλά positional
 *    moves, όχι πάντα το απόλυτα καλύτερο. Έτσι δεν είναι τόσο προβλέψιμο.
 *
 * 6. Στο τέλος περνάμε το shot από distortShot, ώστε η γωνία να έχει μικρή
 *    απόκλιση 1-2 μοιρών. Αυτό κάνει την κίνηση να φαίνεται λιγότερο ρομποτική.
 */
const POWER_OPTIONS = [40, 60, 80, 100];

const ANGLE_OPTIONS = [
  0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330,
];

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max));
};

const getGoalCenter = (
  player: "x" | "o",
  boardWidth: number,
  boardHeight: number,
) => {
  if (player === "x") {
    return {
      x: boardWidth / 2,
      y: 0,
    };
  }

  return {
    x: boardWidth / 2,
    y: boardHeight,
  };
};

const getDistance = (
  a: { x: number; y: number },
  b: { x: number; y: number },
) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
};

const getRandomItem = <T>(items: T[]): T => {
  const randomIndex = Math.floor(Math.random() * items.length);

  return items[randomIndex];
};

const getShotEndPosition = (
  piece: PaperAirfightPiece,
  shot: ShotResult,
  boardWidth: number,
  boardHeight: number,
  maxMoveDistance: number,
) => {
  const distance = (shot.power / 100) * maxMoveDistance;

  const radians = (shot.angle * Math.PI) / 180;

  const nextX = piece.x + Math.cos(radians) * distance;
  const nextY = piece.y + Math.sin(radians) * distance;

  return {
    x: clamp(nextX, 18, boardWidth - 18),
    y: clamp(nextY, 18, boardHeight - 18),
  };
};

const checkGoalWin = (
  player: "x" | "o",
  position: { x: number; y: number },
  boardWidth: number,
  boardHeight: number,
) => {
  const goalWidth = boardWidth * 0.2;
  const goalHeight = 42;

  const goalLeft = boardWidth / 2 - goalWidth / 2;

  const goalRight = boardWidth / 2 + goalWidth / 2;

  const isInsideGoalX = position.x >= goalLeft && position.x <= goalRight;

  if (player === "x") {
    return isInsideGoalX && position.y <= goalHeight;
  }

  return isInsideGoalX && position.y >= boardHeight - goalHeight;
};

const getBestMoves = (candidates: CandidateMove[], maxCount: number) => {
  return [...candidates].sort((a, b) => b.score - a.score).slice(0, maxCount);
};

const createCandidateMoves = ({
  aiPlayer,
  pieces,
  boardWidth,
  boardHeight,
  maxMoveDistance,
}: Props): CandidateMove[] => {
  const aiPieces = pieces.filter(
    (piece) => piece.isAlive && piece.type === aiPlayer,
  );

  const enemyPieces = pieces.filter(
    (piece) => piece.isAlive && piece.type !== aiPlayer,
  );

  const goalCenter = getGoalCenter(aiPlayer, boardWidth, boardHeight);

  const candidates: CandidateMove[] = [];

  aiPieces.forEach((piece) => {
    ANGLE_OPTIONS.forEach((angle) => {
      POWER_OPTIONS.forEach((power) => {
        const shot = {
          power,
          angle,
        };

        const endPosition = getShotEndPosition(
          piece,
          shot,
          boardWidth,
          boardHeight,
          maxMoveDistance,
        );

        const scoredGoal = checkGoalWin(
          aiPlayer,
          endPosition,
          boardWidth,
          boardHeight,
        );

        const hitCount = enemyPieces.filter((enemyPiece) =>
          lineHitsCircle(
            {
              x: piece.x,
              y: piece.y,
            },
            endPosition,
            {
              x: enemyPiece.x,
              y: enemyPiece.y,
            },
            enemyPiece.size,
          ),
        ).length;

        const oldDistance = getDistance(piece, goalCenter);

        const newDistance = getDistance(endPosition, goalCenter);

        const distanceImprovement = oldDistance - newDistance;

        let score = 0;

        // Goal win: απόλυτη προτεραιότητα.
        if (scoredGoal) {
          score += 10000;
        }

        // Kill: πολύ σημαντικό, αλλά κάτω από goal.
        score += hitCount * 1000;

        // Positional play: πλησίασε το αντίπαλο goal.
        score += distanceImprovement;

        // Μικρό random noise για να μη διαλέγει πάντα ίδιο πιόνι
        // όταν πολλά moves είναι σχεδόν ισοδύναμα.
        score += Math.random() * 8;

        candidates.push({
          pieceId: piece.id,
          shot,
          score,
          scoredGoal,
          hitCount,
        });
      });
    });
  });

  return candidates;
};

export const suggestPaperAirfightMove = ({
  aiPlayer,
  pieces,
  boardWidth,
  boardHeight,
  maxMoveDistance,
}: Props): CandidateMove | null => {
  const candidates = createCandidateMoves({
    aiPlayer,
    pieces,
    boardWidth,
    boardHeight,
    maxMoveDistance,
  });

  if (candidates.length === 0) return null;

  const goalMoves = candidates.filter((candidate) => candidate.scoredGoal);

  if (goalMoves.length > 0) {
    const bestGoalMoves = getBestMoves(goalMoves, 3);
    const selectedMove = getRandomItem(bestGoalMoves);

    return {
      ...selectedMove,
      shot: distortShot({
        shot: selectedMove.shot,
        maxAngleDistortion: 1,
      }),
    };
  }

  const killMoves = candidates.filter((candidate) => candidate.hitCount > 0);

  if (killMoves.length > 0) {
    const bestKillMoves = getBestMoves(killMoves, 4);
    const selectedMove = getRandomItem(bestKillMoves);

    return {
      ...selectedMove,
      shot: distortShot({
        shot: selectedMove.shot,
        maxAngleDistortion: 1,
      }),
    };
  }

  const bestPositionalMoves = getBestMoves(candidates, 6);
  const selectedMove = getRandomItem(bestPositionalMoves);

  return {
    ...selectedMove,
    shot: distortShot({
      shot: selectedMove.shot,
      maxAngleDistortion: 2,
    }),
  };
};
