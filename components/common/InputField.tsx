import React from 'react'

interface InputFieldProps {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}

export function inputStyle(hasError: boolean) {
  return {
    borderColor: hasError ? '#ef4444' : '#d9d4ce',
    backgroundColor: 'white',
    color: 'var(--color-charcoal)',
  }
}

export function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'var(--color-amber-mid)'
}

export function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError: boolean) {
  e.target.style.borderColor = hasError ? '#ef4444' : '#d9d4ce'
}

export default function InputField({ id, label, required, hint, error, children }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-charcoal)' }}>
        {label}
        {required && <span aria-hidden="true" className="ml-1" style={{ color: 'var(--color-amber-mid)' }}>*</span>}
        {hint && <span className="ml-2 text-xs font-normal" style={{ color: 'var(--color-charcoal-60)' }}>{hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs mt-1 break-words" style={{ color: '#ef4444' }} role="alert">{error}</p>}
    </div>
  )
}
