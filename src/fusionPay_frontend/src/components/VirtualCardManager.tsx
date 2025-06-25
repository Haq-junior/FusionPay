import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Lock, 
  CreditCard,
  ShoppingCart,
  Coffee,
  Gamepad2,
  CheckCircle,
  Copy,
  Wallet,
  Plus,
  RefreshCw
} from 'lucide-react'
import BackButton from './BackButton'
import { useBackend } from '../utils/useBackend'
import { VirtualCard as BackendVirtualCard, Payment } from '../utils/backend'
import { useAuth } from '../contexts/AuthContext'

interface Transaction {
  id: string
  merchant: string
  amount: string
  icpAmount: string
  date: string
  status: 'completed' | 'pending'
  category: 'shopping' | 'entertainment' | 'food' | 'gaming'
}

interface VirtualCardManagerProps {
  onBack: () => void
}

const VirtualCardManager: React.FC<VirtualCardManagerProps> = ({ onBack }) => {
  const { isAuthenticated } = useAuth()
  const { 
    getUserCards, 
    getUserPayments,
    createVirtualCard, 
    deactivateCard, 
    getCardBalance,
    topUpCard,
    isLoading, 
    error,
    formatPaymentAmount,
    formatTimestamp,
    getPaymentStatusText,
    clearError 
  } = useBackend()
  
  const [showCardNumber, setShowCardNumber] = useState(false)
  const [showExpiry, setShowExpiry] = useState(false)
  const [showCVV, setShowCVV] = useState(false)
  const [isCardFrozen, setIsCardFrozen] = useState(false)
  const [revealTimeouts, setRevealTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>({})
  const [userCards, setUserCards] = useState<BackendVirtualCard[]>([])
  const [userPayments, setUserPayments] = useState<Payment[]>([])
  const [selectedCard, setSelectedCard] = useState<BackendVirtualCard | null>(null)
  const [cardBalance, setCardBalance] = useState<number>(0)
  const [isCreatingCard, setIsCreatingCard] = useState(false)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  
  const headerRef = useRef<HTMLDivElement>(null)
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const transactionsRef = useRef<HTMLDivElement>(null)
  const cardNumberRef = useRef<HTMLSpanElement>(null)
  const expiryRef = useRef<HTMLSpanElement>(null)
  const cvvRef = useRef<HTMLSpanElement>(null)

  // Card transactions will be replaced with real backend data when available
  const cardTransactions: Transaction[] = userPayments.slice(0, 4).map(payment => ({
    id: payment.id,
    merchant: payment.description,
    amount: formatPaymentAmount(payment.amount, payment.currency),
    icpAmount: `${(Number(payment.amount) / 238).toFixed(2)} ICP`,
    date: formatTimestamp(payment.timestamp),
    status: getPaymentStatusText(payment.status).toLowerCase() as 'completed' | 'pending',
    category: 'shopping' // Default category - can be enhanced later
  }))

  // Load user's virtual cards and payments
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) return
      
      try {
        const [cards, payments] = await Promise.all([
          getUserCards(),
          getUserPayments()
        ])
        
        setUserCards(cards)
        setUserPayments(payments)
        
        // Select first active card if available
        const activeCard = cards.find(card => card.isActive)
        if (activeCard) {
          setSelectedCard(activeCard)
          await loadCardBalance(activeCard.id)
        }
      } catch (err) {
        console.error('Failed to load user data:', err)
      }
    }

    loadUserData()
  }, [isAuthenticated, getUserCards, getUserPayments])

  // Load card balance
  const loadCardBalance = async (cardId: string) => {
    if (!isAuthenticated) return
    
    setIsLoadingBalance(true)
    try {
      const balance = await getCardBalance(cardId)
      setCardBalance(balance)
    } catch (err) {
      console.error('Failed to load card balance:', err)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  // Create new virtual card
  const handleCreateCard = async () => {
    if (!isAuthenticated) return
    
    setIsCreatingCard(true)
    try {
      const newCard = await createVirtualCard('GHS')
      setUserCards(prev => [...prev, newCard])
      setSelectedCard(newCard)
      await loadCardBalance(newCard.id)
    } catch (err) {
      console.error('Failed to create virtual card:', err)
    } finally {
      setIsCreatingCard(false)
    }
  }

  // Deactivate card
  const handleDeactivateCard = async () => {
    if (!selectedCard || !isAuthenticated) return
    
    try {
      const updatedCard = await deactivateCard(selectedCard.id)
      setUserCards(prev => prev.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      ))
      setSelectedCard(updatedCard)
      setIsCardFrozen(true)
    } catch (err) {
      console.error('Failed to deactivate card:', err)
    }
  }

  // Top up card
  const handleTopUpCard = async (amount: number) => {
    if (!selectedCard || !isAuthenticated) return
    
    try {
      const updatedCard = await topUpCard(selectedCard.id, amount)
      setUserCards(prev => prev.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      ))
      setSelectedCard(updatedCard)
      await loadCardBalance(updatedCard.id)
    } catch (err) {
      console.error('Failed to top up card:', err)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'shopping': return ShoppingCart
      case 'entertainment': return CreditCard
      case 'food': return Coffee
      case 'gaming': return Gamepad2
      default: return CreditCard
    }
  }

  // Animation effects
  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states
    gsap.set([headerRef.current, cardContainerRef.current, detailsRef.current, transactionsRef.current], {
      opacity: 0,
      y: 30
    })

    // Animate header
    tl.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    })

    // Animate card container with dramatic entrance
    tl.fromTo(cardRef.current, 
      { 
        opacity: 0, 
        scale: 0.8,
        rotationY: -15,
        z: -100
      },
      { 
        opacity: 1, 
        scale: 1,
        rotationY: 0,
        z: 0,
        duration: 1.2,
        ease: "back.out(1.7)" 
      }, "-=0.3"
    )

    // Animate card container
    tl.to(cardContainerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.8")

    // Animate details section
    tl.to(detailsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")

    // Animate transactions
    tl.to(transactionsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Add floating animation to card
    gsap.to(cardRef.current, {
      y: -3,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    })

    // Cleanup timeouts on unmount
    return () => {
      Object.values(revealTimeouts).forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  const handleRevealToggle = async (type: 'number' | 'expiry' | 'cvv') => {
    const isCurrentlyShown = type === 'number' ? showCardNumber : type === 'expiry' ? showExpiry : showCVV
    const elementRef = type === 'number' ? cardNumberRef : type === 'expiry' ? expiryRef : cvvRef
    const value = type === 'number' ? '4532 1234 5678 1234' : type === 'expiry' ? '12/28' : '123'
    
    if (!isCurrentlyShown) {
      // Clear any existing timeout for this type
      if (revealTimeouts[type]) {
        clearTimeout(revealTimeouts[type])
      }

      // Digital scramble animation before revealing
      if (elementRef.current) {
        const scrambleChars = '0123456789*'
        const originalText = elementRef.current.textContent || ''
        let scrambleCount = 0
        const maxScrambles = 8

        const scrambleInterval = setInterval(() => {
          if (scrambleCount < maxScrambles) {
            let scrambledText = ''
            for (let i = 0; i < originalText.length; i++) {
              if (originalText[i] === ' ' || originalText[i] === '/') {
                scrambledText += originalText[i]
              } else {
                scrambledText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
              }
            }
            elementRef.current!.textContent = scrambledText
            scrambleCount++
          } else {
            clearInterval(scrambleInterval)
            elementRef.current!.textContent = value
            
            // Set state after animation completes
            if (type === 'number') setShowCardNumber(true)
            else if (type === 'expiry') setShowExpiry(true)
            else setShowCVV(true)
          }
        }, 50)
      }

      // Auto-hide after 10 seconds
      const timeout = setTimeout(() => {
        handleHideDetail(type)
      }, 10000)

      setRevealTimeouts(prev => ({ ...prev, [type]: timeout }))
    } else {
      handleHideDetail(type)
    }
  }

  const handleHideDetail = (type: 'number' | 'expiry' | 'cvv') => {
    const elementRef = type === 'number' ? cardNumberRef : type === 'expiry' ? expiryRef : cvvRef
    const hiddenValue = type === 'number' ? '**** **** **** 1234' : type === 'expiry' ? '**/**' : '***'

    if (elementRef.current) {
      // Animate hide with scramble effect
      gsap.to(elementRef.current, {
        scale: 0.9,
        opacity: 0.7,
        duration: 0.2,
        onComplete: () => {
          elementRef.current!.textContent = hiddenValue
          gsap.to(elementRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.2
          })
        }
      })
    }

    // Clear timeout
    if (revealTimeouts[type]) {
      clearTimeout(revealTimeouts[type])
      setRevealTimeouts(prev => {
        const newTimeouts = { ...prev }
        delete newTimeouts[type]
        return newTimeouts
      })
    }

    // Set state
    if (type === 'number') setShowCardNumber(false)
    else if (type === 'expiry') setShowExpiry(false)
    else setShowCVV(false)
  }

  const handleFreezeToggle = () => {
    if (!isCardFrozen) {
      // Animate freeze overlay appearing
      gsap.set(overlayRef.current, { opacity: 0, scale: 0.8 })
      gsap.to(overlayRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      })
    } else {
      // Animate freeze overlay disappearing
      gsap.to(overlayRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3
      })
    }
    setIsCardFrozen(!isCardFrozen)
  }

  return (
    <div className="h-screen bg-gray-950 relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Blockchain grid background */}
      <div className="absolute inset-0 blockchain-grid opacity-20"></div>

      {/* Header */}
      <header 
        ref={headerRef}
        className="flex-shrink-0 flex justify-center items-center p-4 bg-gray-900/90 backdrop-blur-lg w-full relative border-b border-white/10 z-10"
      >
        <div className="absolute left-4">
          <BackButton onClick={onBack} />
        </div>
        <div className="flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-bold text-white">Virtual Card</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="text-red-400 text-sm">{error}</div>
            <button 
              onClick={clearError}
              className="text-red-300 hover:text-red-200 text-xs mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
              <div className="text-gray-300">Loading virtual cards...</div>
            </div>
          </div>
        )}

        {/* No Cards State */}
        {!isLoading && userCards.length === 0 && isAuthenticated && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Virtual Cards</h3>
              <p className="text-gray-400 mb-6">
                Create your first virtual card to start making secure online payments with ICP
              </p>
              <button
                onClick={handleCreateCard}
                disabled={isCreatingCard}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 mx-auto transition-colors"
              >
                {isCreatingCard ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span>{isCreatingCard ? 'Creating...' : 'Create Virtual Card'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Card Selection */}
        {!isLoading && userCards.length > 0 && (
          <div className="px-4 mt-4">
            <div className="max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Your Cards ({userCards.length})</h3>
                <button
                  onClick={handleCreateCard}
                  disabled={isCreatingCard}
                  className="bg-purple-600/20 hover:bg-purple-600/30 disabled:opacity-50 text-purple-400 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors"
                >
                  {isCreatingCard ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{isCreatingCard ? 'Creating...' : 'New Card'}</span>
                </button>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {userCards.map((card, index) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setSelectedCard(card)
                      loadCardBalance(card.id)
                      setIsCardFrozen(!card.isActive)
                    }}
                    className={`flex-shrink-0 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCard?.id === card.id
                        ? 'border-purple-400 bg-purple-500/10'
                        : 'border-white/10 bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="text-white text-sm font-medium">Card #{index + 1}</div>
                    <div className="text-gray-400 text-xs">
                      {card.isActive ? 'Active' : 'Inactive'} • {card.currency}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      Balance: {formatPaymentAmount(card.balance, card.currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Virtual Card Container */}
        {selectedCard && (
          <>
            <div 
              ref={cardContainerRef}
              className="flex-shrink-0 w-full max-w-xl mx-auto mt-4 lg:mt-6 flex justify-center items-center px-4"
            >
              <div className="w-full relative">
                {/* Card Balance Display */}
                <div className="text-center mb-4">
                  <div className="text-gray-400 text-sm">Available Balance</div>
                  <div className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
                    {isLoadingBalance ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>{formatPaymentAmount(BigInt(cardBalance), selectedCard.currency)}</span>
                    )}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    Card ID: {selectedCard.id.slice(0, 8)}...
                  </div>
                </div>

                {/* Virtual Card */}
                <div 
                  ref={cardRef}
                  className="w-full aspect-[16/10] rounded-xl relative overflow-hidden shadow-2xl"
                  style={{
                    background: selectedCard.isActive 
                      ? 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #059669 100%)'
                      : 'linear-gradient(135deg, #374151 0%, #6b7280 50%, #9ca3af 100%)'
                  }}
                >
                  {/* Card Background Patterns */}
                  <div className="absolute inset-0 opacity-20">
                    {/* Geometric patterns */}
                    <div className="absolute top-4 left-4 w-16 h-16 border border-white/30 rounded-full"></div>
                    <div className="absolute top-8 right-8 w-8 h-8 border border-white/30 rounded-full"></div>
                    <div className="absolute bottom-6 left-12 w-12 h-12 border border-white/30 rounded-full"></div>
                    
                    {/* Circuit-like lines */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      <line x1="50" y1="50" x2="350" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                      <line x1="80" y1="200" x2="320" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                    </svg>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  </div>

                  {/* Card Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-4 lg:p-6">
                    <div className="flex justify-between items-start">
                      <div className="text-white text-sm lg:text-base font-medium">fusionPay</div>
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-400 rounded-full flex items-center justify-center">
                        <Wallet className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                    </div>

                    <div>
                      {/* Card Number */}
                      <div className="flex items-center space-x-2 mb-3 lg:mb-4">
                        <span 
                          ref={cardNumberRef}
                          className="text-xl lg:text-3xl xl:text-4xl font-mono text-white tracking-wider"
                        >
                          **** **** **** 1234
                        </span>
                        <button 
                          onClick={() => handleRevealToggle('number')}
                          className="p-1 lg:p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                        >
                          {showCardNumber ? (
                            <EyeOff className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                          ) : (
                            <Eye className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                          )}
                        </button>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-gray-200 text-xs mb-1">CARD HOLDER</div>
                          <div className="text-white text-sm lg:text-base font-medium">FUSIONPAY USER</div>
                        </div>
                        <div className="flex space-x-3 lg:space-x-4">
                          <div>
                            <div className="text-gray-200 text-xs mb-1">EXPIRES</div>
                            <div className="flex items-center space-x-1">
                              <span 
                                ref={expiryRef}
                                className="text-white text-sm lg:text-base font-mono"
                              >
                                **/**
                              </span>
                              <button 
                                onClick={() => handleRevealToggle('expiry')}
                                className="p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                              >
                                {showExpiry ? (
                                  <EyeOff className="w-3 h-3 text-white" />
                                ) : (
                                  <Eye className="w-3 h-3 text-white" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-200 text-xs mb-1">CVV</div>
                            <div className="flex items-center space-x-1">
                              <span 
                                ref={cvvRef}
                                className="text-white text-sm lg:text-base font-mono"
                              >
                                ***
                              </span>
                              <button 
                                onClick={() => handleRevealToggle('cvv')}
                                className="p-1 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                              >
                                {showCVV ? (
                                  <EyeOff className="w-3 h-3 text-white" />
                                ) : (
                                  <Eye className="w-3 h-3 text-white" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Freeze Overlay */}
                  {isCardFrozen && (
                    <div 
                      ref={overlayRef}
                      className="absolute inset-0 bg-gray-900/80 flex items-center justify-center backdrop-blur-sm"
                    >
                      <div className="text-center">
                        <Lock className="w-12 h-12 lg:w-16 lg:h-16 text-red-500 mx-auto mb-2" />
                        <div className="text-white font-semibold text-lg">Card {selectedCard.isActive ? 'Frozen' : 'Inactive'}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Funding Source Indication */}
                <div className="text-center mt-3 lg:mt-4">
                  <span className="text-gray-300 text-sm">Funded directly from your ICP balance</span>
                </div>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
              <div className="max-w-3xl mx-auto space-y-4 lg:space-y-6">
                {/* Card Controls */}
                <div ref={detailsRef} className="space-y-4">
                  {/* Card Actions */}
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleTopUpCard(1000)} // Add 1000 GHS
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Top Up Card
                      </button>
                      <button
                        onClick={handleDeactivateCard}
                        disabled={!selectedCard.isActive}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Deactivate Card
                      </button>
                    </div>
                  </div>

                  {/* Freeze Card Toggle */}
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">Freeze Card</div>
                        <div className="text-gray-400 text-sm">Temporarily disable all transactions</div>
                      </div>
                      <button
                        onClick={handleFreezeToggle}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          isCardFrozen ? 'bg-red-500' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            isCardFrozen ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-white font-medium mb-3">Card Information</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white">{formatTimestamp(selectedCard.created)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={selectedCard.isActive ? 'text-green-400' : 'text-red-400'}>
                          {selectedCard.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Currency:</span>
                        <span className="text-white">{selectedCard.currency}</span>
                      </div>
                      {selectedCard.lastUsed && selectedCard.lastUsed.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Used:</span>
                          <span className="text-white">{formatTimestamp(selectedCard.lastUsed[0])}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Usage Instructions */}
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-white font-medium mb-2">How to Use</div>
                    <div className="text-gray-400 text-sm">
                      Use these details at online checkouts. Funds are converted from ICP instantly upon purchase.
                      Tap the eye icons to reveal card details (auto-copies to clipboard).
                    </div>
                  </div>
                </div>

                {/* Recent Card Transactions */}
                <div ref={transactionsRef}>
                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                      <h3 className="text-lg font-semibold text-white">Card Activity</h3>
                      <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
                        View All
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <div className="space-y-1">
                        {cardTransactions.map((transaction, index) => {
                          const IconComponent = getCategoryIcon(transaction.category)
                          return (
                            <div 
                              key={transaction.id}
                              className="flex justify-between items-center p-3 rounded-lg border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-medium text-white text-sm">{transaction.merchant}</div>
                                  <div className="text-xs text-gray-400">{transaction.date}</div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="font-semibold text-red-400 text-sm">
                                  -{transaction.amount}
                                </div>
                                <div className="text-xs text-gray-400">
                                  -{transaction.icpAmount}
                                </div>
                                <div className="flex items-center justify-end space-x-1 mt-1">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span className="text-xs text-green-500">Completed</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Not Authenticated State */}
        {!isAuthenticated && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-gray-400 mb-4">Please log in to manage your virtual cards</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default VirtualCardManager