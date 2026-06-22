import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { logToServer } from "@/utils/logToServer";

interface IncomingPayload {
  morseLetters: string[];
  translatedText: string;
}

interface Props {
  connection: signalR.HubConnection | null;
  roomId: string;
  setHasPeer: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setIncomingPayload: React.Dispatch<
    React.SetStateAction<IncomingPayload | null>
  >;
}

function useMorseSignalR({
  connection,
  roomId,
  setHasPeer,
  setIsConnected,
  setIncomingPayload,
}: Props) {
  useEffect(() => {
    if (!connection) return;
    connection.onreconnecting((err) => {
      setIsConnected(false);

      if (err) {
        logToServer(`SIGNALR_RECONNECTING_ERROR: ${err.message}`);
      }
    });
    connection.onreconnected(() => {
      setIsConnected(true);
    });
    connection.onclose((err) => {
      setIsConnected(false);
      setHasPeer(false);

      if (err) {
        logToServer(`SIGNALR_CLOSE_ERROR: ${err.message}`);
      }
    });

    connection.on("RoomUsers", (count: number) => {
      setHasPeer(count >= 2);
    });

    connection.on("ReceiveMorse", (payload: IncomingPayload) => {
      setIncomingPayload(payload);
    });

    return () => {
      connection.off("RoomUsers");
      connection.off("ReceiveMorse");
    };
  }, [connection, setHasPeer, setIncomingPayload, setIsConnected]);
}

export default useMorseSignalR;
