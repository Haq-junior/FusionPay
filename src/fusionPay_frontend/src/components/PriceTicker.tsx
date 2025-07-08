import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { usePriceData } from '../utils/priceService'

interface PriceTickerProps {
  compact?: boolean
  showGHS?: boolean
  showUSD?: boolean
  showEUR?: boolean
  className?: string
}

const PriceTicker: React.FC<PriceTickerProps> = ({ 
  compact = false, 
  showGHS = true, 
  showUSD = true, 
  showEUR = false,
  className = ""
}) => {
  const { priceData, refreshPrices, isLoading, error } = usePriceData()
  const tickerRef = useRef<HTMLDivElement>(null)
  const refreshIconRef = useRef<HTMLButtonElement>(null)
  const priceRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    // Animate ticker entrance
    if (tickerRef.current) {
      gsap.fromTo(tickerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
    }
  }, [])

  useEffect(() => {
    // Animate price updates
    priceRefs.current.forEach(ref => {
      if (ref) {
        gsap.fromTo(ref,
          { scale: 1.1, color: '#3B82F6' },
          { scale: 1, color: 'inherit', duration: 0.5, ease: "back.out(1.7)" }
        )
      }
    })
  }, [priceData.lastUpdated])

  const handleRefresh = () => {
    if (refreshIconRef.current) {
      gsap.to(refreshIconRef.current, {
        rotation: 360,
        duration: 0.8,
        ease: "power2.out"
      })
    }
    refreshPrices()
  }

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'USD' || currency === 'EUR') {
      return `${currency === 'USD' ? '$' : '€'}${price.toFixed(2)}`
    }
    return `₵${price.toFixed(2)}`
  }

  const getTimeSinceUpdate = () => {
    const now = new Date()
    const diffMs = now.getTime() - priceData.lastUpdated.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    
    if (diffSecs < 60) return `${diffSecs}s ago`
    const diffMins = Math.floor(diffSecs / 60)
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours}h ago`
  }

  if (compact) {
    return (
      <div 
        ref={tickerRef}
        className={`flex items-center space-x-2 text-sm ${className}`}
      >
        <div className="flex items-center space-x-1">
          <span className="text-gray-400">ICP:</span>
          {showGHS && (
            <span 
              ref={el => priceRefs.current[0] = el}
              className="text-white font-mono"
            >
              ₵{priceData.icp_ghs.toFixed(2)}
            </span>
          )}
          {showUSD && (
            <span 
              ref={el => priceRefs.current[1] = el}
              className="text-gray-300 font-mono"
            >
              ${priceData.icp_usd.toFixed(2)}
            </span>
          )}
        </div>
        
        <button
          ref={refreshIconRef}
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
          title="Refresh prices"
        >
          <RefreshCw className={`w-3 h-3 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
        
        {error && (
          <div title={error}>
            <AlertCircle className="w-3 h-3 text-yellow-400" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div 
      ref={tickerRef}
      className={`bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/10 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h3 className="text-white font-semibold">Live ICP Prices</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">{getTimeSinceUpdate()}</span>
          <button
            ref={refreshIconRef}
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors disabled:opacity-50"
            title="Refresh prices"
          >
            <RefreshCw className={`w-4 h-4 text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {showGHS && (
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-3 border border-green-500/30">
            <div className="text-green-400 text-xs font-medium mb-1">ICP/GHS</div>
            <div 
              ref={el => priceRefs.current[0] = el}
              className="text-white text-xl font-bold font-mono"
            >
              ₵{priceData.icp_ghs.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Ghana Cedi</div>
          </div>
        )}
        
        {showUSD && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 border border-blue-500/30">
            <div className="text-blue-400 text-xs font-medium mb-1">ICP/USD</div>
            <div 
              ref={el => priceRefs.current[1] = el}
              className="text-white text-xl font-bold font-mono"
            >
              ${priceData.icp_usd.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">US Dollar</div>
          </div>
        )}
        
        {showEUR && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-purple-500/30">
            <div className="text-purple-400 text-xs font-medium mb-1">ICP/EUR</div>
            <div 
              ref={el => priceRefs.current[2] = el}
              className="text-white text-xl font-bold font-mono"
            >
              €{priceData.icp_eur.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Euro</div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="text-yellow-300 text-xs">{error}</span>
          </div>
        </div>
      )}
      
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Auto-refreshes every 30s</span>
          <span>Powered by CoinGecko</span>
        </div>
      </div>
    </div>
  )
}

export default PriceTicker 