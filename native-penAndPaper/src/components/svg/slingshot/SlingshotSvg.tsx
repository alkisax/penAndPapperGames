// native-penAndPaper/src/components/svg/slingshot/SlingshotSvg.tsx

import { useEffect, useState } from 'react'

import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { scheduleOnRN } from 'react-native-worklets'

import Svg, {
  Circle,
  Line,
  Rect,
} from 'react-native-svg'

// Το αποτέλεσμα που θα πάρει το parent όταν αφήσουμε το drag.
//
// power: δύναμη 0-100%
// angle: γωνία βολής 0-360 μοίρες
type SlingshotResult = {
  power: number
  angle: number
}

type Props = {
  // Το origin είναι η θέση του πραγματικού sprite.
  // Π.χ. selectedPiece.x / selectedPiece.y.
  //
  // Δεν είναι πια πάντα το κέντρο του SVG.
  originX: number
  originY: number

  boardBackground: string
  circleColor: string
  lineColor: string

  // Callback προς το parent.
  // Το SlingshotSvg δεν αποφασίζει πού θα πάει το sprite.
  // Απλώς επιστρέφει power + angle.
  onRelease: (result: SlingshotResult) => void
}

const SVG_WIDTH = 320
const SVG_HEIGHT = 320

const CIRCLE_RADIUS = 24

// Το μέγιστο drag distance.
// Αυτό αντιστοιχεί σε power 100%.
const MAX_PULL_DISTANCE = 100

const SlingshotSvg = ({
  originX,
  originY,
  boardBackground,
  circleColor,
  lineColor,
  onRelease,
}: Props) => {
  // dragX / dragY είναι η θέση του ghost κύκλου.
  //
  // Αρχικά είναι πάνω στο origin, δηλαδή πάνω στο κανονικό sprite.
  const [dragX, setDragX] = useState(originX)
  const [dragY, setDragY] = useState(originY)

  // Όσο είναι true:
  // - εμφανίζεται ο ροζ κύκλος 100%
  // - εμφανίζεται η γραμμή
  // - εμφανίζεται ο ghost κύκλος
  const [isDragging, setIsDragging] = useState(false)

  // Αν αλλάξει το origin από έξω, π.χ. επειδή το selected sprite άλλαξε θέση,
  // επαναφέρουμε και το ghost πάνω στο νέο origin.
  useEffect(() => {
    setDragX(originX)
    setDragY(originY)
  }, [
    originX,
    originY,
  ])

  // Κρατάει το ghost μέσα στον ροζ κύκλο.
  //
  // Αν ο χρήστης τραβήξει πιο έξω από MAX_PULL_DISTANCE,
  // δεν αφήνουμε το ghost να πάει πιο μακριά.
  const clampToMaxDistance = (
    x: number,
    y: number,
  ) => {
    // dx / dy = vector από το origin προς το σημείο που τραβάει ο χρήστης.
    const dx = x - originX
    const dy = y - originY

    // Απόσταση από το origin.
    // Πυθαγόρειο:
    // distance = sqrt(dx² + dy²)
    const distance = Math.sqrt(
      dx * dx + dy * dy,
    )

    // Αν είμαστε μέσα στο allowed radius, επιστρέφουμε το σημείο όπως είναι.
    if (distance <= MAX_PULL_DISTANCE) {
      return {
        x,
        y,
      }
    }

    // Αν είμαστε έξω, μικραίνουμε το vector ώστε να φτάνει ακριβώς
    // μέχρι το MAX_PULL_DISTANCE.
    //
    // Παράδειγμα:
    // distance = 200
    // MAX_PULL_DISTANCE = 100
    // ratio = 0.5
    //
    // Άρα κρατάμε την ίδια κατεύθυνση, αλλά με μισή απόσταση.
    const ratio = MAX_PULL_DISTANCE / distance

    return {
      x: originX + dx * ratio,
      y: originY + dy * ratio,
    }
  }

  // Μετατρέπει την τελική θέση του ghost σε:
  // - power
  // - angle
  const calculateResult = (
    x: number,
    y: number,
  ) => {
    // Προς τα πού τράβηξε ο χρήστης.
    const pullDx = x - originX
    const pullDy = y - originY

    // Πόσο μακριά τράβηξε.
    const distance = Math.sqrt(
      pullDx * pullDx + pullDy * pullDy,
    )

    // Μετατροπή από pixels σε ποσοστό.
    //
    // 0px   -> 0%
    // 50px  -> 50% αν MAX_PULL_DISTANCE = 100
    // 100px -> 100%
    const power = Math.min(
      Math.round((distance / MAX_PULL_DISTANCE) * 100),
      100,
    )

    // Στο slingshot η βολή πάει ανάποδα από το τράβηγμα.
    //
    // Αν τραβήξεις το ghost αριστερά,
    // το sprite πρέπει να κινηθεί δεξιά.
    const shotDx = originX - x
    const shotDy = originY - y

    // atan2 μάς δίνει τη γωνία του vector.
    // Προσοχή: επιστρέφει radians, όχι degrees.
    const radians = Math.atan2(
      shotDy,
      shotDx,
    )

    // Radians -> degrees.
    let angle = radians * 180 / Math.PI

    // Η atan2 μπορεί να δώσει αρνητική γωνία.
    // Εμείς θέλουμε 0-360.
    if (angle < 0) {
      angle += 360
    }

    return {
      power,
      angle: Math.round(angle),
    }
  }

  // Καλείται όταν αφήνουμε το gesture.
  const finishDrag = (
    x: number,
    y: number,
  ) => {
    const result = calculateResult(x, y)

    // Στέλνουμε power + angle στο parent.
    onRelease(result)

    // Reset του ghost πίσω στο origin.
    setDragX(originX)
    setDragY(originY)

    // Κρύβουμε guide circle / line / ghost.
    setIsDragging(false)
  }

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      // Ξεκίνησε drag.
      // Από εδώ και πέρα δείχνουμε τα helper visuals.
      scheduleOnRN(setIsDragging, true)
    })
    .onUpdate((event) => {
      // translationX / translationY =
      // πόσο μετακινήθηκε το δάχτυλο από εκεί που ξεκίνησε το drag.
      //
      // Εμείς το προσθέτουμε στο origin,
      // γιατί το ghost ξεκινάει από το sprite.
      const nextX = originX + event.translationX
      const nextY = originY + event.translationY

      // Περιορίζουμε το ghost μέσα στον ροζ κύκλο.
      const clampedPosition = clampToMaxDistance(
        nextX,
        nextY,
      )

      // Ενημερώνουμε React state από gesture/worklet world.
      scheduleOnRN(setDragX, clampedPosition.x)
      scheduleOnRN(setDragY, clampedPosition.y)
    })
    .onEnd((event) => {
      // Στο release ξαναϋπολογίζουμε τη θέση από το event.
      //
      // Αυτό είναι καλύτερο από το να βασιστούμε στα dragX / dragY,
      // γιατί τα setState μπορεί να μην έχουν προλάβει να ενημερωθούν
      // ακριβώς στο τελευταίο frame.
      const nextX = originX + event.translationX
      const nextY = originY + event.translationY

      const clampedPosition = clampToMaxDistance(
        nextX,
        nextY,
      )

      scheduleOnRN(
        finishDrag,
        clampedPosition.x,
        clampedPosition.y,
      )
    })

  return (
    <GestureDetector gesture={panGesture}>
      <Svg
        width={SVG_WIDTH}
        height={SVG_HEIGHT}
      >
        {/* Background του SVG area */}
        <Rect
          x={0}
          y={0}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          fill={boardBackground}
        />

        {/* Ροζ κύκλος:
            δείχνει μέχρι πού είναι το 100% power. */}
        {isDragging && (
          <Circle
            cx={originX}
            cy={originY}
            r={MAX_PULL_DISTANCE}
            fill='transparent'
            stroke='pink'
            strokeWidth={3}
            strokeDasharray='8 6'
          />
        )}

        {/* Γραμμή στόχευσης:
            από το πραγματικό sprite μέχρι το ghost. */}
        {isDragging && (
          <Line
            x1={originX}
            y1={originY}
            x2={dragX}
            y2={dragY}
            stroke={lineColor}
            strokeWidth={4}
            strokeLinecap='round'
          />
        )}

        {/* Πραγματικός κύκλος / sprite.
            Αυτός μένει σταθερός στο origin. */}
        <Circle
          cx={originX}
          cy={originY}
          r={CIRCLE_RADIUS}
          fill={circleColor}
        />

        {/* Ghost κύκλος.
            Αυτόν τραβάει ο χρήστης. */}
        {isDragging && (
          <Circle
            cx={dragX}
            cy={dragY}
            r={CIRCLE_RADIUS}
            fill={circleColor}
            opacity={0.45}
          />
        )}
      </Svg>
    </GestureDetector>
  )
}

export default SlingshotSvg