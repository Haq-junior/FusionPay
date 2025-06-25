import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { 
  X, 
  CheckCircle, 
  Loader, 
  Copy, 
  ExternalLink,
  Eye,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Smartphone,
  CreditCard,
  AlertCircle
} from 'lucide-react'

interface PaymentStatusData {
  status: 'success' | 'processing'
  type: 'momo' | 'virtual-card'
  amount: string
  recipient: string
  icpDeducted: string
  referenceId: string
  timestamp: string
}

interface PaymentStatusProps {
  paymentData: PaymentStatusData
  onDismiss: () => void
  onViewDetails: () => void
  onMakeAnother: () => void
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  paymentData,
  onDismiss,
  onViewDetails,
  onMakeAnother
}) => {
  const [copied, setCopied] = useState(false)
  
  const backgroundRef = useRef<HTMLDivElement>(null)
  const statusIconRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const referenceRef = useRef<HTMLDivElement>(null)
  const nextStepsRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const connectingNodesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states
    gsap.set([
      statusIconRef.current,
      messageRef.current,
      summaryRef.current,
      referenceRef.current,
      nextStepsRef.current,
      buttonsRef.current
    ], {
      opacity: 0,
      y: 30
    })

    // Animate background transition
    tl.fromTo(backgroundRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    )

    // Animate status icon with dramatic entrance
    tl.fromTo(statusIconRef.current, 
      { 
        opacity: 0, 
        scale: 0.3,
        rotation: paymentData.status === 'success' ? -180 : 0
      },
      { 
        opacity: 1, 
        scale: 1,
        rotation: 0,
        duration: 1.2, 
        ease: "back.out(2)" 
      }
    )

    // Staggered animation for content sections
    const contentSections = [
      messageRef.current,
      summaryRef.current,
      referenceRef.current,
      nextStepsRef.current,
      buttonsRef.current
    ]

    tl.to(contentSections, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out"
    }, "-=0.6")

    // Add continuous animations based on status
    if (paymentData.status === 'success') {
      // Success glow animation
      gsap.to(statusIconRef.current, {
        filter: "drop-shadow(0 0 30px rgba(34, 197, 94, 0.8))",
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      })
    } else {
      // Processing rotation animation
      gsap.to(statusIconRef.current?.querySelector('.spinner'), {
        rotation: 360,
        duration: 2,
        ease: "none",
        repeat: -1
      })

      // Connecting nodes animation
      gsap.to(".connection-node", {
        scale: 1.3,
        opacity: 0.6,
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.3,
        yoyo: true,
        repeat: -1
      })

      // Scanning lines animation
      gsap.to(".scan-line", {
        x: "100%",
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
      })
    }

  }, [paymentData.status])

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.referenceId)
      setCopied(true)
      
      // Animate copy feedback
      gsap.fromTo(referenceRef.current?.querySelector('.copy-feedback'),
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
      )
      
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleButtonHover = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1.02,
      y: -2,
      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const handleButtonLeave = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const getStatusIcon = () => {
    if (paymentData.status === 'success') {
      return (
        <div className="relative">
          <CheckCircle className="w-20 h-20 lg:w-32 lg:h-32 text-green-500" />
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
        </div>
      )
    } else {
      return (
        <div className="relative">
          <div className="spinner">
            <Loader className="w-20 h-20 lg:w-32 lg:h-32 text-blue-500" />
          </div>
          
          {/* Connecting nodes animation */}
          <div 
            ref={connectingNodesRef}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="connection-node w-2 h-2 bg-blue-400 rounded-full absolute -top-6 left-1/2 transform -translate-x-1/2"></div>
            <div className="connection-node w-2 h-2 bg-purple-400 rounded-full absolute top-1/2 -right-6 transform -translate-y-1/2"></div>
            <div className="connection-node w-2 h-2 bg-green-400 rounded-full absolute -bottom-6 left-1/2 transform -translate-x-1/2"></div>
            <div className="connection-node w-2 h-2 bg-yellow-400 rounded-full absolute top-1/2 -left-6 transform -translate-y-1/2"></div>
          </div>
          
          {/* Scanning lines */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="scan-line absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-60"></div>
          </div>
          
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
        </div>
      )
    }
  }

  const getStatusMessage = () => {
    if (paymentData.status === 'success') {
      return {
        title: 'Payment Initiated Successfully!',
        subtitle: 'Your transaction has been committed to the ICP blockchain',
        color: 'text-green-400'
      }
    } else {
      return {
        title: 'Your payment is being processed...',
        subtitle: 'Confirming transaction on the ICP network',
        color: 'text-blue-400'
      }
    }
  }

  const getNextStepsMessage = () => {
    if (paymentData.type === 'momo') {
      return 'Recipient will receive an SMS confirmation shortly.'
    } else {
      return 'Transaction status can be tracked in your transaction history.'
    }
  }

  const getPaymentTypeIcon = () => {
    return paymentData.type === 'momo' ? Smartphone : CreditCard
  }

  const statusMessage = getStatusMessage()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0"
        style={{
          background: paymentData.status === 'success' 
            ? 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.15) 0%, rgba(15, 23, 42, 1) 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, rgba(15, 23, 42, 1) 70%)'
        }}
      ></div>

      {/* Blockchain grid background */}
      <div className="absolute inset-0 blockchain-grid opacity-10"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-green-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-yellow-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Header */}
      <header className="absolute top-4 right-4 z-10">
        <button 
          onClick={onDismiss}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </header>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-screen space-y-6 lg:space-y-8">
        
        {/* Status Indicator */}
        <div ref={statusIconRef} className="flex justify-center">
          {getStatusIcon()}
        </div>

        {/* Status Message */}
        <div ref={messageRef} className="text-center">
          <h1 className={`text-2xl lg:text-3xl font-bold mb-3 ${statusMessage.color}`}>
            {statusMessage.title}
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            {statusMessage.subtitle}
          </p>
        </div>

        {/* Payment Summary */}
        <div 
          ref={summaryRef}
          className="w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl"
        >
          <div className="flex items-center space-x-3 mb-4">
            {React.createElement(getPaymentTypeIcon(), { className: "w-5 h-5 text-blue-400" })}
            <span className="text-gray-300 text-sm font-medium">Payment Summary</span>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg text-gray-200 mb-1">You paid</div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-2">{paymentData.amount}</div>
              <div className="text-sm text-gray-400">to {paymentData.recipient}</div>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">ICP Deducted:</span>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold font-mono">{paymentData.icpDeducted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Reference */}
        <div 
          ref={referenceRef}
          className="w-full bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm font-medium">Transaction Reference</span>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs font-medium">On-Chain</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <code className="text-white font-mono text-sm bg-gray-900/50 px-3 py-2 rounded flex-1 mr-3 truncate">
              {paymentData.referenceId}
            </code>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={handleCopyReference}
                className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button 
                className="text-purple-400 hover:text-purple-300 transition-colors p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20"
                title="View on blockchain"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {copied && (
            <div className="copy-feedback text-green-400 text-xs font-medium">
              ✓ Copied to clipboard
            </div>
          )}
          
          <div className="flex items-center space-x-1 mt-2">
            <Eye className="w-3 h-3 text-gray-500" />
            <span className="text-gray-500 text-xs">View On-Chain Explorer</span>
          </div>
        </div>

        {/* Next Steps */}
        <div 
          ref={nextStepsRef}
          className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-blue-300 text-sm font-medium mb-1">Next Steps</div>
              <p className="text-blue-200 text-sm leading-relaxed">
                {getNextStepsMessage()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div ref={buttonsRef} className="w-full space-y-3">
          <button
            onClick={onViewDetails}
            onMouseEnter={(e) => handleButtonHover(e.currentTarget)}
            onMouseLeave={(e) => handleButtonLeave(e.currentTarget)}
            className="w-full py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>View Details</span>
            </div>
          </button>
          
          <button
            onClick={onMakeAnother}
            onMouseEnter={(e) => handleButtonHover(e.currentTarget)}
            onMouseLeave={(e) => handleButtonLeave(e.currentTarget)}
            className="w-full py-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg transition-all duration-300"
          >
            <div className="flex items-center justify-center space-x-2">
              <ArrowRight className="w-5 h-5" />
              <span>Make Another Payment</span>
            </div>
          </button>
        </div>

        {/* Timestamp */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            {paymentData.timestamp}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentStatus