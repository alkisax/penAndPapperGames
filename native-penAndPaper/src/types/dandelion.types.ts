// src/types/dandelions.types.ts

export type PlayerTurn =
  | 'dandelion'
  | 'wind'

export type Direction =
  | 'N'
  | 'NE'
  | 'E'
  | 'SE'
  | 'S'
  | 'SW'
  | 'W'
  | 'NW'

export type DandelionCell = {
  id: number
  row: number
  col: number
  hasDandelion: boolean
  hasSeed: boolean
}