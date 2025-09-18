import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import { BiHighlight } from 'react-icons/bi'
import { GrTrash } from 'react-icons/gr'
import { toast } from 'sonner'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

interface ImagePickerTableProps {
  row: any
  column: any
  control: any
  maxSize?: number
  onChange: (data: { rowId: number; columnId: string; image: string | null }) => void
}

export const ImagePickerTable = ({
  row,
  column,
  control,
  maxSize = 300,
  onChange,
}: ImagePickerTableProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(row.original[column.id] || null)
  const [openDialog, setOpenDialog] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (file.size > maxSize * 1024) {
          toast.warning('El tamaño de la imagen supera el límite permitido')
          return
        }
        if (!file.type.includes('image')) {
          toast.warning('El archivo seleccionado no es una imagen')
          return
        }
        setImage(reader.result as string)
        onChange({ rowId: row.index, columnId: column.id, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    setImage(row.original[column.id] || null)
  }, [row.original, column.id])

  return (
    <div className="relative flex  w-full h-full">
      <Controller
        control={control}
        name={`${row.index}.${column.id}`}
        render={() => (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
              hidden
            />
            <div className="relative w-16 h-16">
              <img
                className="w-full h-full object-cover rounded-md border border-gray-300 cursor-pointer"
                src={
                  image ||
                  'https://wmhhzgqpnsneiggexoon.supabase.co/storage/v1/object/public/images/generic/camera_add_4.png'
                }
                alt="Imagen"
                onClick={() => setOpenDialog(true)}
              />
              <div className="absolute bottom-0 flex w-full bg-white bg-opacity-70 justify-between p-1 rounded-md">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-gray-600 hover:text-blue-500"
                >
                  <BiHighlight className="w-4 h-4" />
                </button>
                {image && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null)
                      onChange({ rowId: row.index, columnId: column.id, image: null })
                    }}
                    className="text-gray-600 hover:text-red-500"
                  >
                    <GrTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      />

      {/* Previsualización en un modal */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Vista Previa</DialogTitle>
        <DialogContent>
          {image && <img src={image} alt="Preview" className="w-64 h-64 object-cover" />}
        </DialogContent>
        <DialogActions>
          <button onClick={() => setOpenDialog(false)} className="px-3 py-1 bg-gray-200 rounded">
            Cerrar
          </button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
