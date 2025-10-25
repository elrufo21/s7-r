import { toast } from 'sonner'
import { IoCloseSharp } from 'react-icons/io5'
import { MdErrorOutline } from 'react-icons/md'
import React from 'react'

interface CustomToastProps {
  title: string
  description?: string | React.ReactNode
  items?: { message: string }[]
  type?: 'success' | 'error' | 'info' | 'warning'
}

export const CustomToast = ({ title, description, items, type = 'info' }: CustomToastProps) => {
  const styles: Record<string, string> = {
    success: 'l-toast-success',
    error: 'l-toast-error',
    info: 'l-toast-info',
    warning: 'l-toast-warning',
  }

  const id = crypto.randomUUID()

  return toast.custom(
    () => (
      <div className={`l-toast-container ${styles[type]} animate-in slide-in-from-top-2`} key={id}>
        <div className="l-toast-icon">
          <MdErrorOutline className="h-8 w-8 text-white" />
        </div>

        <div className="l-toast-content">
          <span className="t_title">{title}</span>

          {description && <span className="t_description">{description}</span>}

          {items?.length ? (
            <ul className="mt-1 list-disc list-inside text-white/90 text-sm space-y-0.5">
              {items.map((item, i) => (
                <li key={i}>{item.message}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="l-toast-close">
          <button onClick={() => toast.dismiss(id)}>
            <IoCloseSharp className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    ),
    {
      id,
      duration: 4000,
    }
  )
}
