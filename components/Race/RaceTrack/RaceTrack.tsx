import { useCarStore } from '@/lib/store/useCarStore'
import { usePagination } from '@/lib/hooks/usePagination'
import { CARS_PER_PAGE } from '@/constants/cars'
import CarTrack from './CarTrack/CarTrack'
import './RaceTrack.css'

export default function RaceTrack() {
  const cars = useCarStore((state) => state.cars)
  const { startIndex, endIndex } = usePagination({
    totalItems: cars.length,
    itemsPerPage: CARS_PER_PAGE,
  })

  const paginatedCars = cars.slice(startIndex, endIndex)

  if (cars.length === 0) {
    return <p>No cars to display. Please add some cars to the race.</p>
  }

  return (
    <div className="list_y race_track">
      <div className="race_track_lines">
        <div className="start_line">START</div>
        <div className="finish_line">FINISH</div>
      </div>
      {paginatedCars.map((car) => (
        <CarTrack key={car.id} car={car} />
      ))}
    </div>
  )
}
