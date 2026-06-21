// native-penAndPaper\src\types\blackHole.types.ts
export type Cell = {
  id: number
  row: number
  col: number
  owner: number | null
  value: number | null
  color: string
  isBlackHole: boolean
}

export type NumberOfPlayers = 1 | 2 | 3