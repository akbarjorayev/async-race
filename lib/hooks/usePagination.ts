'use client'

import { CARS_PER_PAGE } from '@/constants/cars'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

interface UsePaginationOptions {
  totalItems: number
  itemsPerPage?: number
  paramName?: string
}

export function usePagination({
  totalItems,
  itemsPerPage = CARS_PER_PAGE,
  paramName = 'page',
}: UsePaginationOptions) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const urlPage = Number(searchParams.get(paramName)) || 1
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const currentPage = Math.min(Math.max(1, urlPage), totalPages)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(paramName, newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const nextPage = () => {
    if (currentPage < totalPages) setPage(currentPage + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) setPage(currentPage - 1)
  }

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    setPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  }
}
