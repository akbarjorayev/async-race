import { useRef } from 'react'
import { useCarStore } from '@/lib/store/useCarStore'
import Button from '@/components/Button/Button'
import Input from '@/components/Input/Input'

export default function UpdateCar({ ...props }) {
  const update = useCarStore((state) => state.update)
  const nameRef = useRef<HTMLInputElement>(null)
  const colorRef = useRef<HTMLInputElement>(null)

  function updateCar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const name = nameRef.current?.value.trim() || ''
    const color = colorRef.current?.value || ''

    if (!name) return

    update(name, color)
    nameRef.current!.value = ''
    colorRef.current!.value = ''
  }

  return (
    <>
      <form onSubmit={updateCar} className="list_x" {...props}>
        <Input
          ref={nameRef}
          type="text"
          name="update-car-name"
          required
          placeholder="Car Name"
        />
        <Input ref={colorRef} type="color" placeholder="Car Color" />
        <Button type="submit">Update Car</Button>
      </form>
    </>
  )
}
