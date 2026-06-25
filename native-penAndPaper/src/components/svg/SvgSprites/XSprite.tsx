import {
  G,
  Line,
} from 'react-native-svg'

type Props = {
  x: number
  y: number
  color: string
  size?: number
  onPress?: () => void
}

const XSprite = ({
  x,
  y,
  color,
  size = 18,
  onPress,
}: Props) => {
  return (
    <G onPress={onPress}>
      <Line
        x1={x - size / 2}
        y1={y - size / 2}
        x2={x + size / 2}
        y2={y + size / 2}
        stroke={color}
        strokeWidth={4}
        strokeLinecap='round'
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

export default XSprite