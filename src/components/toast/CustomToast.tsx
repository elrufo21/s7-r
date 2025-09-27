import { toast } from 'sonner'
import { IoCloseSharp } from 'react-icons/io5'

import { MdErrorOutline } from 'react-icons/md' // error common

interface CustomToastProps {
  title: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning'
}

export const CustomToast = ({ title, description, type = 'info' }: CustomToastProps) => {
  const styles: Record<string, string> = {
    success: 'l-toast-success',
    error: 'l-toast-error',
    info: 'l-toast-info',
    warning: 'l-toast-warning',
    // success: "l-toast-success bg-green-500/90 border-green-400/50",
    // error: "l-toast-error bg-red-500/90 border-red-400/50",
    // info: "l-toast-info bg-blue-500/90 border-blue-400/50",
    // warning: "l-toast-warning bg-yellow-500/90 border-yellow-400/50",
  }

  return toast.custom(
    (t) => (
      <div
        // className="l-toast-container"
        className={`
          l-toast-container
          ${t.visible ? 'animate-in slide-in-from-top-2' : 'animate-out slide-out-to-top-2'}
          ${styles[type]}
        `}
      >
        <div className="l-toast-icon">
          <MdErrorOutline className="h-8 w-8 text-white" />
        </div>
        <div className="l-toast-content">
          <span className="t_title">{title}</span>
          {description && <span className="t_description">{description}</span>}
        </div>
        <div className="l-toast-close">
          <button onClick={() => toast.dismiss(t.id)}>
            <IoCloseSharp className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    ),
    {
      duration: 4000,
      // duration: Infinity,
    }
  )
}
