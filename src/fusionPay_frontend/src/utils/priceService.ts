import { useState, useEffect, useCallback } from 'react'

export interface PriceData {
  icp_usd: number
  icp_ghs: number
  icp_eur: number
  lastUpdated: Date
  isLoading: boolean
  error: string | null
}

interface CoinGeckoResponse {
  'internet-computer': {
    usd: number
    eur: number
  }
}

interface ExchangeRateResponse {
  rates: {
    GHS: number
  }
}

// Fallback rates if APIs fail
const FALLBACK_RATES = {
  icp_usd: 4.93,
  icp_ghs: 50.95,
  icp_eur: 4.68
}

class PriceService {
  private static instance: PriceService
  private priceData: PriceData = {
    icp_usd: FALLBACK_RATES.icp_usd,
    icp_ghs: FALLBACK_RATES.icp_ghs,
    icp_eur: FALLBACK_RATES.icp_eur,
    lastUpdated: new Date(),
    isLoading: false,
    error: null
  }
  private subscribers: ((data: PriceData) => void)[] = []
  private updateInterval: number | null = null

  static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService()
    }
    return PriceService.instance
  }

  subscribe(callback: (data: PriceData) => void): () => void {
    this.subscribers.push(callback)
    
    // Send current data immediately
    callback(this.priceData)
    
    // Start auto-updates if this is the first subscriber
    if (this.subscribers.length === 1) {
      this.startAutoUpdates()
    }

    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
      
      // Stop auto-updates if no more subscribers
      if (this.subscribers.length === 0) {
        this.stopAutoUpdates()
      }
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.priceData))
  }

  private startAutoUpdates() {
    // Update immediately
    this.fetchPrices()
    
    // Then update every 30 seconds
    this.updateInterval = window.setInterval(() => {
      this.fetchPrices()
    }, 30000)
  }

  private stopAutoUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  async fetchPrices(): Promise<void> {
    this.priceData.isLoading = true
    this.priceData.error = null
    this.notifySubscribers()

    try {
      // Fetch ICP price in USD and EUR from CoinGecko
      const geckoResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd,eur'
      )
      
      if (!geckoResponse.ok) {
        throw new Error('Failed to fetch from CoinGecko')
      }

      const geckoData: CoinGeckoResponse = await geckoResponse.json()
      const icpUsd = geckoData['internet-computer'].usd
      const icpEur = geckoData['internet-computer'].eur

      // Fetch USD to GHS exchange rate
      const exchangeResponse = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      )
      
      if (!exchangeResponse.ok) {
        throw new Error('Failed to fetch exchange rates')
      }

      const exchangeData: ExchangeRateResponse = await exchangeResponse.json()
      const usdToGhs = exchangeData.rates.GHS

      // Calculate ICP to GHS
      const icpGhs = icpUsd * usdToGhs

      this.priceData = {
        icp_usd: icpUsd,
        icp_ghs: icpGhs,
        icp_eur: icpEur,
        lastUpdated: new Date(),
        isLoading: false,
        error: null
      }

    } catch (error) {
      console.error('Failed to fetch prices:', error)
      
      // Use fallback rates but mark as error
      this.priceData = {
        ...this.priceData,
        isLoading: false,
        error: `Unable to fetch live prices. Using cached rates.`
      }
    }

    this.notifySubscribers()
  }

  getCurrentPrice(currency: 'USD' | 'GHS' | 'EUR' = 'GHS'): number {
    switch (currency) {
      case 'USD': return this.priceData.icp_usd
      case 'EUR': return this.priceData.icp_eur
      case 'GHS': return this.priceData.icp_ghs
      default: return this.priceData.icp_ghs
    }
  }

  convertFromICP(icpAmount: number, currency: 'USD' | 'GHS' | 'EUR' = 'GHS'): number {
    return icpAmount * this.getCurrentPrice(currency)
  }

  convertToICP(amount: number, currency: 'USD' | 'GHS' | 'EUR' = 'GHS'): number {
    return amount / this.getCurrentPrice(currency)
  }
}

// React hook for using price data
export const usePriceData = () => {
  const [priceData, setPriceData] = useState<PriceData>({
    icp_usd: FALLBACK_RATES.icp_usd,
    icp_ghs: FALLBACK_RATES.icp_ghs,
    icp_eur: FALLBACK_RATES.icp_eur,
    lastUpdated: new Date(),
    isLoading: false,
    error: null
  })

  useEffect(() => {
    const priceService = PriceService.getInstance()
    const unsubscribe = priceService.subscribe(setPriceData)
    
    return unsubscribe
  }, [])

  const refreshPrices = useCallback(() => {
    const priceService = PriceService.getInstance()
    priceService.fetchPrices()
  }, [])

  return {
    priceData,
    refreshPrices,
    isLoading: priceData.isLoading,
    error: priceData.error,
    getCurrentPrice: (currency: 'USD' | 'GHS' | 'EUR' = 'GHS') => {
      return PriceService.getInstance().getCurrentPrice(currency)
    },
    convertFromICP: (icpAmount: number, currency: 'USD' | 'GHS' | 'EUR' = 'GHS') => {
      return PriceService.getInstance().convertFromICP(icpAmount, currency)
    },
    convertToICP: (amount: number, currency: 'USD' | 'GHS' | 'EUR' = 'GHS') => {
      return PriceService.getInstance().convertToICP(amount, currency)
    }
  }
}

export default PriceService 