import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface ModalProps {
  isVisible: boolean
  onClose: () => void
  children: ReactNode
}

const Modal = ({ isVisible, onClose, children }: ModalProps) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-full max-w-[90%] md:max-w-[600px] flex flex-col max-h-[80vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-transparent">
        <Button
          className="text-black text-xl place-self-end border-none hover:text-white "
          onClick={() => onClose()}
          variant={'ghost'}
          size={'icon'}
        >
          X
        </Button>
        <div className="bg-white p-10 rounded-lg">{children}</div>
      </div>
    </div>
  )
}

export default Modal
