import { useAudioPlayer } from 'expo-audio'

const CHAT_NOTIFICATION_SOUND = require(
  '../../assets/sounds/chrysalyn-short-soft-muted-notification.mp3',
)

export const useNotificationSound = () => {
  const chatNotificationPlayer = useAudioPlayer(
    CHAT_NOTIFICATION_SOUND,
  )

  const playChatNotification = () => {
    chatNotificationPlayer.seekTo(0)
    chatNotificationPlayer.play()
  }

  return {
    playChatNotification,
  }
}