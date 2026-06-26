'use client'

import { useState } from 'react'

export default function Input({
  ref,
  type,
  className = '',
  ...props
}: {
  ref?: React.Ref<HTMLInputElement>
  type: string
  className?: string
  [key: string]: any
}) {
  const [colorVal, setColorVal] = useState<string>(
    type === 'color' ? (props.defaultValue ?? '#3b82f6') : '#000000'
  )

  if (type === 'color') {
    return (
      <label className={`relative cursor-pointer group shrink-0 ${className}`}>
        <input
          ref={ref}
          type="color"
          className="sr-only"
          onChange={(e) => setColorVal(e.target.value)}
          {...props}
        />
        <div
          className="w-6 h-6 rounded-full border-2 border-white shadow-md ring-2 ring-gray-200 group-hover:ring-blue-300 group-hover:scale-110 transition-all duration-150"
          style={{ backgroundColor: colorVal }}
        />
      </label>
    )
  }

  if (type === 'radio') {
    return (
      <input
        ref={ref}
        type="radio"
        className={`w-3.5 h-3.5 accent-blue-600 cursor-pointer shrink-0 ${className}`}
        {...props}
      />
    )
  }

  return (
    <input
      ref={ref}
      type={type}
      className={`px-3 py-1.5 rounded-full bg-gray-50 border border-gray-300 text-gray-900 text-sm placeholder-gray-400 outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all ${className}`}
      {...props}
    />
  )
}
