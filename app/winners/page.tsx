'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import Button from '@/components/Button/Button'
import RaceTable from '@/components/Race/RaceTable/RaceTable'

function Winners() {
  return (
    <>
      <div className="list_x">
        <h1>Winners</h1>
        <Link href="/garage">
          <Button>Go to Garage</Button>
        </Link>
      </div>
      <RaceTable />
    </>
  )
}

export default function page() {
  return (
    <Suspense fallback={null}>
      <Winners />
    </Suspense>
  )
}
