'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import Button from '@/components/Button/Button'
import RaceConfig from '@/components/Race/RaceConfig/RaceConfig'
import RaceTrack from '@/components/Race/RaceTrack/RaceTrack'
import { useCarStore } from '@/lib/store/useCarStore'

function GarageUI() {
  const cars = useCarStore((state) => state.cars)

  return (
    <>
      <div className="list_x">
        <h1>Garage</h1>
        <Link href="/winners">
          <Button>Go to Winners</Button>
        </Link>
      </div>
      <RaceConfig />
      <RaceTrack />
    </>
  )
}

export default function page() {
  return (
    <Suspense fallback={null}>
      <GarageUI />
    </Suspense>
  )
}
