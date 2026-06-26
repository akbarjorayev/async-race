'use client'

import { useEffect, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons'
import CarIcon from '@/components/CarIcon/CarIcon'
import Button from '@/components/Button/Button'
import { getWinners, GetWinnersParams } from '@/lib/api/winners'
import { getCars } from '@/lib/api/garage'
import { WinnerWithCar } from '@/types/winners'
import { WINNERS_PER_PAGE } from '@/constants/cars'

type SortField = 'wins' | 'time'
type SortOrder = 'ASC' | 'DESC'

export default function RaceTable() {
  const [winners, setWinners] = useState<WinnerWithCar[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('wins')
  const [sortOrder, setSortOrder] = useState<SortOrder>('DESC')

  const totalPages = Math.ceil(total / WINNERS_PER_PAGE) || 1

  const loadWinners = useCallback(async () => {
    const params: GetWinnersParams = { page, limit: WINNERS_PER_PAGE, sort: sortField, order: sortOrder }
    const [{ winners: raw, total: t }, cars] = await Promise.all([getWinners(params), getCars()])
    setTotal(t)
    setWinners(
      raw.map((w) => {
        const car = cars.find((c) => c.id === w.id)
        return { ...w, name: car?.name ?? 'Unknown', color: car?.color ?? '#888' }
      }),
    )
  }, [page, sortField, sortOrder])

  useEffect(() => { loadWinners() }, [loadWinners])

  function toggleSort(field: SortField) {
    if (sortField === field) setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'))
    else { setSortField(field); setSortOrder('DESC') }
    setPage(1)
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="text-gray-300 ml-1">↕</span>
    return <FontAwesomeIcon icon={sortOrder === 'ASC' ? faChevronUp : faChevronDown} className="ml-1 text-blue-500 text-xs" />
  }

  if (winners.length === 0 && total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-gray-400 gap-2">
        <FontAwesomeIcon icon={faTrophy} className="text-3xl" />
        <p className="text-sm">No winners yet — run a race first!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <Button onClick={() => setPage((p) => Math.max(1, p - 1))} aria-disabled={page <= 1} variant="ghost" className="!px-2">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <span className="text-xs text-gray-500 min-w-[52px] text-center">{page} / {totalPages}</span>
        <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} aria-disabled={page >= totalPages} variant="ghost" className="!px-2">
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
        <span className="text-xs text-gray-400 ml-1">{total} total</span>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="px-4 py-2.5 text-left w-10">№</th>
              <th className="px-4 py-2.5 text-left w-12">Car</th>
              <th className="px-4 py-2.5 text-left">Name</th>
              <th className="px-4 py-2.5 text-center cursor-pointer hover:text-gray-800 transition-colors select-none" onClick={() => toggleSort('wins')}>
                Wins <SortIcon field="wins" />
              </th>
              <th className="px-4 py-2.5 text-center cursor-pointer hover:text-gray-800 transition-colors select-none" onClick={() => toggleSort('time')}>
                Best (s) <SortIcon field="time" />
              </th>
            </tr>
          </thead>
          <tbody>
            {winners.map((w, i) => (
              <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5 text-gray-400 text-xs">{(page - 1) * WINNERS_PER_PAGE + i + 1}</td>
                <td className="px-4 py-2.5"><CarIcon color={w.color} width={34} height={20} /></td>
                <td className="px-4 py-2.5 font-medium text-gray-800">{w.name}</td>
                <td className="px-4 py-2.5 text-center">
                  <span className="inline-flex items-center gap-0.5 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">{w.wins}×</span>
                </td>
                <td className="px-4 py-2.5 text-center text-gray-600 font-mono text-xs">{w.time.toFixed(2)}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
