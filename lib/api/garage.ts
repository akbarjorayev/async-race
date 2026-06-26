import { Car } from '@/types/cars'
import { API_BASE } from './config'

export async function getCars(): Promise<Car[]> {
  const res = await fetch(`${API_BASE}/garage`)
  if (!res.ok) throw new Error('Failed to fetch cars')
  return res.json()
}

export async function createCar(name: string, color: string): Promise<Car> {
  const res = await fetch(`${API_BASE}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  })
  if (!res.ok) throw new Error('Failed to create car')
  return res.json()
}

export async function updateCar(
  id: number,
  name: string,
  color: string,
): Promise<Car> {
  const res = await fetch(`${API_BASE}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  })
  if (!res.ok) throw new Error('Failed to update car')
  return res.json()
}

export async function deleteCar(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/garage/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete car')
}
