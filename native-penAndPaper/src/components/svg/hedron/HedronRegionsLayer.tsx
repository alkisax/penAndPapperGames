import {
  G,
  Polygon,
  Text,
} from 'react-native-svg'

type RegionOwner = 'player1' | 'player2' | 'mixed' | null

type HedronRegion = {
  id: string
  points: string
  value: number
  labelX: number
  labelY: number
}

type Props = {
  emptyColor: string
  player1Color: string
  player2Color: string
  mixedColor: string
  labelColor: string
  opacity?: number
  ownersByRegionId?: Record<string, RegionOwner>
}

export const HEDRON_REGIONS: HedronRegion[] = [
  // Το μεγάλο εξωτερικό region.
  // Περιλαμβάνει τα εσωτερικά regions, οπότε το κάνουμε render πρώτο.
  {
    id: 'outer',
    points: '97.297,44.595 314.865,44.595 376.126,243.694 206.081,368.919 32.883,243.694',
    value: 2,
    labelX: 206,
    labelY: 390,
  },

  // Πάνω region
  {
    id: 'top',
    points: '97.297,44.595 314.865,44.595 282.883,86.036 206.081,109.009 129.279,86.036',
    value: 5,
    labelX: 206,
    labelY: 72,
  },

  // Αριστερό εξωτερικό region
  {
    id: 'left',
    points: '97.297,44.595 129.279,86.036 129.279,163.514 84.685,227.477 32.883,243.694',
    value: 9,
    labelX: 82,
    labelY: 150,
  },

  // Δεξί εξωτερικό region
  {
    id: 'right',
    points: '314.865,44.595 282.883,86.036 278.378,165.315 324.324,227.928 376.126,243.694',
    value: 15,
    labelX: 322,
    labelY: 150,
  },

  // Κάτω αριστερά
  {
    id: 'bottom-left',
    points: '32.883,243.694 84.685,227.477 157.207,250.901 206.081,313.964 206.081,368.919',
    value: 19,
    labelX: 130,
    labelY: 298,
  },

  // Κάτω δεξιά
  {
    id: 'bottom-right',
    points: '376.126,243.694 324.324,227.928 253.604,250.901 206.081,313.964 206.081,368.919',
    value: 11,
    labelX: 282,
    labelY: 298,
  },

  // Εσωτερικό αριστερό
  {
    id: 'inner-left',
    points: '129.279,163.514 173.874,178.829 186.486,214.414 157.207,250.901 84.685,227.477',
    value: 17,
    labelX: 142,
    labelY: 210,
  },

  // Εσωτερικό δεξί
  {
    id: 'inner-right',
    points: '278.378,165.315 236.036,178.829 225.225,214.414 253.604,250.901 324.324,227.928',
    value: 7,
    labelX: 268,
    labelY: 210,
  },

  // Εσωτερικό πάνω αριστερά
  {
    id: 'inner-top-left',
    points: '129.279,86.036 206.081,109.009 204.955,154.955 173.874,178.829 129.279,163.514',
    value: 13,
    labelX: 166,
    labelY: 136,
  },

  // Εσωτερικό πάνω δεξιά
  {
    id: 'inner-top-right',
    points: '206.081,109.009 282.883,86.036 278.378,165.315 236.036,178.829 204.955,154.955',
    value: 21,
    labelX: 242,
    labelY: 136,
  },

  // Κέντρο
  {
    id: 'center',
    points: '173.874,178.829 204.955,154.955 236.036,178.829 225.225,214.414 186.486,214.414',
    value: 1,
    labelX: 205,
    labelY: 190,
  },

  // Κάτω κεντρικό
  {
    id: 'inner-bottom',
    points: '186.486,214.414 225.225,214.414 253.604,250.901 206.081,313.964 157.207,250.901',
    value: 3,
    labelX: 205,
    labelY: 254,
  },
]

const getRegionFill = ({
  owner,
  emptyColor,
  player1Color,
  player2Color,
  mixedColor,
}: {
  owner: RegionOwner
  emptyColor: string
  player1Color: string
  player2Color: string
  mixedColor: string
}) => {
  if (owner === 'player1') return player1Color
  if (owner === 'player2') return player2Color
  if (owner === 'mixed') return mixedColor

  return emptyColor
}

const HedronRegionsLayer = ({
  emptyColor,
  player1Color,
  player2Color,
  mixedColor,
  labelColor,
  opacity = 0.45,
  ownersByRegionId = {},
}: Props) => {
  return (
    <>
      <G>
        {HEDRON_REGIONS.map((region) => {
          const owner =
            ownersByRegionId[region.id] ?? null

          return (
            <Polygon
              key={region.id}
              points={region.points}
              fill={getRegionFill({
                owner,
                emptyColor,
                player1Color,
                player2Color,
                mixedColor,
              })}
              opacity={opacity}
            />
          )
        })}
      </G>

      <G>
        {HEDRON_REGIONS.map((region) => (
          <Text
            key={`label-${region.id}`}
            x={region.labelX}
            y={region.labelY}
            textAnchor='middle'
            fontSize={14}
            fontWeight='bold'
            fill={labelColor}
          >
            {region.value}
          </Text>
        ))}
      </G>
    </>
  )
}

export default HedronRegionsLayer