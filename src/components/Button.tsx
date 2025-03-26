import { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(
        'border-2 border-orange rounded-full px-2 py-3 hover:bg-orange',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
