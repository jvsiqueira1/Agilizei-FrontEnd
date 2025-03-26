import { InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export default function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={twMerge(
        'border-2 border-light-orange rounded-2xl px-4 py-3 focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}
