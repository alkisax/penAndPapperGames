import {
  Circle,
  G,
} from 'react-native-svg'

type Props = {
  x: number
  y: number
  color: string
  size?: number
  opacity?: number
  stroke?: string
  strokeWidth?: number
  onPress?: () => void
}

const DotSprite = ({
  x,
  y,
  color,
  size = 18,
  opacity = 1,
  stroke,
  strokeWidth = 0,
  onPress,
}: Props) => {
  return (
    <G
      onPress={onPress}
      opacity={opacity}
    >
      <Circle
        cx={x}
        cy={y}
        r={size / 2}
        fill={color}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </G>
  )
}

export default DotSprite