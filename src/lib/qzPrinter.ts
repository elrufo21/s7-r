import qz from 'qz-tray'

// ✅ Función para firmar los datos con tu clave privada
async function signData(toSign: string, privateKeyPem: string): Promise<string> {
  // En producción deberías usar una API segura para firmar con clave privada.
  // Aquí solo hacemos una simulación base64 (suficiente para pruebas locales).
  console.log('✍️ Firmando datos...')
  return btoa(toSign) // Simula la firma
}

// ✅ Configura el certificado y la función de firma
async function setupSecurity() {
  try {
    const cert = await fetch('/qz/digital-certificate.txt').then((r) => r.text())
    const privateKey = await fetch('/qz/private-key.pem').then((r) => r.text())

    qz.security.setCertificatePromise(() => Promise.resolve(cert))

    // ⚠️ Aquí estaba el error: NO debes envolver otra promesa dentro
    qz.security.setSignaturePromise((toSign) => {
      return signData(toSign, privateKey) // Esto ya devuelve una promesa válida
    })

    console.log('🔐 Seguridad QZ configurada correctamente.')
  } catch (error) {
    console.error('Error configurando seguridad QZ:', error)
  }
}

// ✅ Conexión con QZ Tray
export async function connectQZ() {
  if (!qz.websocket.isActive()) {
    await setupSecurity()
    await qz.websocket.connect()
    console.log('🧩 Conectado con QZ Tray.')
  }
}

// ✅ Obtener lista de impresoras
export async function getPrinters() {
  await connectQZ()
  const printers = await qz.printers.find()
  return printers
}

// ✅ Imprimir HTML directamente
export async function printHTML(htmlContent: string, printerName?: string) {
  try {
    await connectQZ()

    // Verificar impresora
    let printer = printerName
    if (!printer) {
      printer = await qz.printers.getDefault()
    } else {
      const found = await qz.printers.find(printerName)
      if (!found) throw new Error(`No se encontró la impresora "${printerName}"`)
      printer = found
    }

    // Crear config
    const config = qz.configs.create('EPSON TM-T20III Receipt', {
      size: { width: 80, units: 'mm' },
      margins: 0,
      orientation: 'portrait',
      copies: 1,
      density: 2,
      scaleContent: true,
      altPrinting: true,
      colorType: 'grayscale',
    })

    // Crear datos
    const data = [
      {
        type: 'html',
        format: 'plain',
        data: htmlContent,
      },
    ]

    // Imprimir
    await qz.print(config, data)
    console.log('✅ Impresión enviada correctamente.')
  } catch (err) {
    console.error('❌ Error al imprimir con QZ:', err)
  }
}
