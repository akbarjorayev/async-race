'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGaugeHigh } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/Button/Button'
import RaceTable from '@/components/Race/RaceTable/RaceTable'

function Winners() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Winners</h1>
        <Link href="/garage">
          <Button variant="secondary">
            <FontAwesomeIcon icon={faGaugeHigh} />
            Garage
          </Button>
        </Link>
      </div>
      <RaceTable />
    </div>
  )
}

export default function page() {
  return (
    <Suspense fallback={null}>
      <Winners />
    </Suspense>
  )
}
