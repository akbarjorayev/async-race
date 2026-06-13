import CarIcon from '@/components/CarIcon/CarIcon'
import { usePagination } from '@/lib/hooks/usePagination'
import { useCarStore } from '@/lib/store/useCarStore'

export default function RaceTable() {
  const cars = useCarStore((state) => state.cars)

  const sortedCars = [...cars].sort((a, b) => b.speed - a.speed)

  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
  } = usePagination({
    totalItems: sortedCars.length,
    itemsPerPage: 10,
  })

  const paginatedCars = sortedCars.slice(startIndex, endIndex)

  if (cars.length === 0) {
    return <p>No cars to display. Please add some cars to the race.</p>
  }

  return (
    <>
      <div>
        <button onClick={prevPage} disabled={!hasPrev}>
          Prev
        </button>

        <span>
          {currentPage} / {totalPages}
        </span>

        <button onClick={nextPage} disabled={!hasNext}>
          Next
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Car</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {paginatedCars.map((car, i) => (
            <tr key={car.id}>
              <td>{startIndex + i + 1}</td>
              <td>
                <CarIcon color={car.color} />
              </td>
              <td>{car.name}</td>
              <td>{(100 / car.speed).toFixed(2)}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
