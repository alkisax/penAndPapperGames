import Svg, {
  G,
  Path,
} from 'react-native-svg'

import XSprite from '@/components/svg/SvgSprites/XSprite'
import OSprite from '@/components/svg/SvgSprites/OSprite'
import HedronRegionsLayer from '@/components/svg/hedron/HedronRegionsLayer'

type RegionOwner = 'player1' | 'player2' | 'mixed' | null

type HedronPlayer = 'player1' | 'player2'

type EdgeOwner = HedronPlayer | null

type HedronEdge = {
  id: string
  d: string
  markX: number
  markY: number
}

type Props = {
  width?: number
  height?: number
  lineColor: string
  emptyColor: string
  player1Color: string
  player2Color: string
  mixedColor: string
  labelColor: string
  opacity?: number
}

const HEDRON_EDGES: HedronEdge[] = [
  { id: 'edge-1', d: 'M97.297 44.595h217.568', markX: 206, markY: 45 },
  { id: 'edge-2', d: 'M282.883 86.036l31.982-41.441', markX: 299, markY: 65 },
  { id: 'edge-3', d: 'M206.081 109.009l76.802-22.973', markX: 244, markY: 97 },
  { id: 'edge-4', d: 'M129.279 86.036l76.802 22.973', markX: 168, markY: 97 },
  { id: 'edge-5', d: 'M97.297 44.595l31.982 41.441', markX: 113, markY: 65 },

  { id: 'edge-6', d: 'M97.297 44.595 32.883 243.694', markX: 65, markY: 144 },
  { id: 'edge-7', d: 'M32.883 243.694l51.802-16.216', markX: 59, markY: 236 },
  { id: 'edge-8', d: 'M84.685 227.477l44.595-63.964', markX: 107, markY: 196 },
  { id: 'edge-9', d: 'M129.279 163.514V86.037', markX: 129, markY: 125 },
  { id: 'edge-10', d: 'M84.685 227.477l72.523 23.423', markX: 121, markY: 239 },

  { id: 'edge-11', d: 'M157.207 250.901l48.874 63.063', markX: 182, markY: 282 },
  { id: 'edge-12', d: 'M32.883 243.694l173.198 125.225', markX: 120, markY: 306 },
  { id: 'edge-13', d: 'M206.081 368.919v-54.955', markX: 206, markY: 341 },
  { id: 'edge-14', d: 'M206.081 368.919l170.045-125.225', markX: 291, markY: 306 },
  { id: 'edge-15', d: 'M376.126 243.694 314.865 44.595', markX: 346, markY: 144 },

  { id: 'edge-16', d: 'M376.126 243.694l-51.802-15.766', markX: 350, markY: 236 },
  { id: 'edge-17', d: 'M206.081 313.964l47.523-63.063', markX: 230, markY: 282 },
  { id: 'edge-18', d: 'M253.604 250.901l70.721-22.973', markX: 289, markY: 239 },
  { id: 'edge-19', d: 'M324.324 227.928l-45.946-62.613', markX: 301, markY: 197 },
  { id: 'edge-20', d: 'M278.378 165.315l4.505-79.279', markX: 281, markY: 126 },

  { id: 'edge-21', d: 'M173.874 178.829l-44.595-15.315', markX: 152, markY: 171 },
  { id: 'edge-22', d: 'M204.955 154.955l1.126-45.946', markX: 206, markY: 132 },
  { id: 'edge-23', d: 'M236.036 178.829l42.342-13.514', markX: 257, markY: 172 },
  { id: 'edge-24', d: 'M225.225 214.414l28.378 36.486', markX: 239, markY: 232 },
  { id: 'edge-25', d: 'M186.486 214.414 157.207 250.9', markX: 172, markY: 233 },

  { id: 'edge-26', d: 'M186.486 214.414l-12.613-35.586', markX: 180, markY: 197 },
  { id: 'edge-27', d: 'M173.874 178.829l31.081-23.874', markX: 189, markY: 167 },
  { id: 'edge-28', d: 'M204.955 154.955l31.081 23.874', markX: 220, markY: 167 },
  { id: 'edge-29', d: 'M236.036 178.829l-10.811 35.586', markX: 231, markY: 197 },
  { id: 'edge-30', d: 'M225.225 214.414h-38.739', markX: 206, markY: 214 },
]

const ownersByRegionId: Record<string, RegionOwner> = {
  top: 'player1',
  left: 'player2',
  right: 'player2',
  center: 'player1',
  'inner-bottom': 'player1',
  'bottom-right': 'player2',
}

const ownersByEdgeId: Record<string, EdgeOwner> = {
  'edge-1': 'player1',
  'edge-4': 'player1',
  'edge-5': 'player2',
  'edge-8': 'player2',
  'edge-13': 'player1',
  'edge-18': 'player2',
  'edge-22': 'player1',
  'edge-24': 'player2',
  'edge-27': 'player1',
  'edge-30': 'player1',
}

const HedronPreviewSvg = ({
  width = 125,
  height = 125,
  lineColor,
  emptyColor,
  player1Color,
  player2Color,
  mixedColor,
  labelColor,
  opacity = 1,
}: Props) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox='0 0 400 400'
      opacity={opacity}
    >
      <HedronRegionsLayer
        emptyColor={emptyColor}
        player1Color={player1Color}
        player2Color={player2Color}
        mixedColor={mixedColor}
        labelColor={labelColor}
        opacity={0.42}
        ownersByRegionId={ownersByRegionId}
      />

      <G
        fill='none'
        stroke={lineColor}
        strokeWidth={7}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit={1.5}
      >
        {HEDRON_EDGES.map((edge) => (
          <Path
            key={edge.id}
            d={edge.d}
          />
        ))}
      </G>

      <G>
        {HEDRON_EDGES.map((edge) => {
          const owner = ownersByEdgeId[edge.id]

          if (owner === 'player1') {
            return (
              <XSprite
                key={`preview-mark-${edge.id}`}
                x={edge.markX}
                y={edge.markY}
                color={player1Color}
                size={18}
              />
            )
          }

          if (owner === 'player2') {
            return (
              <OSprite
                key={`preview-mark-${edge.id}`}
                x={edge.markX}
                y={edge.markY}
                color={player2Color}
                size={18}
              />
            )
          }

          return null
        })}
      </G>
    </Svg>
  )
}

export default HedronPreviewSvg