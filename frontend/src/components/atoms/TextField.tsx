import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function TextField({ label, id, className = '', ...props }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-gray-600">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      />
    </div>
  )
}
