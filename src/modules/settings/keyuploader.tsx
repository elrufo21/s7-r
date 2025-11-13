import { offlineCache } from '@/lib/offlineCache'
import React, { useState } from 'react'

interface QZKeyUploaderProps {
  title?: string
  description?: string
}

const QZKeyUploader: React.FC<QZKeyUploaderProps> = ({
  title = 'Claves de Firma QZ Tray',
  description = 'Sube los archivos del certificado y la clave privada que usará QZ Tray para firmar digitalmente.',
}) => {
  const [certificate, setCertificate] = useState<File | null>(null)
  const [privateKey, setPrivateKey] = useState<File | null>(null)
  const [message, setMessage] = useState<string>('')

  const handleSave = async () => {
    if (!certificate || !privateKey) {
      setMessage('⚠️ Selecciona ambos archivos antes de guardar.')
      return
    }

    try {
      const certText = await certificate.text()
      const keyText = await privateKey.text()

      await offlineCache.saveQZKeys(certText, keyText)

      setMessage('✅ Claves guardadas correctamente en el almacenamiento local.')
    } catch (error) {
      console.error(error)
      setMessage('❌ Error al guardar las claves.')
    }
  }

  return (
    <div className="o_setting_right_pane">
      <label className="o_form_label">{title}</label>
      <div className="text-muted mb8">{description}</div>

      <div className="mt8">
        <div className="mb4">
          <label className="text-muted">Certificado (.txt)</label>
          <input
            type="file"
            accept=".txt"
            className="form-control"
            onChange={(e) => setCertificate(e.target.files?.[0] || null)}
          />
        </div>

        <div className="mb4">
          <label className="text-muted">Clave Privada (.pem)</label>
          <input
            type="file"
            accept=".pem"
            className="form-control"
            onChange={(e) => setPrivateKey(e.target.files?.[0] || null)}
          />
        </div>

        <button className="btn btn-link mt8" onClick={handleSave}>
          <span>Guardar claves</span>
        </button>

        {message && <div className="text-muted mt8">{message}</div>}
      </div>
    </div>
  )
}

export default QZKeyUploader
