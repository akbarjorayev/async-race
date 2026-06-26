import { create } from 'zustand'
import { Car, CarRaceState } from '@/types/cars'
import {
  getCars,
  createCar,
  updateCar,
  deleteCar,
} from '@/lib/api/garage'
import { startEngine, stopEngine, driveMode } from '@/lib/api/engine'
import {
  getWinner,
  createWinner,
  updateWinner,
  deleteWinner,
} from '@/lib/api/winners'

interface CarState {
  cars: Car[]
  raceStates: Record<number, CarRaceState>
  isRacing: boolean
  winnerId: number | null
  selectedCarId: number | undefined

  fetchCars: () => Promise<void>
  addCar: (name: string, color: string) => Promise<void>
  updateCar: (id: number, name: string, color: string) => Promise<void>
  deleteCar: (id: number) => Promise<void>
  selectCar: (id: number) => void

  startEngineSingle: (id: number) => Promise<void>
  stopEngineSingle: (id: number) => Promise<void>
  startRace: (carIds: number[]) => Promise<void>
  resetRace: (carIds: number[]) => Promise<void>
  clearWinner: () => void
}

const IDLE_STATE: CarRaceState = {
  status: 'idle',
  duration: 0,
  startTime: null,
}

function setRaceState(
  states: Record<number, CarRaceState>,
  id: number,
  patch: Partial<CarRaceState>,
): Record<number, CarRaceState> {
  return {
    ...states,
    [id]: { ...(states[id] ?? IDLE_STATE), ...patch },
  }
}

async function saveWinnerToServer(carId: number, timeSeconds: number) {
  const existing = await getWinner(carId)
  if (existing) {
    await updateWinner(carId, {
      wins: existing.wins + 1,
      time: Math.min(existing.time, timeSeconds),
    })
  } else {
    await createWinner({ id: carId, wins: 1, time: timeSeconds })
  }
}

export const useCarStore = create<CarState>((set, get) => ({
  cars: [],
  raceStates: {},
  isRacing: false,
  winnerId: null,
  selectedCarId: undefined,

  fetchCars: async () => {
    const cars = await getCars()
    set({ cars })
  },

  addCar: async (name, color) => {
    await createCar(name, color)
    await get().fetchCars()
  },

  updateCar: async (id, name, color) => {
    await updateCar(id, name, color)
    await get().fetchCars()
  },

  deleteCar: async (id) => {
    await deleteCar(id)
    await deleteWinner(id)
    set((state) => ({
      cars: state.cars.filter((c) => c.id !== id),
      selectedCarId:
        state.selectedCarId === id ? undefined : state.selectedCarId,
    }))
  },

  selectCar: (id) =>
    set((state) => ({ selectedCarId: state.selectedCarId === id ? undefined : id })),

  startEngineSingle: async (id) => {
    set((state) => ({
      raceStates: setRaceState(state.raceStates, id, {
        status: 'starting',
        duration: 0,
        startTime: null,
      }),
    }))

    try {
      const { velocity, distance } = await startEngine(id)
      const duration = Math.round(distance / velocity)
      const startTime = Date.now()

      set((state) => ({
        raceStates: setRaceState(state.raceStates, id, {
          status: 'racing',
          duration,
          startTime,
        }),
      }))

      try {
        const { success } = await driveMode(id)
        set((state) => ({
          raceStates: setRaceState(state.raceStates, id, {
            status: success ? 'finished' : 'broken',
          }),
        }))
      } catch {
        set((state) => ({
          raceStates: setRaceState(state.raceStates, id, { status: 'broken' }),
        }))
      }
    } catch {
      set((state) => ({
        raceStates: setRaceState(state.raceStates, id, { status: 'idle' }),
      }))
    }
  },

  stopEngineSingle: async (id) => {
    set((state) => ({
      raceStates: setRaceState(state.raceStates, id, { status: 'stopping' }),
    }))
    await stopEngine(id)
    set((state) => ({
      raceStates: setRaceState(state.raceStates, id, {
        status: 'idle',
        duration: 0,
        startTime: null,
      }),
    }))
  },

  startRace: async (carIds) => {
    set({ isRacing: true, winnerId: null })

    const startingPatch = carIds.reduce(
      (acc, id) => {
        acc[id] = { status: 'starting' as const, duration: 0, startTime: null }
        return acc
      },
      {} as Record<number, CarRaceState>,
    )
    set((state) => ({
      raceStates: { ...state.raceStates, ...startingPatch },
    }))

    const engineResults = await Promise.allSettled(
      carIds.map((id) =>
        startEngine(id).then((res) => ({ id, ...res })),
      ),
    )

    const raceStartTime = Date.now()
    const racingPatch: Record<number, CarRaceState> = {}

    for (const result of engineResults) {
      if (result.status === 'fulfilled') {
        const { id, velocity, distance } = result.value
        racingPatch[id] = {
          status: 'racing',
          duration: Math.round(distance / velocity),
          startTime: raceStartTime,
        }
      }
    }

    set((state) => ({
      raceStates: { ...state.raceStates, ...racingPatch },
    }))

    let winnerFound = false

    await Promise.allSettled(
      Object.entries(racingPatch).map(async ([idStr, raceState]) => {
        const id = Number(idStr)
        try {
          const { success } = await driveMode(id)

          if (success && !winnerFound) {
            winnerFound = true
            const timeSeconds = raceState.duration / 1000
            set({ winnerId: id })
            await saveWinnerToServer(id, timeSeconds)
          }

          set((state) => ({
            raceStates: setRaceState(state.raceStates, id, {
              status: success ? 'finished' : 'broken',
            }),
          }))
        } catch {
          set((state) => ({
            raceStates: setRaceState(state.raceStates, id, {
              status: 'broken',
            }),
          }))
        }
      }),
    )

    set({ isRacing: false })
  },

  resetRace: async (carIds) => {
    await Promise.allSettled(carIds.map((id) => stopEngine(id)))

    const idlePatch = carIds.reduce(
      (acc, id) => {
        acc[id] = { status: 'idle' as const, duration: 0, startTime: null }
        return acc
      },
      {} as Record<number, CarRaceState>,
    )

    set((state) => ({
      raceStates: { ...state.raceStates, ...idlePatch },
      isRacing: false,
      winnerId: null,
    }))
  },

  clearWinner: () => set({ winnerId: null }),
}))
