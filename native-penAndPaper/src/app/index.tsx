// src/app/index.tsx

import { useContext } from 'react'
import { View, Pressable, Text, ScrollView } from 'react-native'
import { router } from 'expo-router'

import Navbar from '@/layout/Navbar'
import { ThemeContext } from '@/context/ThemeContext'
import { createGlobalStyles } from '@/styles/global'
import { useRoomContext } from '@/context/RoomContext'
import ChatBox from '@/components/chat/ChatBox'
import BlackHolePreviewSvg from '@/components/svg/previewSvgs/BlackHolePreviewSvg'
import PferdApfelPreviewSvg from '@/components/svg/previewSvgs/PferdApfelPreviewSvg'
import PaperAirfightPreviewSvg from '@/components/svg/previewSvgs/PaperAirfightPreviewSvg'
import DandelionsPreviewSvg from '@/components/svg/previewSvgs/DandelionsPreviewSvg'
import HexPreviewSvg from '@/components/svg/previewSvgs/HexPreviewSvg'
import HedronPreviewSvg from '@/components/svg/previewSvgs/HedronPreviewSvg'
import { mainIndexStyles } from '@/styles/mainIndex.styles'
import DotsAndBoxesPreviewSvg from '@/components/svg/previewSvgs/DotsAndBoxesPreviewSvg'
import CollectorPreviewSvg from '@/components/svg/previewSvgs/CollectorPreviewSvg'

export default function Index() {
  const { colors } = useContext(ThemeContext)
  const globalStyles = createGlobalStyles(colors)

  const {
    roomCode,
    setRoomCode,
    username,
    setUsername,
    isConnected,
    hasPeer,
    connectToChatRoom,
    disconnectFromChatRoom,
    chatMessages,
    sendChatMessage,
  } = useRoomContext()

  return (
    <View style={globalStyles.screen}>
      <Navbar
        roomId={roomCode}
        setRoomId={setRoomCode}
        username={username}
        setUsername={setUsername}
        handleConnectSocket={connectToChatRoom}
        handleDisconnectSocket={disconnectFromChatRoom}
        isConnected={isConnected}
        hasPeer={hasPeer}
      />

      <ScrollView
        contentContainerStyle={mainIndexStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={mainIndexStyles.grid}>
          <Pressable
            style={[
              globalStyles.primaryButton,
              mainIndexStyles.gameCard,
            ]}
            onPress={() => router.push('/blackHole/blackHole')}
          >
            <View
              pointerEvents='none'
              style={mainIndexStyles.blackHolePreview}
            >
              <BlackHolePreviewSvg
                width={130}
                height={120}
                player1Color={colors.player1}
                player2Color={colors.player2}
                player3Color={colors.player3}
                blackHoleColor={colors.blackHole}
                lineColor={colors.boardLine}
              />
            </View>

            <Text
              style={[
                globalStyles.primaryButtonText,
                mainIndexStyles.gameCardText,
              ]}
            >
              Black Hole
            </Text>
          </Pressable>

          <Pressable
            style={[
              globalStyles.primaryButton,
              mainIndexStyles.gameCard,
            ]}
            onPress={() => router.push('/pferdapfel/pferdapfel')}
          >
            <View
              pointerEvents='none'
              style={mainIndexStyles.pferdApfelPreview}
            >
              <PferdApfelPreviewSvg
                width={125}
                height={125}
                boardBackground={colors.boardBackground}
                boardLine={colors.boardLine}
                player1Color={colors.player1}
                player2Color={colors.player3}
                blockedColor={colors.deadPiece}
              />
            </View>

            <Text
              style={[
                globalStyles.primaryButtonText,
                mainIndexStyles.gameCardText,
              ]}
            >
              Pferdäpfel
            </Text>
          </Pressable>

          <Pressable
            style={[
              globalStyles.primaryButton,
              mainIndexStyles.gameCard,
            ]}
            onPress={() => router.push('/paperairfight/paperAirfight')}
          >
            <View
              pointerEvents='none'
              style={mainIndexStyles.paperAirfightPreview}
            >
              <PaperAirfightPreviewSvg
                width={100}
                height={160}
                boardBackground={colors.boardBackground}
                boardLine={colors.boardLine}
                baseColor={colors.player1}
                goalColor={colors.player3}
                player1Color={colors.player1}
                player2Color={colors.player3}
              />
            </View>

            <Text
              style={[
                globalStyles.primaryButtonText,
                mainIndexStyles.gameCardText,
              ]}
            >
              Paper Airfight
            </Text>
          </Pressable>

          <Pressable
            style={[
              globalStyles.primaryButton,
              mainIndexStyles.gameCard,
            ]}
            onPress={() => router.push('/dandelions/dandelions')}
          >
            <View
              pointerEvents='none'
              style={mainIndexStyles.dandelionsPreview}
            >
              <DandelionsPreviewSvg
                width={100}
                height={100}
                boardBackground={colors.boardBackground}
                boardLine={colors.boardLine}
                dandelionColor={colors.player1}
                seedColor={colors.player3}
              />
            </View>

            <Text
              style={[
                globalStyles.primaryButtonText,
                mainIndexStyles.gameCardText,
              ]}
            >
              Dandelions
            </Text>
          </Pressable>

          <Pressable
            style={[
              globalStyles.primaryButton,
              mainIndexStyles.gameCard,
            ]}
            onPress={() => router.push('/hex/hex')}
          >
            <View
              pointerEvents='none'
              style={mainIndexStyles.hexPreview}
            >
              <HexPreviewSvg
                width={130}
                height={110}
                boardBackground={colors.boardBackground}
                boardLine={colors.boardLine}
                player1Color={colors.player1}
                player2Color={colors.player3}
              />
            </View>

            <Text
              style={[
                globalStyles.primaryButtonText,
                mainIndexStyles.gameCardText,
              ]}
            >
              Hex
            </Text>
          </Pressable>

          <Pressable
            style={[
              globalStyles.primaryButton,
              mainIndexStyles.gameCard,
            ]}
            onPress={() => router.push('/hedron/hedron')}
          >
            <View
              pointerEvents='none'
              style={mainIndexStyles.hedronPreview}
            >
              <HedronPreviewSvg
                width={130}
                height={130}
                lineColor={colors.boardLine}
                emptyColor={colors.boardBackground}
                player1Color={colors.player1}
                player2Color={colors.player3}
                mixedColor='#d88bd8'
                labelColor={colors.text}
              />
            </View>

            <Text
              style={[
                globalStyles.primaryButtonText,
                mainIndexStyles.gameCardText,
              ]}
            >
              Hedron
            </Text>
          </Pressable>

          <Pressable
            style={[
              globalStyles.primaryButton,
              mainIndexStyles.gameCard,
            ]}
            onPress={() => router.push('/dotsAndBoxes/dotsAndBoxes')}
          >
            <View
              pointerEvents='none'
              style={mainIndexStyles.dotsAndBoxesPreview}
            >
              <DotsAndBoxesPreviewSvg
                width={125}
                height={125}
                boardBackground={colors.boardBackground}
                boardLine={colors.boardLine}
                player1Color={colors.player1}
                player2Color={colors.player3}
              />
            </View>

            <Text
              style={[
                globalStyles.primaryButtonText,
                mainIndexStyles.gameCardText,
              ]}
            >
              Dots and Boxes
            </Text>
          </Pressable>

          <Pressable
            style={[
              globalStyles.primaryButton,
              mainIndexStyles.gameCard,
            ]}
            onPress={() => router.push('/collector/collector')}
          >
            <View
              pointerEvents='none'
              style={mainIndexStyles.hedronPreview}
            >
              <CollectorPreviewSvg
                width={130}
                height={130}
                boardBackground={colors.boardBackground}
                boardLine={colors.boardLine}
                player1Color={colors.player1}
                player2Color={colors.player3}
                blockedColor={colors.deadPiece}
              />
            </View>

            <Text
              style={[
                globalStyles.primaryButtonText,
                mainIndexStyles.gameCardText,
              ]}
            >
              Collector
            </Text>
          </Pressable>

        </View>
      </ScrollView>

    </View>
  )
}