// native-morse-trainer\styles\global.ts
import { StyleSheet } from "react-native";

export const COLORS = {
  light: {
    background: "#ffffff",
    topBar: "#fffdf4",
    topBarBorder: "#ece6c9",
    button: "#fff7cc",
    buttonBorder: "#d8cf9d",
    text: "#222",
    dimText: "#666",
    holdButton: "#5c1a1b",
    holdButtonActive: "#7a2224",
    holdButtonDisabled: "#555",
    panel: "#f4f1e3",
    panelBorder: "#ddd4aa",
    inputBackground: "#ffffff",
    green: "#2ecc71",
    red: "#d63031",
  },

  dark: {
    background: "#121212",
    topBar: "#1b1b1b",
    topBarBorder: "#2c2c2c",
    button: "#2b2b2b",
    buttonBorder: "#444",
    text: "#f1f1f1",
    dimText: "#999",
    holdButton: "#7a2224",
    holdButtonActive: "#a62d30",
    holdButtonDisabled: "#444",
    panel: "#1f1f1f",
    panelBorder: "#333",
    inputBackground: "#ffffff",
    green: "#2ecc71",
    red: "#ff4d4d",
  },
};

export const MORSE_DIAGRAM_COLORS = {
  light: {
    stroke: "black",
    fill: "white",
    text: "black",

    active: "green",
    path: "#b7f7b7",
  },

  dark: {
    stroke: "#d8d8d8",
    fill: "#1f1f1f",
    text: "#f1f1f1",

    active: "#2ecc71",
    path: "#295c29",
  },
};

export const SIZES = {
  topButton: 48,
  holdButton: 115,
  statusCircle: 18,
};

export const createGlobalStyles = (theme: typeof COLORS.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    topBar: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      paddingTop: 8,
      paddingBottom: 6,
      backgroundColor: theme.topBar,
      borderBottomWidth: 1,
      borderBottomColor: theme.topBarBorder,
      zIndex: 10,
      elevation: 10,
    },

    topButton: {
      width: SIZES.topButton,
      height: SIZES.topButton,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.buttonBorder,
      backgroundColor: theme.button,
      justifyContent: "center",
      alignItems: "center",
    },

    mainContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      paddingBottom: 10,
      paddingTop: 20,
    },

    topArea: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
      zIndex: 1,
    },

    mainText: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.text,
      minHeight: 24,
    },

    translatedText: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      color: theme.text,
      minHeight: 28,
    },

    smallText: {
      fontSize: 12,
      color: theme.dimText,
    },

    holdButton: {
      width: SIZES.holdButton,
      height: SIZES.holdButton,
      borderRadius: SIZES.holdButton / 2,
      backgroundColor: theme.holdButton,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },

    holdButtonDisabled: {
      backgroundColor: theme.holdButtonDisabled,
      opacity: 0.6,
    },

    holdButtonActive: {
      backgroundColor: theme.holdButtonActive,
      transform: [{ scale: 0.96 }],
    },

    holdButtonText: {
      color: "#ffffff",
      fontSize: 24,
      fontWeight: "bold",
      letterSpacing: 1,
    },

    buttonText: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },

    smallButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.text,
    },

    roomInput: {
      width: 70,
      height: 48,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.buttonBorder,
      backgroundColor: theme.inputBackground,
      textAlign: "center",
      fontSize: 16,
      color: theme.text,
    },

    connectButton: {
      width: 30,
      height: 48,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.buttonBorder,
      backgroundColor: theme.button,
      justifyContent: "center",
      alignItems: "center",
    },

    statusCircle: {
      width: SIZES.statusCircle,
      height: SIZES.statusCircle,
      borderRadius: SIZES.statusCircle / 2,
      borderWidth: 1,
      borderColor: "#999",
    },

    socketRow: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },

    textRow: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "flex-start",
      paddingHorizontal: 10,
      marginBottom: 10,
    },

    incomingSmall: {
      fontSize: 12,
      color: theme.dimText,
    },

    incomingText: {
      fontSize: 15,
      color: theme.text,
      textAlign: "center",
    },

    incomingTranslated: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },

    messagePanel: {
      width: "46%",
      padding: 3,
      borderRadius: 12,
      backgroundColor: theme.panel,
      borderWidth: 1,
      borderColor: theme.panelBorder,
      alignItems: "center",
      minHeight: 50,
    },
    bottomControls: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 80,
    },

    sideButtons: {
      width: 70,
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
    },

    sideButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.buttonBorder,
      backgroundColor: theme.button,
      justifyContent: "center",
      alignItems: "center",
    },

    sendButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.holdButton,
      justifyContent: "center",
      alignItems: "center",
    },
  });
