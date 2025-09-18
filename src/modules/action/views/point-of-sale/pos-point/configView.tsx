import { required } from '@/shared/helpers/validators'
import { frmElementsProps } from '@/shared/shared.types'
import { TextControlled } from '@/shared/ui'
import { useCallback } from 'react'
import { pdf } from '@react-pdf/renderer'
import TotalSalesTodayPDF from '@/modules/invoicing/components/TotalSalesTodayPDF'

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  // Función para descargar el PDF
  const downloadSalesReport = useCallback(async () => {
    try {
      // Data de ejemplo para el reporte
      const sampleSalesData = [
        { name: 'ALAS', pBruto: 128.8, tara: 0, merma: 0, pNeto: 128.8, totalDinero: 1673.6 },
        { name: 'FILETE FRES', pBruto: 131.5, tara: 0, merma: 0, pNeto: 131.5, totalDinero: 2353 },
        { name: 'HIGADO', pBruto: 106.2, tara: 0, merma: 0, pNeto: 106.2, totalDinero: 558.4 },
        { name: 'LOMO', pBruto: 322.7, tara: 0, merma: 0, pNeto: 322.7, totalDinero: 903.6 },
        {
          name: 'PB X MAYOR',
          pBruto: 3407.5,
          tara: 0,
          merma: 0,
          pNeto: 3407.5,
          totalDinero: 28276.6,
        },
        { name: 'PECHO ESPE', pBruto: 192.2, tara: 0, merma: 0, pNeto: 192.2, totalDinero: 2845.3 },
        { name: 'MILANESA', pBruto: 85.8, tara: 0, merma: 0, pNeto: 85.8, totalDinero: 1244.8 },
        { name: 'MOLLEJA', pBruto: 131.6, tara: 0, merma: 0, pNeto: 131.6, totalDinero: 266 },
        { name: 'RABADILLA', pBruto: 196.2, tara: 0, merma: 0, pNeto: 196.2, totalDinero: 445.4 },
        { name: 'PIER ESPE', pBruto: 116.1, tara: 0, merma: 0, pNeto: 116.1, totalDinero: 1276.6 },
      ]

      const totalAmount = 45630.1
      const today = new Date().toISOString().split('T')[0]

      // Crear el PDF
      const doc = (
        <TotalSalesTodayPDF salesData={sampleSalesData} totalAmount={totalAmount} date={today} />
      )

      // Generar el blob del PDF
      const asPdf = pdf(doc)
      const blob = await asPdf.toBlob()

      // Crear link de descarga
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reporte-ventas-${today}.pdf`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al generar el PDF:', error)
      alert('Error al generar el reporte. Por favor intenta nuevamente.')
    }
  }, [])

  return (
    <>
      <TextControlled
        name={'name'}
        className={'frm_dsc'}
        placeholder={'por ejemplo, tienda en lima'}
        control={control}
        multiline={true}
        rules={required()}
        errors={errors}
        editConfig={{ config: editConfig }}
      />
      <br />
      <br />

      {/* Botón para descargar reporte de ventas */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={downloadSalesReport}
          className="btn btn-primary oe_kanban_action"
        >
          PDF
        </button>
      </div>

      <br />
    </>
  )
}
