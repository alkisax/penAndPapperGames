// native-penAndPaper\src\utils\lineCircleCollision.ts

type Point = {
  x: number
  y: number
}

export const lineHitsCircle = (
  start: Point,
  end: Point,
  circle: Point,
  radius: number,
) => {
  const dx = end.x - start.x
  const dy = end.y - start.y

  const lengthSquared = dx * dx + dy * dy

  if (lengthSquared === 0) return false

  const t = Math.max(
    0,
    Math.min(
      1,
      ((circle.x - start.x) * dx + (circle.y - start.y) * dy) / lengthSquared,
    ),
  )

  const closestX = start.x + t * dx
  const closestY = start.y + t * dy

  const distanceX = circle.x - closestX
  const distanceY = circle.y - closestY

  const distance = Math.sqrt(
    distanceX * distanceX + distanceY * distanceY,
  )

  return distance <= radius
}