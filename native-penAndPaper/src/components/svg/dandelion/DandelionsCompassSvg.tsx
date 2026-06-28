import Svg, {
  G,
  Line,
  Polygon,
} from 'react-native-svg'

type Direction =
  | 'N'
  | 'NE'
  | 'E'
  | 'SE'
  | 'S'
  | 'SW'
  | 'W'
  | 'NW'

type Props = {
  size?: number
  lineColor: string
  arrowColor: string
  usedDirections: Direction[]
  handleDirectionPress?: (direction: Direction) => void
}

const DIRECTIONS: Direction[] = [
  'N',
  'NE',
  'E',
  'SE',
  'S',
  'SW',
  'W',
  'NW',
]

const DIRECTION_ANGLES: Record<Direction, number> = {
  N: -90,
  NE: -45,
  E: 0,
  SE: 45,
  S: 90,
  SW: 135,
  W: 180,
  NW: -135,
}

const DandelionsCompassSvg = ({
  size = 180,
  lineColor,
  arrowColor,
  usedDirections,
  handleDirectionPress,
}: Props) => {
  const center = size / 2
  const radius = size * 0.38
  const arrowSize = size * 0.055

  const getPoint = (
    angle: number,
    distance: number,
  ) => {
    const radians = angle * Math.PI / 180

    return {
      x: center + Math.cos(radians) * distance,
      y: center + Math.sin(radians) * distance,
    }
  }

  return (
    <Svg
      width={size}
      height={size}
    >
      {DIRECTIONS.map((direction) => {
        const angle = DIRECTION_ANGLES[direction]
        const end = getPoint(angle, radius)
        const isUsed = usedDirections.includes(direction)

        return (
          <G
            key={direction}
            opacity={isUsed ? 1 : 0.25}
            onPress={() => {
              if (isUsed) {
                return
              }

              handleDirectionPress?.(direction)
            }}
          >
            <Line
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke={lineColor}
              strokeWidth={3}
              strokeLinecap='round'
            />

            <G
              transform={[
                { translateX: end.x },
                { translateY: end.y },
                { rotate: `${angle + 90}deg` },
              ]}
            >
              <Polygon
                points={`
                  0,${-arrowSize}
                  ${-arrowSize},${arrowSize}
                  ${arrowSize},${arrowSize}
                `}
                fill={arrowColor}
              />
            </G>
          </G>
        )
      })}
    </Svg>
  )
}

export default DandelionsCompassSvg