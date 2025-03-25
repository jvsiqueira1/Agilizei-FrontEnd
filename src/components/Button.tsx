import { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(
        'border-2 border-[#DB4E1E] rounded-full px-2 py-3 hover:bg-[#DB4E1E]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
