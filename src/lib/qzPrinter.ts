import qz from 'qz-tray'
import { offlineCache } from './offlineCache'

// ✅ Función para firmar los datos con tu clave privada
async function signData(toSign: string, privateKeyPem: string): Promise<string> {
  console.log('✍️ Firmando datos...')
  // Aquí podrías luego usar crypto.subtle para una firma real
  return btoa(toSign)
}

// ✅ Configura la seguridad usando claves locales (desde IndexedDB)
async function setupSecurity() {
  try {
    // 🚀 Obtener claves QZ desde IndexedDB
    const qzKeys = await offlineCache.getQZKeys()
    if (!qzKeys) {
      throw new Error('❌ No se encontraron claves QZ en la base de datos local (IndexedDB).')
    }

    const { cert, privateKey } = qzKeys

    // 🔐 Configurar QZ Tray con los valores guardados localmente
    qz.security.setCertificatePromise(() => Promise.resolve(cert))
    qz.security.setSignaturePromise((toSign) => signData(toSign, privateKey))

    console.log('🔐 Seguridad QZ configurada correctamente.')
  } catch (error) {
    console.error('Error configurando seguridad QZ:', error)
  }
}

// ✅ Conexión con QZ Tray
export async function connectQZ() {
  try {
    if (!qz.websocket.isActive()) {
      await setupSecurity()
      await qz.websocket.connect()
      console.log('🧩 Conectado con QZ Tray.')
    }
  } catch (err) {
    console.error('❌ No se pudo conectar con QZ Tray:', err)
  }
}

// ✅ Obtener lista de impresoras
export async function getPrinters() {
  await connectQZ()
  const printers = await qz.printers.find()
  return printers
}

export async function printHTML(htmlContent: string, printerName?: string) {
  try {
    await connectQZ()

    let printer = printerName
    if (!printer) {
      printer = await qz.printers.getDefault()
    } else {
      const found = await qz.printers.find(printerName)
      if (!found) throw new Error(`No se encontró la impresora "${printerName}"`)
      printer = found
    }

    const config = qz.configs.create(printer, {
      size: { width: 80, units: 'mm' },
      margins: 0,
      orientation: 'portrait',
      copies: 1,
      density: 2,
      scaleContent: true,
      altPrinting: true,
      colorType: 'grayscale',
    })

    const data = [
      {
        type: 'html',
        format: 'plain',
        data: htmlContent,
      },
    ]

    await qz.print(config, data)
    console.log('✅ Impresión enviada correctamente.')
  } catch (err) {
    console.error('❌ Error al imprimir con QZ:', err)
  }
}
