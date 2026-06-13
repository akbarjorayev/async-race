import './Input.css'

export default function Input({
  ref,
  type,
  ...props
}: {
  ref?: React.Ref<HTMLInputElement>
  type: string
  [key: string]: any
}) {
  return <input ref={ref} type={type} {...props} />
}
