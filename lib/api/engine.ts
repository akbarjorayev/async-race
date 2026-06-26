import { EngineResponse } from '@/types/cars'
import { API_BASE } from './config'

export async function startEngine(id: number): Promise<EngineResponse> {
  const res = await fetch(`${API_BASE}/engine?id=${id}&status=started`, {
    method: 'PATCH',
  })
  if (!res.ok) throw new Error('Failed to start engine')
  return res.json()
}

export async function stopEngine(id: number): Promise<EngineResponse> {
  const res = await fetch(`${API_BASE}/engine?id=${id}&status=stopped`, {
    method: 'PATCH',
  })
  if (!res.ok) throw new Error('Failed to stop engine')
  return res.json()
}

export async function driveMode(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/engine?id=${id}&status=drive`, {
    method: 'PATCH',
  })
  if (res.status === 500 || res.status === 429) return { success: false }
  if (!res.ok) throw new Error('Drive request failed')
  return res.json()
}
