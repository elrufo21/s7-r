import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Controller, ControllerRenderProps, FieldValues } from 'react-hook-form'
import { CustomTooltip } from '@/shared/ui'
import { BiHighlight } from 'react-icons/bi'
import { GrTrash } from 'react-icons/gr'
import { toast } from 'sonner'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { ActionTypeEnum } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'

interface ImageInputProps {
  watch: any
  name: string
  setValue: any
  control: any
  rules?: any
  maxSize?: number
  editConfig?: any
  recordId?: string | number
}

export const ImageInput = ({
  watch,
  name,
  setValue,
  control,
  rules = {},
  maxSize = 300,
  editConfig = { config: {} },
  recordId = '',
}: ImageInputProps) => {
  const { config } = editConfig
  const filesFromWatch = watch('files')
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<
    {
      publicUrl: string | ArrayBuffer | null
    }[]
  >([])
  const [openDialog, setOpenDialog] = useState(false)
  const [uriViewer, setUriViewer] = useState('')
  const watchName = watch(name)
  const { setFrmIsChangedItem } = useAppStore()

  useEffect(() => {
    if (!watchName) {
      setFiles([])
    } else {
      setFiles(watchName)
    }
  }, [watchName, recordId])

  const openViewer = (uri: string | ArrayBuffer | null) => {
    if (typeof uri == 'string') setUriViewer(uri)
    setOpenDialog(true)
  }

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => {
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
        let tmpfile = [
          {
            publicUrl: reader.result,
          },
        ]

        if (filesFromWatch) {
          if (!filesFromWatch.length) {
            setValue('afile', ActionTypeEnum.INSERT)
          } else {
            setValue('files_old', files)
            setValue('afile', ActionTypeEnum.UPDATE)
          }
        } else {
          setValue('afile', ActionTypeEnum.INSERT)
        }
        setFiles(tmpfile)
        field.onChange(tmpfile)
        setFrmIsChangedItem(true)
      }

      reader.onerror = (err) => {
        toast.error('Error al cargar la imagen ' + err)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setFiles([])
    setFrmIsChangedItem(true)
    setValue('afile', 'd')
    setValue('files_old', files)
    setValue(name, null)
  }

  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => {
          return (
            <div className="group d-inline-block position-relative opacity-trigger-hover">
              <div className="absolute w-full bottom-0 opacity-0 group-hover:opacity-100">
                {!config?.[name]?.isEdit && (
                  <div className="flex justify-between items-center">
                    <span>
                      <CustomTooltip title={'Editar'}>
                        <button
                          type="button"
                          onClick={() => {
                            if (inputRef.current) inputRef.current.click()
                          }}
                          className="o_select_file_button rounded-full p-1 m-1 hover:bg-gray-300"
                          data-tooltip="Editar"
                        >
                          <BiHighlight className="w-4 h-4" />
                        </button>
                      </CustomTooltip>
                    </span>
                    {(files?.length > 0 || files !== null) && (
                      <CustomTooltip title={'Limpiar'}>
                        <button
                          type="button"
                          onClick={clearImage}
                          style={{ textAlign: 'center' }}
                          className="o_select_file_button rounded-full p-1 m-1 hover:bg-gray-300"
                          data-tootip="Limpiar"
                        >
                          <GrTrash style={{ fontSize: '14px' }} />
                        </button>
                      </CustomTooltip>
                    )}
                  </div>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  await handleFileChange(e, field)
                }}
                hidden
                className="hidden"
              />
              {files?.[0]?.publicUrl ? (
                <img
                  className="img img-fluid cursor-pointer"
                  onClick={() => openViewer(files[0]?.publicUrl)}
                  src={files[0]?.publicUrl as string}
                  alt="imgeinput"
                  width={100}
                  height={100}
                />
              ) : (
                <img
                  className="img img-fluid"
                  src="https://wmhhzgqpnsneiggexoon.supabase.co/storage/v1/object/public/images/generic/camera_add_4.png"
                  alt="nothing"
                  width={100}
                  height={100}
                />
              )}
            </div>
          )
        }}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <img src={uriViewer} alt="dialog image" width={100} height={100} />
        </DialogContent>
        <DialogActions>
          <button onClick={() => setOpenDialog(false)}>Cerrar</button>
        </DialogActions>
      </Dialog>
    </>
  )
}
