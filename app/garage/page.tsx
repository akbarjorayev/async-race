'use client'

import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/Button/Button'
import RaceConfig from '@/components/Race/RaceConfig/RaceConfig'
import RaceTrack from '@/components/Race/RaceTrack/RaceTrack'
import { useCarStore } from '@/lib/store/useCarStore'

function GarageUI() {
  const fetchCars = useCarStore((state) => state.fetchCars)
  const cars = useCarStore((state) => state.cars)

  useEffect(() => { fetchCars() }, [fetchCars])

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          Garage
          <span className="ml-2 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {cars.length}
          </span>
        </h1>
        <Link href="/winners">
          <Button variant="secondary">
            <FontAwesomeIcon icon={faTrophy} />
            Winners
          </Button>
        </Link>
      </div>
      <RaceConfig />
      <RaceTrack />
    </div>
  )
}

export default function page() {
  return (
    <Suspense fallback={null}>
      <GarageUI />
    </Suspense>
  )
}
