import { StyleSheet } from 'react-native'

import {
  AppColors,
  FONT_SIZE,
  RADIUS,
  SPACING,
} from '@/styles/global'

export const createRibbonStyles = (
  colors: AppColors,
) =>
  StyleSheet.create({
    ribbon: {
      width: '96%',
      paddingVertical: SPACING.xs,
      paddingHorizontal: SPACING.sm,
      borderRadius: RADIUS.md,
      backgroundColor: colors.boardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SPACING.sm,
    },

    titleBlock: {
      flex: 1,
      minWidth: 0,
    },

    title: {
      fontSize: FONT_SIZE.sm,
      fontWeight: '700',
      color: colors.text,
    },

    subtitle: {
      fontSize: 11,
      color: colors.text,
      opacity: 0.75,
    },

    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
    },

    button: {
      minWidth: 30,
      height: 28,
      paddingHorizontal: SPACING.xs,
      borderRadius: RADIUS.sm,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceAlt,
      justifyContent: 'center',
      alignItems: 'center',
    },

    buttonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    buttonText: {
      fontSize: FONT_SIZE.sm,
      fontWeight: '700',
      color: colors.text,
    },

    buttonTextActive: {
      color: '#ffffff',
    },
  })