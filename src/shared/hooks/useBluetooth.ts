import { useCallback, useRef } from 'react'
import useAppStore from '@/store/app/appStore'

export function useBluetooth() {
  const { bluetooth_config, setDevice, setConnected, setWeightValue, device } = useAppStore()

  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const decoder = useRef(new TextDecoder('utf-8'))

  const connectToDevice = useCallback(async () => {
    try {
      const dev = await (navigator as any).bluetooth.requestDevice({
        filters: [{ name: bluetooth_config.device_name }],
        optionalServices: [bluetooth_config.service_Uuid],
      })
      setDevice(dev)

      const server = await dev.gatt!.connect()
      const service = await server.getPrimaryService(bluetooth_config.service_Uuid)
      const characteristic = await service.getCharacteristic(bluetooth_config.character_Uuid)

      characteristicRef.current = characteristic

      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target?.value as DataView
        if (value) {
          const weight = parseFloat(decoder.current.decode(value))
          if (!isNaN(weight)) setWeightValue(weight)
        }
      })

      await characteristic.startNotifications()
      setConnected(true)

      dev.addEventListener('gattserverdisconnected', () => setConnected(false))
    } catch (err) {
      console.error('❌ Error al conectar:', err)
    }
  }, [bluetooth_config, setDevice, setConnected, setWeightValue])

  const disconnect = useCallback(() => {
    if (device && device.gatt?.connected) {
      device.gatt.disconnect()
      setConnected(false)
    }
  }, [device, setConnected])

  return { connectToDevice, disconnect }
}
