// import { useEffect } from 'react'
// import * as signalR from '@microsoft/signalr'
// import { logToServer } from '@/utils/logToServer'

// export type RoomEvent = {
//   type: string
//   payload: unknown
// }

// type Props = {
//   connection: signalR.HubConnection | null
//   setHasPeer: React.Dispatch<React.SetStateAction<boolean>>
//   setIsConnected: React.Dispatch<React.SetStateAction<boolean>>
//   setIncomingRoomEvent: React.Dispatch<
//     React.SetStateAction<RoomEvent | null>
//   >
// }

// export const useRoomRelayListeners = ({
//   connection,
//   setHasPeer,
//   setIsConnected,
//   setIncomingRoomEvent,
// }: Props) => {
//   useEffect(() => {
//     if (!connection) return

//     connection.onreconnecting((err) => {
//       setIsConnected(false)

//       if (err) {
//         logToServer(`SIGNALR_RECONNECTING_ERROR: ${err.message}`)
//       }
//     })

//     connection.onreconnected(() => {
//       setIsConnected(true)
//     })

//     connection.onclose((err) => {
//       setIsConnected(false)
//       setHasPeer(false)

//       if (err) {
//         logToServer(`SIGNALR_CLOSE_ERROR: ${err.message}`)
//       }
//     })

//     connection.on('RoomUsers', (count: number) => {
//       setHasPeer(count >= 2)
//     })

//     connection.on('ReceiveRoomMessage', (message: string) => {
//       try {
//         const parsedEvent = JSON.parse(message) as RoomEvent

//         setIncomingRoomEvent(parsedEvent)
//       } catch {
//         logToServer(
//           `SIGNALR_INVALID_ROOM_MESSAGE: ${message}`,
//         )
//       }
//     })

//     return () => {
//       connection.off('RoomUsers')
//       connection.off('ReceiveRoomMessage')
//     }
//   }, [
//     connection,
//     setHasPeer,
//     setIncomingRoomEvent,
//     setIsConnected,
//   ])
// }