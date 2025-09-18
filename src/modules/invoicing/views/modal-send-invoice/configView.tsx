import { frmElementsProps } from '@/shared/shared.types'
import { MultiSelectObject, TextControlled } from '@/shared/ui'
import { useCallback, useEffect, useState } from 'react'
import useAppStore from '@/store/app/appStore'
import { Chip, Input } from '@mui/material'
import { pdf } from '@react-pdf/renderer'
import { InvoicePdf } from '../../components/InvoicePdf'
import { FaTimes } from 'react-icons/fa'
import emailjs from 'emailjs-com'

export function FrmTop({ control, errors }: frmElementsProps) {
  const { executeFnc, formItem } = useAppStore()

  const [contacts, setContacts] = useState<any[]>([])
  const [attachments, setAttachments] = useState<{ name: string; blob: Blob; base64?: string }[]>(
    []
  )
  const sendEmail = async () => {
    try {
      await emailjs.send(
        'service_6nswcve',
        'template_0xzqquw',
        {
          to: 'neburtnt@gmail.com',
          subject: control.getValues('subject'),
          message: control.getValues('message'),

          attachments: attachments.map((att) => att.base64).join(','),
        },
        'LRi3in64_CQyL3qOT'
      )
      alert('Correo enviado con éxito ')
    } catch (err) {
      console.error('Error enviando correo:', err)
      alert('Error al enviar el correo ')
    }
  }

  const loadData = useCallback(async () => {
    const data = await executeFnc('fnc_partner', 's2', [{ column: 'state', value: 'A' }])
    console.log('Data', data)
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

  // Convertir archivo a Base64
  const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Generar el PDF automáticamente cuando se carga el componente
  useEffect(() => {
    const generatePdf = async () => {
      if (formItem) {
        const InvoicePDFDocument = () => <InvoicePdf.InvoicePDF watch={() => formItem} />

        const blob = await pdf(<InvoicePDFDocument />).toBlob()
        const base64 = await fileToBase64(blob)

        const fileName = `INV_${formItem.name.replace(/\//g, '_')}.pdf`

        // Añadir el PDF generado a la lista de adjuntos
        setAttachments((prev) => [...prev, { name: fileName, blob: blob, base64: base64 }])

        if (control && control.setValue) {
          control.setValue('attachments', [{ name: fileName, file: blob }])
        }
      }
    }

    generatePdf()
  }, [formItem, control])

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Selección de destinatarios */}
      <div className="flex gap-4">
        <button
          className="py-[5px] px-[10px] border-[1.5px] border-[#e7e9ed]/50 rounded-[4px] font-semibold bg-[#e7e9ed] hover:bg-[#d8dadd] text-xs"
          onClick={() => {
            sendEmail()
          }}
        >
          Enviar
        </button>
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

      {/* Asunto */}
      <div className="flex gap-4">
        <span>Asunto:</span>
        <TextControlled control={control} name={'subject'} errors={errors} />
      </div>

      {/* Mensaje */}
      <TextControlled control={control} name={'message'} errors={errors} multiline={true} />

      {/* Input para subir archivos */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Adjuntar archivo:</label>
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          multiple
          onChange={async (e) => {
            if (e.target.files) {
              const filesArray = Array.from(e.target.files)
              const base64Files = await Promise.all(
                filesArray.map(async (file) => ({
                  name: file.name,
                  blob: file,
                  base64: await fileToBase64(file),
                }))
              )
              setAttachments((prev) => [...prev, ...base64Files])
            }
          }}
        />
      </div>

      {/* Mostrar adjuntos */}
      {attachments.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {attachments.map((att, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-gray-100 p-2 rounded w-fit cursor-pointer"
              onClick={() => window.open(URL.createObjectURL(att.blob))}
            >
              <span className="text-sm">{att.name}</span>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation()
                  setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                }}
              >
                <FaTimes size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
