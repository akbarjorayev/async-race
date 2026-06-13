export function minMaxRandom(min: number, max: number, precision: number = 0) {
  const value = Math.random() * (max - min) + min
  return Number(value.toFixed(precision))
}

export function getRandomFromArray<T>(arr: T[]): T {
  const i = minMaxRandom(0, arr.length - 1)
  return arr[i]
}
