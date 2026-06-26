export type Winner = {
  id: number
  wins: number
  time: number
}

export type WinnerWithCar = Winner & {
  name: string
  color: string
}
