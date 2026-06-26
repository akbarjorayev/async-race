import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { useCarStore } from '@/lib/store/useCarStore'
import Button from '@/components/Button/Button'
import Input from '@/components/Input/Input'

export default function UpdateCar() {
  const selectedCarId = useCarStore((state) => state.selectedCarId)
  const updateCar = useCarStore((state) => state.updateCar)
  const nameRef = useRef<HTMLInputElement>(null)
  const colorRef = useRef<HTMLInputElement>(null)
  const disabled = selectedCarId === undefined

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (selectedCarId === undefined) return
    const name = nameRef.current?.value.trim() ?? ''
    const color = colorRef.current?.value ?? '#3b82f6'
    if (!name) return
    await updateCar(selectedCarId, name, color)
    nameRef.current!.value = ''
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-1.5 transition-opacity duration-150 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
    >
      <Input
        ref={nameRef}
        type="text"
        name="update-car-name"
        required
        placeholder="New name"
        maxLength={50}
        className="w-36 min-w-0"
      />
      <Input ref={colorRef} type="color" defaultValue="#3b82f6" />
      <Button type="submit" variant="secondary" className="!w-8 !h-8 !px-0 !py-0 text-xs shrink-0">
        <FontAwesomeIcon icon={faPen} />
      </Button>
    </form>
  )
}
