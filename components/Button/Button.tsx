type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  ghost: 'hover:bg-gray-100 text-gray-500 hover:text-gray-800',
  icon: 'bg-gray-100 hover:bg-gray-200 text-gray-600',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: {
  children: React.ReactNode
  variant?: Variant
  className?: string
  [key: string]: any
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer border-none outline-none transition-all duration-150 active:scale-95 shrink-0 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
