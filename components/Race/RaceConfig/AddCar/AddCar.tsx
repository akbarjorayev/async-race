import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useCarStore } from '@/lib/store/useCarStore'
import Button from '@/components/Button/Button'
import Input from '@/components/Input/Input'

export default function AddCar() {
  const addCar = useCarStore((state) => state.addCar)
  const nameRef = useRef<HTMLInputElement>(null)
  const colorRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = nameRef.current?.value.trim() ?? ''
    const color = colorRef.current?.value ?? '#3b82f6'
    if (!name) return
    await addCar(name, color)
    nameRef.current!.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
      <Input
        ref={nameRef}
        type="text"
        name="car-name"
        required
        placeholder="New car name"
        maxLength={50}
        className="w-36 min-w-0"
      />
      <Input ref={colorRef} type="color" defaultValue="#3b82f6" />
      <Button type="submit" className="!w-8 !h-8 !px-0 !py-0 text-xs shrink-0">
        <FontAwesomeIcon icon={faPlus} />
      </Button>
    </form>
  )
}
