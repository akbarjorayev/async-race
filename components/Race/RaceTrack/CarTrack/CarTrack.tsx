import { CarsType } from '@/types/cars'
import './CarTrack.css'
import CarIcon from '@/components/CarIcon/CarIcon'
import Input from '@/components/Input/Input'
import { useCarStore } from '@/lib/store/useCarStore'
import Button from '@/components/Button/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'

export default function CarTrack({ car }: { car: CarsType }) {
  const select = useCarStore((state) => state.select)
  const startRaceById = useCarStore((state) => state.startRaceById)
  const resetRaceById = useCarStore((state) => state.resetRaceById)

  function selectCar() {
    select(car.id)
  }

  function toggleRace() {
    if (car.isRacing || car.distance > 0) {
      resetRaceById(car.id)
    } else {
      startRaceById(car.id)
    }
  }

  return (
    <>
      <div className="list_x car_track_lines">
        <hr />
        <hr />
        <hr />
      </div>
      <div className="list_x car_track_info">
        <div className="list_y">
          <Input
            type="radio"
            className="car_select"
            name="car-select"
            onClick={selectCar}
          />
          <Button className="car_button" onClick={toggleRace}>
            <FontAwesomeIcon
              icon={
                car.isRacing || car.distance > 0 ? faArrowRotateLeft : faPlay
              }
            />
          </Button>
        </div>
        <div className="list_x car_track_car_line">
          <CarIcon
            color={car.color}
            className="car_icon"
            style={{
              left: `${car.distance}%`,
            }}
          />
          <div className="list_x" style={{ color: car.color }}>
            <span>{car.name}</span>
          </div>
        </div>
      </div>
      <div className="list_x car_track_lines">
        <hr />
        <hr />
        <hr />
      </div>
    </>
  )
}
