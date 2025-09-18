import { useEffect, useCallback, useRef } from 'react'
import useAppStore from '@/store/app/appStore'

export function useBluetoothWeight() {
  const { bluetooth_config, setDevice, device, setConnected, setWeightValue, connected } =
    useAppStore()

  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const decoder = useRef(new TextDecoder('utf-8'))

  const connectToDevice = useCallback(async () => {
    try {
      if (!('bluetooth' in navigator)) {
        console.error('⚠️ Web Bluetooth no soportado en este navegador')
        return
      }

      console.log('🔍 Buscando dispositivo...')
      const dev = await (navigator as any).bluetooth.requestDevice({
        filters: [{ name: bluetooth_config.device_name }],
        optionalServices: [bluetooth_config.service_Uuid],
      })

      setDevice(dev)

      console.log('🔗 Conectando...')
      const server = await dev.gatt!.connect()
      const service = await server.getPrimaryService(bluetooth_config.service_Uuid)
      const characteristic = await service.getCharacteristic(bluetooth_config.character_Uuid)

      characteristicRef.current = characteristic

      characteristic.addEventListener('characteristicvaluechanged', (event: Event) => {
        const value = (event as any)?.target?.value as DataView | undefined
        if (value) {
          const weightString = decoder.current.decode(value)
          const weightNumber = parseFloat(weightString)
          if (!isNaN(weightNumber)) {
            setWeightValue(weightNumber)
          }
        }
      })

      await characteristic.startNotifications()
      setConnected(true)
      console.log('✅ Conectado y escuchando datos')

      dev.addEventListener('gattserverdisconnected', () => {
        setConnected(false)
        console.log('⚠️ Dispositivo desconectado')
      })
    } catch (error) {
      console.error('❌ Error al conectar:', error)
    }
  }, [bluetooth_config, setDevice, setConnected, setWeightValue])

  const disconnect = useCallback(() => {
    if (device && device.gatt?.connected) {
      device.gatt.disconnect()
      setConnected(false)
      console.log('🔌 Desconectado manualmente')
    }
  }, [device, setConnected])

  useEffect(() => {
    return () => {
      if (device && device.gatt?.connected) {
        device.gatt.disconnect()
      }
    }
  }, [device])

  return {
    connectToDevice,
    disconnect,
    connected,
  }
}
