import Svg, { Polygon, Text, } from 'react-native-svg'

type Props = {
  size?: number
  fill?: string
  stroke?: string
  label?: string
  onPress?: () => void
}

const HexagonSvg = ({
  size = 48,
  fill = 'transparent',
  stroke = 'black',
  label,
  onPress,
}: Props) => {
  const width = size
  const height = Math.sqrt(3) / 2 * size

  const points = [
    `${size * 0.25},0`,
    `${size * 0.75},0`,
    `${size},${height / 2}`,
    `${size * 0.75},${height}`,
    `${size * 0.25},${height}`,
    `0,${height / 2}`,
  ].join(' ')

return (
  <Svg
    width={width}
    height={height}
    onPress={onPress}
  >
    <Polygon
      points={points}
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
    />

    {label && (
      <Text
        x={width / 2}
        y={height / 2 + 4}
        textAnchor='middle'
        fontSize={12}
        fill={stroke}
      >
        {label}
      </Text>
    )}
  </Svg>
)
}

export default HexagonSvg