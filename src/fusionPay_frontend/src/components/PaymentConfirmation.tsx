import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Fingerprint, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  CreditCard,
  Zap,
  Scan
} from 'lucide-react'
import BackButton from './BackButton'

interface PaymentData {
  type: 'momo' | 'virtual-card'
  recipient: string
  amount: string
  icpAmount: string
  networkFee: string
  fusionPayFee: string
  totalFiat: string
  exchangeRate: string
  totalIcpDeduction: string
}

interface PaymentConfirmationProps {
  paymentData: PaymentData
  onBack: () => void
  onConfirm: () => void
  onCancel: () => void
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  paymentData,
  onBack,
  onConfirm,
  onCancel
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [authStep, setAuthStep] = useState<'biometric' | 'success'>('biometric')
  
  const headerRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const icpDeductionRef = useRef<HTMLDivElement>(null)
  const authPromptRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const authModalRef = useRef<HTMLDivElement>(null)
  const biometricRef = useRef<HTMLDivElement>(null)
  const disclaimerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states
    gsap.set([
      headerRef.current, 
      summaryRef.current, 
      icpDeductionRef.current, 
      disclaimerRef.current,
      authPromptRef.current,
      buttonsRef.current
    ], {
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

    // Staggered animation for summary rows
    const summaryRows = summaryRef.current?.querySelectorAll('.summary-row')
    if (summaryRows) {
      tl.fromTo(summaryRows,
        { 
          opacity: 0, 
          x: -20,
          scale: 0.95
        },
        { 
          opacity: 1, 
          x: 0,
          scale: 1,
          duration: 0.5, 
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.3"
      )
    }

    // Animate summary container
    tl.to(summaryRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.8")

    // Animate ICP deduction highlight
    tl.fromTo(icpDeductionRef.current, 
      { 
        opacity: 0, 
        scale: 0.8,
        rotationY: -15
      },
      { 
        opacity: 1, 
        scale: 1,
        rotationY: 0,
        duration: 1,
        ease: "back.out(1.7)" 
      }, "-=0.4"
    )

    // Animate disclaimer
    tl.to(disclaimerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Animate auth prompt
    tl.to(authPromptRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.2")

    // Animate buttons
    tl.to(buttonsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.3")

    // Add pulsating animation to confirm button
    gsap.to(confirmButtonRef.current, {
      boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    })

  }, [])

  const handleConfirmClick = () => {
    setShowAuthModal(true)
    
    // Animate modal entrance
    gsap.set(authModalRef.current, { opacity: 0, scale: 0.8 })
    gsap.to(authModalRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    })

    // Start biometric scanning animation
    setTimeout(() => {
      startBiometricAnimation()
    }, 500)
  }

  const startBiometricAnimation = () => {
    const tl = gsap.timeline()
    
    // Pulsating scan effect
    tl.to(biometricRef.current, {
      scale: 1.3,
      opacity: 0.6,
      filter: "brightness(1.5)",
      duration: 0.8,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 3
    })

    // Simulate successful authentication
    tl.call(() => {
      setAuthStep('success')
      setIsProcessing(true)
      
      // Success animation
      gsap.fromTo(biometricRef.current,
        { scale: 1.3, rotation: 0, filter: "brightness(1.5)" },
        { scale: 1, rotation: 360, filter: "brightness(1)", duration: 0.8, ease: "back.out(1.7)" }
      )

      // Complete payment after delay
      setTimeout(() => {
        setIsProcessing(false)
        setShowAuthModal(false)
        onConfirm()
      }, 2000)
    })
  }

  const handleModalClose = () => {
    gsap.to(authModalRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setShowAuthModal(false)
    })
  }

  const getPaymentTypeIcon = () => {
    return paymentData.type === 'momo' ? Smartphone : CreditCard
  }

  const getPaymentTypeLabel = () => {
    return paymentData.type === 'momo' ? 'Mobile Money Transfer' : 'Virtual Card Payment'
  }

  const handleButtonHover = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1.02,
      y: -2,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const handleButtonLeave = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    })
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
          <Shield className="w-6 h-6 text-green-400" />
          <h1 className="text-xl font-bold text-white">Confirm Payment</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="min-h-full flex items-center justify-center p-4">
          <div 
            className="w-full max-w-2xl mx-auto space-y-6 my-4"
          >
            {/* Security Badge */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Secured by ICP Blockchain</span>
              </div>
            </div>

            {/* Payment Summary Container */}
            <div 
              ref={summaryRef}
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden"
            >
              <div className="p-6 md:p-8">
                {/* Payment Type Header */}
                <div className="summary-row flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
                  {React.createElement(getPaymentTypeIcon(), { className: "w-6 h-6 text-blue-400" })}
                  <h2 className="text-lg font-semibold text-white">{getPaymentTypeLabel()}</h2>
                </div>

                {/* Summary Details */}
                <div className="space-y-4">
                  {/* Recipient */}
                  <div className="summary-row flex justify-between items-center">
                    <span className="text-gray-300">Recipient:</span>
                    <span className="text-white font-semibold text-right max-w-[60%] truncate">{paymentData.recipient}</span>
                  </div>

                  {/* Amount */}
                  <div className="summary-row flex justify-between items-center">
                    <span className="text-gray-300">Amount:</span>
                    <span className="text-white font-semibold text-lg">{paymentData.amount}</span>
                  </div>

                  {/* Fees Breakdown */}
                  <div className="summary-row border-t border-gray-700 pt-4">
                    <div className="text-gray-400 text-sm mb-3">Transaction Fees:</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">Network Fee:</span>
                        <span className="text-white">{paymentData.networkFee}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">fusionPay Fee:</span>
                        <span className="text-white">{paymentData.fusionPayFee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Fiat */}
                  <div className="summary-row flex justify-between items-center border-t border-gray-700 pt-4">
                    <span className="text-gray-300 font-medium">Total Charged:</span>
                    <span className="text-white font-bold text-lg">{paymentData.totalFiat}</span>
                  </div>

                  {/* Exchange Rate */}
                  <div className="summary-row bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-300 text-sm">Current Rate:</span>
                      <span className="text-blue-400 font-semibold">{paymentData.exchangeRate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ICP Deduction Highlight */}
            <div 
              ref={icpDeductionRef}
              className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl border border-blue-500/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              <div className="relative z-10 text-center p-6">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300 text-sm font-medium">Total ICP Deduction</span>
                </div>
                <div className="text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 drop-shadow-lg">
                  {paymentData.totalIcpDeduction}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div 
              ref={disclaimerRef}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
            >
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-300">
                  By confirming, you authorize the immutable on-chain deduction of your ICP for this transaction. This action cannot be reversed.
                </p>
              </div>
            </div>

            {/* Authorization Prompt */}
            <div ref={authPromptRef} className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Lock className="w-5 h-5 text-purple-400" />
                <span className="text-lg text-white font-semibold">Confirm your identity to complete payment</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div ref={buttonsRef} className="space-y-3">
              <button
                ref={confirmButtonRef}
                onClick={handleConfirmClick}
                onMouseEnter={(e) => handleButtonHover(e.currentTarget)}
                onMouseLeave={(e) => handleButtonLeave(e.currentTarget)}
                className="w-full py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-700 text-white hover:from-blue-700 hover:to-purple-800 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Fingerprint className="w-5 h-5" />
                  <span>Confirm & Pay</span>
                </div>
              </button>
              
              <button
                onClick={onCancel}
                onMouseEnter={(e) => handleButtonHover(e.currentTarget)}
                onMouseLeave={(e) => handleButtonLeave(e.currentTarget)}
                className="w-full py-3 rounded-lg font-medium text-white bg-transparent border border-gray-700 hover:bg-gray-800 transition-colors"
              >
                Cancel Payment
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={authModalRef}
            className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 max-w-sm w-full mx-4 border border-white/20 shadow-2xl relative"
          >
            {/* Close button */}
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Eye className="w-4 h-4 text-white" />
            </button>

            <div className="text-center">
              {authStep === 'biometric' ? (
                <>
                  <div 
                    ref={biometricRef}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative overflow-hidden"
                  >
                    <Fingerprint className="w-12 h-12 text-white" />
                    {/* Scanning effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent transform -translate-y-full animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Biometric Authentication</h3>
                  <p className="text-gray-300 text-sm mb-6">
                    {isProcessing ? 'Processing payment...' : 'Place your finger on the sensor or look at the camera'}
                  </p>
                  
                  {/* Scanning Animation */}
                  <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Scan className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 text-sm">Scanning in progress...</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div 
                    ref={biometricRef}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Authentication Successful</h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Payment is being processed on the ICP blockchain...
                  </p>
                  
                  {/* Processing Animation */}
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentConfirmation