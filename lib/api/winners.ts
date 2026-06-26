import { Winner } from '@/types/winners'
import { API_BASE } from './config'

export interface GetWinnersParams {
  page?: number
  limit?: number
  sort?: 'id' | 'wins' | 'time'
  order?: 'ASC' | 'DESC'
}

export async function getWinners(
  params: GetWinnersParams = {},
): Promise<{ winners: Winner[]; total: number }> {
  const qs = new URLSearchParams()
  if (params.page) qs.set('_page', String(params.page))
  if (params.limit) qs.set('_limit', String(params.limit))
  if (params.sort) qs.set('_sort', params.sort)
  if (params.order) qs.set('_order', params.order)

  const res = await fetch(`${API_BASE}/winners?${qs.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch winners')
  const winners: Winner[] = await res.json()
  const total = Number(res.headers.get('X-Total-Count')) || winners.length
  return { winners, total }
}

export async function getWinner(id: number): Promise<Winner | null> {
  const res = await fetch(`${API_BASE}/winners/${id}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch winner')
  return res.json()
}

export async function createWinner(winner: Winner): Promise<Winner> {
  const res = await fetch(`${API_BASE}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  })
  if (!res.ok) throw new Error('Failed to create winner')
  return res.json()
}

export async function updateWinner(
  id: number,
  data: { wins: number; time: number },
): Promise<Winner> {
  const res = await fetch(`${API_BASE}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update winner')
  return res.json()
}

export async function deleteWinner(id: number): Promise<void> {
  await fetch(`${API_BASE}/winners/${id}`, { method: 'DELETE' })
}
