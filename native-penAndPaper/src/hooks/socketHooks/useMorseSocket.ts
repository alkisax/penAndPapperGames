// native-morse-trainer\hooks\useMorseSocket.ts
import { logToServer } from "@/utils/logToServer";
import { useEffect } from "react";
import type { Socket } from "socket.io-client";

interface Props {
  socket: Socket | null;
  roomId: string;
  setHasPeer: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setIncomingPayload: React.Dispatch<
    React.SetStateAction<{
      morseLetters: string[];
      translatedText: string;
    } | null>
  >;
}

export const useMorseSocket = ({
  socket,
  roomId,
  setHasPeer,
  setIsConnected,

  setIncomingPayload,
}: Props) => {
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      // console.log("🟢 socket connected");
      setIsConnected(true);
    });

    socket.on("connect_error", (err) => {
      logToServer(`SOCKET_ERROR: ${err.message}`);
    });

    socket.on("error", (err) => {
      logToServer(`SOCKET_GENERIC_ERROR: ${JSON.stringify(err)}`);
    });

    socket.on("disconnect", () => {
      // console.log("🔴 socket disconnected");
      setIsConnected(false);
      setHasPeer(false);
    });

    socket.on("room-users", (count: number) => {
      // console.log("👥 room users:", count);

      setHasPeer(count >= 2);
    });

    socket.on(
      "receive-morse",
      (payload: { morseLetters: string[]; translatedText: string }) => {
        // console.log("📥 morse received:", payload);
        setIncomingPayload(payload);
      },
    );

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room-users");
      socket.off("receive-morse");
    };
  }, [socket, roomId, setHasPeer, setIsConnected, setIncomingPayload]);
};
