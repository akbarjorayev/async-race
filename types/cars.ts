export type Car = {
  id: number
  name: string
  color: string
}

export type EngineResponse = {
  velocity: number
  distance: number
}

export type RaceStatus =
  | 'idle'
  | 'starting'
  | 'racing'
  | 'broken'
  | 'finished'
  | 'stopping'

export type CarRaceState = {
  status: RaceStatus
  duration: number
  startTime: number | null
}
