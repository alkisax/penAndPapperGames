import {
  Rect,
} from 'react-native-svg'

export type DotsAndBoxesOwnedBox = {
  id: string
  row: number
  col: number
  color: string
}

type Props = {
  boxes: DotsAndBoxesOwnedBox[]
  spacing: number
  padding: number
}

const DotsAndBoxesBoxesLayer = ({
  boxes,
  spacing,
  padding,
}: Props) => {
  return (
    <>
      {boxes.map((box) => (
        <Rect
          key={box.id}
          x={padding + box.col * spacing}
          y={padding + box.row * spacing}
          width={spacing}
          height={spacing}
          fill={box.color}
          opacity={0.28}
        />
      ))}
    </>
  )
}

export default DotsAndBoxesBoxesLayer