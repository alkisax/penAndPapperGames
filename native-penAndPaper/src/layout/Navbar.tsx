// native-penAndPaper\src\layout\Navbar.tsx

import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { appName } from '@/constants/constants';
// import { DEFAULT_SETTINGS } from '@/hooks/useMorseSettings';
// import MorseSettings from '@/components/MorseSettings';
import MoonToggleIcon from '@/components/ui/MoonToggleIcon';
import SunToggleIcon from '@/components/ui/SunToggleIcon';

type Props = {
  minimal?: boolean;
  roomId: string;
  setRoomId: (v: string) => void;
  handleConnectSocket: () => Promise<void>;
  isConnected: boolean;
  hasPeer: boolean;
};

const Navbar = ({
  minimal = false,
  roomId,
  setRoomId,
  handleConnectSocket,
  isConnected,
  hasPeer,
}: Props) => {
  const { colors, toggle, theme } = useContext(ThemeContext);

  const styles = createStyles(colors);

  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showMorseSettings, setShowMorseSettings] = useState(false);

  if (minimal) {
    return (
      <SafeAreaView
        edges={['top']}
        style={{
          backgroundColor: colors.topBar,
          zIndex: 999,
          elevation: 999,
        }}
      >
        <View style={styles.navbar}>

          {/* home */}
          <Pressable
            onPress={() => router.push('/')}
            style={styles.centerRow}
          >
            <Text style={styles.logo}>
              {appName}
            </Text>
          </Pressable>

        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        backgroundColor: colors.topBar,
        zIndex: 999,
        elevation: 999,
      }}
    >
      <View style={styles.navbar}>

        {/* logo */}
        <Pressable
          onPress={() => router.push('/')}
        >
          <Text style={styles.logo}>
            {appName}
          </Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        {/* hamburger */}
        <Pressable
          onPress={() =>
            setMenuOpen((prev) => !prev)
          }
        >
          <Ionicons
            name={
              menuOpen
                ? 'close'
                : 'menu'
            }
            size={30}
            color={colors.text}
          />
        </Pressable>

        <View style={styles.rightRow}>

          <Pressable
            onPress={() => router.push('/info')}
            style={styles.iconButton}
          >
            <Ionicons
              name="information-circle-outline"
              size={26}
              color={colors.text}
            />
          </Pressable>
        </View>

        {/* dropdown */}
        {/* το πρώτο menuOpen && είναι για να κλίνει το menu αν πατήσω εκτος */}
        {menuOpen && (
          <Pressable
            onPress={() => {
              setMenuOpen(false);
              setShowMorseSettings(false);
            }}
            style={styles.overlay}
          />
        )}

        {menuOpen && (
          <View style={styles.menu}>

            {/* theme */}
            <View style={styles.centerRow}>
              {theme === 'dark'
                ? (
                  <MoonToggleIcon
                    color={colors.text}
                    onFinished={() => {
                      toggle();
                    }}
                  />
                )
                : (
                  <SunToggleIcon
                    color={colors.text}
                    onFinished={() => {
                      toggle();
                    }}
                  />
                )}

              <Pressable
                onPress={() => {
                  setShowMorseSettings((prev) => !prev);
                }}
                style={styles.menuItem}
              >
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={colors.text}
                />
              </Pressable>

            </View>


            {/* socket row */}
            <View style={styles.socketRow}>
              {/* room */}
              <TextInput
                value={roomId}
                onChangeText={setRoomId}
                keyboardType="number-pad"
                placeholder="Room"
                placeholderTextColor={colors.dimText}
                style={styles.roomInput}
                maxLength={4}
              />

              {/* connect */}
              <Pressable
                onPress={handleConnectSocket}
                style={styles.iconButton}
              >
                <Text style={{ fontSize: 18 }}>
                  🔌
                </Text>
              </Pressable>

              {/* status */}
              <View style={styles.statusColumn}>

                <View
                  style={[
                    styles.statusCircle,
                    {
                      backgroundColor:
                        isConnected
                          ? colors.green
                          : colors.red,
                    },
                  ]}
                />

                <View
                  style={[
                    styles.statusCircle,
                    {
                      backgroundColor:
                        hasPeer
                          ? colors.green
                          : colors.red,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
};

export default Navbar;

const createStyles = (
  colors: Record<string, string>,
) =>
  StyleSheet.create({

    navbar: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      backgroundColor: colors.topBar,
      borderBottomWidth: 1,
      borderBottomColor: colors.topBarBorder,
      zIndex: 999,
      elevation: 999,
    },

    logo: {
      fontWeight: 'bold',
      fontSize: 18,
      color: colors.text,
    },

    menu: {
      position: 'absolute',
      right: 0,
      top: 52,
      minWidth: 190,
      backgroundColor: colors.panel,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.panelBorder,
      zIndex: 999,
      elevation: 999,
      gap: 16,
    },

    centerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 22,
    },

    socketRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 14,
    },

    // status circles το ενα κατω απο το αλλο
    statusColumn: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },

    roomInput: {
      width: 74,
      height: 40,
      borderBottomWidth: 1,
      borderBottomColor: colors.buttonBorder,
      borderColor: '#d8cf9d',
      backgroundColor: '#ffffff',
      textAlign: 'center',
      color: '#030303',
      fontSize: 16,
    },

    iconButton: {
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },

    statusCircle: {
      width: 14,
      height: 14,
      borderRadius: 7,
    },

    rightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 12,
    },

    menuText: {
      color: colors.text,
      fontSize: 16,
    },

    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: -1000,
      zIndex: 998,
    },
  });