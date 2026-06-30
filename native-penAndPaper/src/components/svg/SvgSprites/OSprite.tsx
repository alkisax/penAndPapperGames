// native-penAndPaper\src\components\svg\SvgSprites\OSprite.tsx
import {
  Circle,
  G,
  Line,
} from 'react-native-svg'

type Props = {
  x: number
  y: number
  color: string
  size?: number
  opacity?: number
  onPress?: () => void
}

const OSprite = ({
  x,
  y,
  color,
  size = 18,
  opacity,
  onPress
}: Props) => {
  return (
    <G onPress={onPress} opacity={opacity}>
      <Circle
        cx={x}
        cy={y}
        r={size / 2}
        fill='transparent'
        stroke={color}
        strokeWidth={4}
      />

      <Line
        x1={x + size / 2}
        y1={y - size / 2}
        x2={x - size / 2}
        y2={y + size / 2}
        stroke={color}
        strokeWidth={4}
        strokeLinecap='round'
      />
    </G>

  )
}

export default OSprite