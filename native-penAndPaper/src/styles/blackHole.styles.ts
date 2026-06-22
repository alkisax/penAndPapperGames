// src/styles/blackHole.styles.ts
import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "@/styles/global";

export const createBlackHoleStyles = (theme: typeof COLORS.light) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },

    settingsCard: {
      marginHorizontal: SPACING.md,
      marginTop: SPACING.md,
      padding: SPACING.md,
      borderRadius: RADIUS.lg,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      gap: SPACING.md,
    },

    settingsTitle: {
      fontSize: FONT_SIZE.lg,
      fontWeight: "bold",
      color: theme.text,
      textAlign: "center",
    },

    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    settingLabel: {
      fontSize: FONT_SIZE.md,
      fontWeight: "600",
      color: theme.text,
    },

    segmentedRow: {
      flexDirection: "row",
      gap: SPACING.sm,
    },

    segmentButton: {
      minWidth: 58,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: RADIUS.round,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surfaceAlt,
      alignItems: "center",
    },

    segmentButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    segmentText: {
      fontSize: FONT_SIZE.md,
      fontWeight: "700",
      color: theme.text,
    },

    segmentTextActive: {
      color: "#ffffff",
    },

    playerText: {
      fontSize: FONT_SIZE.lg,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
      marginTop: SPACING.md,
      marginBottom: SPACING.sm,
    },

    endGamePanel: {
      marginHorizontal: SPACING.md,
      marginTop: SPACING.md,
      padding: SPACING.md,
      borderRadius: RADIUS.lg,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      gap: SPACING.sm,
      alignItems: "center",
    },

    scoreText: {
      fontSize: FONT_SIZE.md,
      color: theme.text,
      fontWeight: "600",
    },

    boardContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      marginBottom: 24,
    },

    scrollContent: {
      paddingBottom: 40,
    },
  });
