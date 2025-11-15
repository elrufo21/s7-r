import { offlineCache } from '@/lib/offlineCache'
import React, { useState } from 'react'

interface QZKeyUploaderProps {
  title?: string
  description?: string
}

const QZKeyUploader: React.FC<QZKeyUploaderProps> = () => {
  const [file, setFile] = useState<File | null>(null)
  const [msg, setMsg] = useState('')

  async function handleSave() {
    if (!file) {
      setMsg('⚠️ Selecciona un archivo qztray.p12')
      return
    }

    try {
      const base64 = await fileToBase64(file)

      await offlineCache.saveQZP12(base64)

      setMsg('✅ qztray.p12 guardado correctamente.')
    } catch (err) {
      console.error(err)
      setMsg('❌ Error al guardar el archivo.')
    }
  }

  return (
    <div>
      <label>Sube tu archivo qztray.p12</label>

      <input type="file" accept=".p12" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <button onClick={handleSave}>Guardar clave</button>

      {msg && <p>{msg}</p>}
    </div>
  )
}

export default QZKeyUploader

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
