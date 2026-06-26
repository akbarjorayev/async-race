import { useCarStore } from '@/lib/store/useCarStore'
import { usePagination } from '@/lib/hooks/usePagination'
import { CARS_PER_PAGE } from '@/constants/cars'
import CarTrack from './CarTrack/CarTrack'
import WinnerBanner from '@/components/WinnerBanner/WinnerBanner'

export default function RaceTrack() {
  const cars = useCarStore((state) => state.cars)
  const winnerId = useCarStore((state) => state.winnerId)
  const clearWinner = useCarStore((state) => state.clearWinner)

  const { startIndex, endIndex } = usePagination({
    totalItems: cars.length,
    itemsPerPage: CARS_PER_PAGE,
  })

  const paginatedCars = cars.slice(startIndex, endIndex)
  const winnerCar = winnerId ? cars.find((c) => c.id === winnerId) : null

  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-gray-400 gap-2">
        <span className="text-4xl">🏎</span>
        <p className="text-sm">No cars yet — add some to start racing!</p>
      </div>
    )
  }

  return (
    <>
      {winnerCar && (
        <WinnerBanner car={winnerCar} onClose={clearWinner} />
      )}

      <div className="flex flex-col gap-3">
        {paginatedCars.map((car) => (
          <CarTrack key={car.id} car={car} />
        ))}
      </div>
    </>
  )
}
