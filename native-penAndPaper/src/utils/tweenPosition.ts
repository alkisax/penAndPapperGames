type Position = {
  x: number
  y: number
}

type Props = {
  from: Position
  to: Position
  duration?: number
  onUpdate: (position: Position) => void
  onComplete?: () => void
}

export const tweenPosition = ({
  from,
  to,
  duration = 250,
  onUpdate,
  onComplete,
}: Props) => {
  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    const x = from.x + (to.x - from.x) * progress
    const y = from.y + (to.y - from.y) * progress

    onUpdate({
      x,
      y,
    })

    if (progress < 1) {
      requestAnimationFrame(animate)
      return
    }

    onComplete?.()
  }

  requestAnimationFrame(animate)
}