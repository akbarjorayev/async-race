import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFlagCheckered,
  faArrowRotateLeft,
  faTrash,
  faDice,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { useCarStore } from '@/lib/store/useCarStore'
import { usePagination } from '@/lib/hooks/usePagination'
import { generateRandomCars } from '@/lib/cars'
import { createCar } from '@/lib/api/garage'
import { CARS_PER_PAGE } from '@/constants/cars'
import Button from '../../Button/Button'
import AddCar from './AddCar/AddCar'
import UpdateCar from './UpdateCar/UpdateCar'

export default function RaceConfig() {
  const cars = useCarStore((state) => state.cars)
  const selectedCarId = useCarStore((state) => state.selectedCarId)
  const raceStates = useCarStore((state) => state.raceStates)
  const isRacing = useCarStore((state) => state.isRacing)
  const fetchCars = useCarStore((state) => state.fetchCars)
  const deleteCar = useCarStore((state) => state.deleteCar)
  const startRace = useCarStore((state) => state.startRace)
  const resetRace = useCarStore((state) => state.resetRace)

  const { currentPage, totalPages, nextPage, prevPage, hasNext, hasPrev } =
    usePagination({ totalItems: cars.length, itemsPerPage: CARS_PER_PAGE })

  const pageStart = (currentPage - 1) * CARS_PER_PAGE
  const pageCarIds = cars.slice(pageStart, pageStart + CARS_PER_PAGE).map((c) => c.id)
  const allIdle = pageCarIds.every(
    (id) => !raceStates[id] || raceStates[id].status === 'idle',
  )

  async function handleGenerateCars() {
    const randomCars = generateRandomCars(100)
    await Promise.all(randomCars.map((c) => createCar(c.name, c.color)))
    await fetchCars()
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-3 flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Button
          onClick={() => startRace(pageCarIds)}
          aria-disabled={isRacing || !allIdle || pageCarIds.length === 0}
        >
          <FontAwesomeIcon icon={faFlagCheckered} />
          Start Race
        </Button>
        <Button
          onClick={() => resetRace(pageCarIds)}
          aria-disabled={allIdle && !isRacing}
          variant="secondary"
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} />
          Reset
        </Button>
        <span className="w-px h-5 bg-gray-200 mx-0.5" />
        <Button onClick={handleGenerateCars} aria-disabled={isRacing} variant="secondary">
          <FontAwesomeIcon icon={faDice} />
          Generate 100
        </Button>
        <Button
          onClick={() => selectedCarId !== undefined && deleteCar(selectedCarId)}
          aria-disabled={selectedCarId === undefined || isRacing}
          variant="danger"
        >
          <FontAwesomeIcon icon={faTrash} />
          Delete
        </Button>
        {cars.length > 0 && (
          <>
            <span className="w-px h-5 bg-gray-200 mx-0.5" />
            <div className="flex items-center gap-1">
              <Button onClick={prevPage} aria-disabled={!hasPrev} variant="ghost" className="!px-2">
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>
              <span className="text-xs text-gray-500 min-w-[44px] text-center">
                {currentPage} / {totalPages}
              </span>
              <Button onClick={nextPage} aria-disabled={!hasNext} variant="ghost" className="!px-2">
                <FontAwesomeIcon icon={faChevronRight} />
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="h-px bg-gray-100" />

      <div className="flex flex-wrap justify-center gap-2">
        <AddCar />
        <UpdateCar />
      </div>
    </div>
  )
}
