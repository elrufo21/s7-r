import { frmElementsProps } from '@/shared/shared.types'
import { MultiSelectObject, TextControlled } from '@/shared/ui'
import { useCallback, useEffect } from 'react'
import useAppStore from '@/store/app/appStore'
import { useState } from 'react'
import { Chip, Input } from '@mui/material'
import { pdf } from '@react-pdf/renderer'
import { InvoicePdf } from '../../components/InvoicePdf'
import { FaTimes } from 'react-icons/fa'

export function FrmTop({ control, errors }: frmElementsProps) {
  const { executeFnc, formItem } = useAppStore()

  const [contacts, setContacts] = useState<any[]>([])
  const [pdfAttachment, setPdfAttachment] = useState<{ name: string; blob: Blob } | null>(null)

  const loadData = useCallback(async () => {
    const data = await executeFnc('fnc_partner', 's2', [{ column: 'state', value: 'A' }])
    const oj_data = data.oj_data
    if (oj_data) {
      const options = oj_data.map((item: any) => ({
        ...item,
        label: item.full_name__email,
        value: item.value,
      }))
      if (!formItem) {
        return setContacts(options)
      }
      setContacts([...options])
    }
  }, [formItem, executeFnc])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Generar el PDF automáticamente cuando se carga el componente
  useEffect(() => {
    const generatePdf = async () => {
      if (formItem) {
        // Crear el componente PDF
        const InvoicePDFDocument = () => <InvoicePdf.InvoicePDF watch={() => formItem} />

        // Generar el blob del PDF
        const blob = await pdf(<InvoicePDFDocument />).toBlob()

        // Crear un nombre de archivo basado en el número de factura
        const fileName = `INV_${formItem.name.replace(/\//g, '_')}.pdf`

        // Establecer el archivo adjunto
        setPdfAttachment({
          name: fileName,
          blob: blob,
        })

        // Si necesitas añadir el archivo al formulario (para enviarlo)
        if (control && control.setValue) {
          control.setValue('attachments', [{ name: fileName, file: blob }])
        }
      }
    }

    generatePdf()
  }, [formItem, control])

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex gap-4">
        <span>A:</span>
        <MultiSelectObject
          control={control}
          name={'to'}
          errors={errors}
          options={contacts}
          fnc_loadOptions={loadData}
          renderTags={(values, getTagProps) => {
            return values.map((value: any, index: number) => (
              <div className="relative" key={value.full_name__email}>
                <Chip
                  {...getTagProps({ index })}
                  key={index}
                  label={value.name}
                  size="small"
                  className="text-gray-700"
                />
                {!value.email && (
                  <div className="absolute -bottom-32 left-0 bg-white z-[99999] border-2 border-gray-300 rounded-md p-2 w-80 flex flex-col gap-2 justify-around h-32">
                    <div className="text-xs font-semibold">
                      ¿Cuál es la dirección de correo electrónico de{' '}
                      <span className="font-bold text-[#714b67]">{value.name}</span>?
                    </div>
                    <Input
                      placeholder="Por ejemplo example@example.com"
                      className="border-[1.5px] border-gray-300 rounded-[4px] px-2 text-xs"
                    />

                    <div className="flex gap-2">
                      <button
                        className="py-[5px] px-[10px] text-white border-[1.5px] border-[#e7e9ed]/50 rounded-[4px] font-semibold bg-[#714b67] hover:bg-[#52374b] text-xs"
                        onClick={() => {}}
                      >
                        Definir correo electrónico
                      </button>
                      <button
                        className="py-[5px] px-[10px] border-[1.5px] border-[#e7e9ed]/50 rounded-[4px] font-semibold bg-[#e7e9ed] hover:bg-[#d8dadd] text-xs"
                        onClick={() => {}}
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          }}
        />
      </div>
      <div className="flex gap-4">
        <span>Asunto:</span>
        <TextControlled control={control} name={'subject'} errors={errors} />
      </div>
      <TextControlled control={control} name={'message'} errors={errors} multiline={true} />

      {/* Mostrar el PDF precargado como adjunto */}
      {pdfAttachment && (
        <div className="mt-4">
          <div
            className="flex items-center gap-2 bg-gray-100 p-2 rounded w-fit cursor-pointer"
            onClick={() => window.open(URL.createObjectURL(pdfAttachment.blob))}
          >
            <span className="text-sm ">{pdfAttachment.name}</span>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => {
                setPdfAttachment(null)
              }}
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
