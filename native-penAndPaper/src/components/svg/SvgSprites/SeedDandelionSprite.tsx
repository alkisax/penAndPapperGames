// native-penAndPaper/src/components/svg/SvgSprites/SeedDandelionSprite.tsx

import {
  G,
  Line,
  Path,
} from 'react-native-svg'

type Props = {
  x: number
  y: number
  color: string
  size?: number
  opacity?: number
  rotation?: number
  onPress?: () => void
}

const VIEWBOX_SIZE = 100

// Seed shape:
// - επάνω ένα μικρό curved arc (σαν κομμάτι κύκλου)
// - από το μέσο του arc κατεβαίνει μια γραμμή
const SEED_ARC_PATH = `
M32 30
A18 18 0 0 0 68 30
`

const SeedDandelionSprite = ({
  x,
  y,
  color,
  size = 16,
  opacity = 1,
  rotation = 0,
  onPress,
}: Props) => {
  const scale = size / VIEWBOX_SIZE

  return (
    <G
      opacity={opacity}
      transform={[
        { translateX: x },
        { translateY: y },
        { rotate: `${rotation}deg` },
        { scaleX: scale },
        { scaleY: scale },
        { translateX: -VIEWBOX_SIZE / 2 },
        { translateY: -VIEWBOX_SIZE / 2 },
      ]}
      onPress={onPress}
    >
      <Path
        d={SEED_ARC_PATH}
        fill='none'
        stroke={color}
        strokeWidth={8}
        strokeLinecap='round'
      />

      <Line
        x1={50}
        y1={30}
        x2={50}
        y2={78}
        stroke={color}
        strokeWidth={8}
        strokeLinecap='round'
      />
    </G>
  )
}

export default SeedDandelionSprite