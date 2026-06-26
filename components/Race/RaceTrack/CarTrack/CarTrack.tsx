'use client'

import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
import { Car } from '@/types/cars'
import { useCarStore } from '@/lib/store/useCarStore'
import CarIcon from '@/components/CarIcon/CarIcon'
import Button from '@/components/Button/Button'

export default function CarTrack({ car }: { car: Car }) {
  const selectCar = useCarStore((state) => state.selectCar)
  const selectedCarId = useCarStore((state) => state.selectedCarId)
  const startEngineSingle = useCarStore((state) => state.startEngineSingle)
  const stopEngineSingle = useCarStore((state) => state.stopEngineSingle)
  const raceState = useCarStore((state) => state.raceStates[car.id])
  const isRacing = useCarStore((state) => state.isRacing)

  const [position, setPosition] = useState(0)
  const animFrameRef = useRef<number | null>(null)
  const status = raceState?.status ?? 'idle'
  const isSelected = selectedCarId === car.id

  useEffect(() => {
    if (status !== 'racing' || raceState.startTime === null) return
    const { duration, startTime } = raceState
    function tick() {
      const elapsed = Date.now() - startTime
      const p = Math.min((elapsed / duration) * 100, 100)
      setPosition(p)
      if (p < 100) animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current)
    }
  }, [status, raceState?.startTime, raceState?.duration])

  useEffect(() => {
    if (status === 'idle') setPosition(0)
  }, [status])

  const isActive = status === 'starting' || status === 'racing'
  const toggleDisabled = status === 'stopping' || (isRacing && !isActive)

  function handleToggle() {
    if (isActive) stopEngineSingle(car.id)
    else startEngineSingle(car.id)
  }

  const statusDot =
    status === 'starting' ? 'bg-yellow-400 animate-pulse' :
    status === 'racing'   ? 'bg-blue-500 animate-pulse' :
    status === 'broken'   ? 'bg-red-500' :
    status === 'finished' ? 'bg-green-500' :
    'bg-gray-300'

  return (
    <div
      className={`flex items-center gap-2 pl-3 rounded-xl border overflow-hidden transition-all duration-150 ${
        isSelected
          ? 'bg-blue-50 border-blue-200'
          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="relative flex items-center gap-1 shrink-0 py-2">
        <span className={`absolute -top-3 -left-2 w-2 h-2 rounded-full shrink-0 aspect-square ${statusDot}`} />
        <input
          type="radio"
          name="car-select"
          checked={isSelected}
          onChange={() => {}}
          onClick={() => selectCar(car.id)}
          className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
        />
        <Button
          variant={isActive ? 'primary' : 'icon'}
          onClick={handleToggle}
          aria-disabled={toggleDisabled}
          className="w-7 h-7 !px-0 text-xs"
        >
          <FontAwesomeIcon icon={isActive ? faStop : faPlay} />
        </Button>
      </div>

      <div className="flex-1 self-stretch relative bg-slate-700 overflow-hidden shadow-inner">
        {/* dashed center line */}
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(250,204,21,0.55) 0px, rgba(250,204,21,0.55) 18px, transparent 18px, transparent 30px)' }}
        />
        {/* start line */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-400/70" />
        {/* finish — checkered */}
        <div className="absolute right-0 top-0 bottom-0 w-3 overflow-hidden">
          <div className="w-full h-full"
            style={{ backgroundImage: 'repeating-conic-gradient(#fff 0% 25%, #1e293b 0% 50%)', backgroundSize: '6px 6px' }}
          />
        </div>
        {/* car */}
        <div
          className="absolute top-1/2 -translate-y-1/2 drop-shadow-md"
          style={{ left: `calc(${position}% - ${position * 0.4}px)` }}
        >
          <CarIcon color={car.color} width={48} height={24} />
        </div>
        {/* car name — static at the green start line */}
        <div className="absolute bottom-1 left-4 text-[10px] font-semibold text-white/60 whitespace-nowrap pointer-events-none leading-none">
          {car.name}
        </div>
      </div>
    </div>
  )
}
