// src/hooks/useOfflineCache.ts
import { useEffect } from 'react'
import { OfflineCache } from '@/lib/offlineCache'
import useAppStore from '@/store/app/appStore'

export const useOfflineCache = () => {
  const { executeFnc } = useAppStore()

  useEffect(() => {
    const initCache = async () => {
      try {
        const cache = new OfflineCache()
        await cache.init()
        await cache.cachePosPoints(executeFnc)
        await cache.cacheProducts(executeFnc)
        await cache.cacheCategories(executeFnc)
        await cache.cachePaymentMethods(executeFnc)
        await cache.cacheContacts(executeFnc)
      } catch (error) {
        console.error('Error inicializando cache:', error)
      }
    }

    initCache()
  }, [executeFnc])
}
