'use client'

import Link from 'next/link'
import Button from '@/components/Button/Button'
import RaceTable from '@/components/Race/RaceTable/RaceTable'

export default function page() {
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
