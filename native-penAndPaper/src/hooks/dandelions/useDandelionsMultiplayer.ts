import { useEffect } from "react";

import { useRoomContext } from "@/context/RoomContext";
import useDandelions from "./useDandelions";

import type { Direction } from "@/types/dandelion.types";

type DandelionsRoomEvent =
  | {
      type: "DANDELIONS_PLACE";
      payload: {
        row: number;
        col: number;
        id: number;
      };
    }
  | {
      type: "DANDELIONS_WIND";
      payload: {
        direction: Direction;
      };
    }
  | {
      type: "DANDELIONS_RESET";
      payload: null;
    };

const useDandelionsMultiplayer = () => {
  const {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    localPlayer,
    incomingRoomEvent,
    connectToChatRoom,
    disconnectFromChatRoom,
    sendRoomEvent,
  } = useRoomContext();

  const game = useDandelions();

  const isMultiplayer = isConnected;

  const isLocalDandelion = !isMultiplayer || localPlayer === 1;

  const isLocalWind = !isMultiplayer || localPlayer === 2;

  const canPlayDandelion =
    game.playerTurn === "dandelion" && isLocalDandelion && !game.gameOver;

  const canPlayWind =
    game.playerTurn === "wind" && isLocalWind && !game.gameOver;

  const handleDandelionCellPress = (row: number, col: number, id: number) => {
    if (!canPlayDandelion) {
      return;
    }

    game.handleCellPress(row, col, id);

    if (!isMultiplayer) {
      return;
    }

    const event: DandelionsRoomEvent = {
      type: "DANDELIONS_PLACE",
      payload: {
        row,
        col,
        id,
      },
    };

    sendRoomEvent(event);
  };

  const handleWindDirectionPress = (direction: Direction) => {
    if (!canPlayWind) {
      return;
    }

    game.handleWindDirectionPress(direction);

    if (!isMultiplayer) {
      return;
    }

    const event: DandelionsRoomEvent = {
      type: "DANDELIONS_WIND",
      payload: {
        direction,
      },
    };

    sendRoomEvent(event);
  };

  const handleResetGame = () => {
    game.handleResetGame();

    if (!isMultiplayer) {
      return;
    }

    const event: DandelionsRoomEvent = {
      type: "DANDELIONS_RESET",
      payload: null,
    };

    sendRoomEvent(event);
  };

  useEffect(() => {
    if (!incomingRoomEvent) {
      return;
    }

    const event = incomingRoomEvent as DandelionsRoomEvent;

    if (event.type === "DANDELIONS_PLACE") {
      game.handleCellPress(
        event.payload.row,
        event.payload.col,
        event.payload.id,
      );
    }

    if (event.type === "DANDELIONS_WIND") {
      game.handleWindDirectionPress(event.payload.direction);
    }

    if (event.type === "DANDELIONS_RESET") {
      game.handleResetGame();
    }
  }, [incomingRoomEvent]);

  const turnText = (() => {
    if (game.gameOver && game.winner) {
      return `Winner: ${game.winner.toUpperCase()}`;
    }

    if (!isMultiplayer) {
      return game.currentPlayerText;
    }

    if (game.playerTurn === "dandelion") {
      return isLocalDandelion
        ? "You are playing - dandelion"
        : "Waiting for dandelion move";
    }

    return isLocalWind ? "You are playing - wind" : "Waiting for wind move";
  })();

  return {
    ...game,

    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    localPlayer,
    connectToChatRoom,
    disconnectFromChatRoom,

    isMultiplayer,
    isLocalDandelion,
    isLocalWind,
    canPlayDandelion,
    canPlayWind,
    turnText,

    handleCellPress: handleDandelionCellPress,
    handleWindDirectionPress,
    handleResetGame,
  };
};

export default useDandelionsMultiplayer;
