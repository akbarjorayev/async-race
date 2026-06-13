import { generateRandomCars } from '@/lib/cars'
import { useCarStore } from '@/lib/store/useCarStore'
import { usePagination } from '@/lib/hooks/usePagination'
import Button from '../../Button/Button'
import AddCar from './AddCar/AddCar'
import UpdateCar from './UpdateCar/UpdateCar'

export default function RaceConfig() {
  const setCars = useCarStore((state) => state.set)
  const cars = useCarStore((state) => state.cars)
  const selectedCarId = useCarStore((state) => state.selectedCarId)
  const deleteSelected = useCarStore((state) => state.deleteSelected)
  const startRace = useCarStore((state) => state.startRace)
  const resetRace = useCarStore((state) => state.resetRace)
  const isRacing = useCarStore((state) => state.isRacing)
  const raceIsOver = useCarStore((state) => state.raceIsOver)
  const { currentPage, totalPages, nextPage, prevPage, hasNext, hasPrev } =
    usePagination({
      totalItems: cars.length,
    })

  function generateCars() {
    const randomCars = generateRandomCars()
    setCars(randomCars)
  }

  function isDeleteable(id: number) {
    const car = cars.find((car) => car.id === id)
    return !car?.isRacing
  }

  return (
    <>
      <div className="list_y">
        <div className="list_x" aria-disabled={cars?.length === 0}>
          <Button onClick={startRace} aria-disabled={isRacing || raceIsOver}>
            Start Race
          </Button>
          <Button onClick={resetRace} aria-disabled={!isRacing && !raceIsOver}>
            Reset
          </Button>
        </div>
        <AddCar />
        <UpdateCar aria-disabled={selectedCarId === undefined} />
        <Button
          onClick={deleteSelected}
          aria-disabled={
            selectedCarId === undefined ||
            isRacing ||
            isDeleteable(selectedCarId) === false
          }
        >
          Delete Selected
        </Button>
        <Button onClick={generateCars}>Generate cars</Button>
        {cars?.length > 0 && (
          <div className="list_x">
            <Button onClick={prevPage} aria-disabled={!hasPrev}>
              Previous
            </Button>
            <span className="text-sm font-semibold">
              {currentPage} / {totalPages}
            </span>
            <Button onClick={nextPage} aria-disabled={!hasNext}>
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
