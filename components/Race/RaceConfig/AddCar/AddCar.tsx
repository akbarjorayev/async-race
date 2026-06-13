import { useRef } from 'react'
import { useCarStore } from '@/lib/store/useCarStore'
import Button from '@/components/Button/Button'
import Input from '@/components/Input/Input'

export default function AddCar() {
  const add = useCarStore((state) => state.add)
  const nameRef = useRef<HTMLInputElement>(null)
  const colorRef = useRef<HTMLInputElement>(null)

  function newCar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const name = nameRef.current?.value.trim() || ''
    const color = colorRef.current?.value || ''

    if (!name) return

    add(name, color)
    nameRef.current!.value = ''
    colorRef.current!.value = ''
  }

  return (
    <>
      <form onSubmit={newCar} className="list_x">
        <Input
          ref={nameRef}
          type="text"
          name="car-name"
          required
          placeholder="Car Name"
        />
        <Input ref={colorRef} type="color" placeholder="Car Color" />
        <Button type="submit">Add new Car</Button>
      </form>
    </>
  )
}
