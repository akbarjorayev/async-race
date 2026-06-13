import { create } from 'zustand'
import { CarsType } from '@/types/cars'
import { minMaxRandom } from '../random'
import { CARS_SPEED } from '@/constants/cars'

interface CarState {
  cars: CarsType[]
  isRacing: boolean
  raceIsOver: boolean
  intervalId: ReturnType<typeof setInterval> | null
  selectedCarId?: number
  add: (name: string, color: string) => void
  set: (newCars: CarsType[]) => void
  select: (id: number) => void
  update: (newName: string, newColor: string) => void
  deleteSelected: () => void
  startRace: () => void
  resetRace: () => void
  startRaceById: (id: number) => void
  resetRaceById: (id: number) => void
}

export const useCarStore = create<CarState>((set, get) => ({
  cars: [],
  isRacing: false,
  raceIsOver: false,
  intervalId: null,
  add: (name, color) =>
    set((state) => ({
      cars: [
        ...state.cars,
        {
          id: state.cars.length + 1,
          name,
          color,
          speed: minMaxRandom(CARS_SPEED.min, CARS_SPEED.max),
          distance: 0,
          isRacing: false,
        },
      ],
    })),
  update: (newName, newColor) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === state.selectedCarId
          ? { ...car, name: newName, color: newColor }
          : car,
      ),
    })),
  select: (id) => set(() => ({ selectedCarId: id })),
  deleteSelected: () => {
    set((state) => ({
      cars: state.cars.filter((car) => car.id !== state.selectedCarId),
      selectedCarId: undefined,
    }))
  },
  set: (newCars) => set(() => ({ cars: newCars })),
  startRace: () => {
    const id = setInterval(() => {
      set((state) => {
        if (!state.isRacing) return state

        const updatedCars = state.cars.map((car) => ({
          ...car,
          distance: Math.min(car.distance + car.speed * 0.1, 100),
          isRacing: true,
        }))

        const allFinished = updatedCars.every((car) => car.distance >= 100)

        if (allFinished) {
          if (state.intervalId) {
            clearInterval(state.intervalId)
          }
        }

        return {
          cars: updatedCars,
          isRacing: !allFinished,
          raceIsOver: allFinished,
        }
      })
    }, 16)

    set({ isRacing: true, intervalId: id })
  },

  resetRace: () => {
    set({
      isRacing: false,
      intervalId: null,
      cars: get().cars.map((c) => ({
        ...c,
        distance: 0,
        isRacing: false,
      })),
      raceIsOver: false,
    })

    const id = get().intervalId
    if (id) clearInterval(id)
  },

  startRaceById: (id) => {
    const intervalId = setInterval(() => {
      set((state) => {
        const updatedCars = state.cars.map((car) => {
          if (car.id !== id || !car.isRacing) return car

          const distance = Math.min(car.distance + car.speed * 0.1, 100)

          return {
            ...car,
            distance,
            isRacing: distance < 100,
          }
        })

        const car = updatedCars.find((c) => c.id === id)

        if (!car || car.distance >= 100 || !car.isRacing) {
          clearInterval(intervalId)
        }

        return { cars: updatedCars }
      })
    }, 16)

    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === id ? { ...car, isRacing: true } : car,
      ),
    }))
  },
  resetRaceById: (id) => {
    const intervalId = get().intervalId
    if (intervalId) clearInterval(intervalId)

    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === id ? { ...car, isRacing: false, distance: 0 } : car,
      ),
    }))
  },
}))
