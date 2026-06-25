import type { ShotResult } from '@/hooks/paperAirfight/usePaperAirfight'

type Props = {
  shot: ShotResult
  maxAngleDistortion?: number
}

/**
 * Δίνει λίγο ανθρώπινο "λάθος" σε ένα shot.
 *
 * Η βασική ιδέα:
 * - Το AI ή ο user υπολογίζει ένα καθαρό shot με power + angle.
 * - Αν το αφήσουμε έτσι, η κίνηση μοιάζει υπερβολικά τέλεια/ευθεία.
 * - Με αυτό το helper πειράζουμε λίγο μόνο τη γωνία.
 *
 * Παράδειγμα:
 * angle: 90
 * distortion: -2 έως +2
 * τελικό angle: 88, 89, 90, 91 ή 92
 *
 * Δεν πειράζουμε το power εδώ.
 * Το power μένει όπως είναι, γιατί θέλουμε μόνο μικρή απόκλιση κατεύθυνσης.
 */
export const distortShot = ({
  shot,
  maxAngleDistortion = 2,
}: Props): ShotResult => {
  const distortion =
    Math.floor(Math.random() * (maxAngleDistortion * 2 + 1)) -
    maxAngleDistortion

  const distortedAngle =
    (shot.angle + distortion + 360) % 360

  return {
    ...shot,
    angle: distortedAngle,
  }
}