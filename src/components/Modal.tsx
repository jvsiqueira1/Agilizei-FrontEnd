import { ReactNode } from 'react'
import { Button } from './index'

interface ModalProps {
  isVisible: boolean
  onClose: () => void
  children: ReactNode
}

const Modal = ({ isVisible, onClose, children }: ModalProps) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[600px] flex flex-col">
        <Button
          className="text-white text-xl place-self-end border-none hover:bg-transparent"
          onClick={() => onClose()}
        >
          X
        </Button>
        <div className="bg-white p-10 rounded-lg">{children}</div>
      </div>
    </div>
  )
}

export default Modal
