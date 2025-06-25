import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Smartphone, 
  RefreshCw, 
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import BackButton from './BackButton'

interface MoMoFormData {
  recipientNumber: string
  network: string
  amount: string
  recipientName: string
  purpose: string
  icpDeduction: string
  exchangeRate: string
}

const MoMoPaymentForm: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    recipientNumber: '',
    network: '',
    amount: '',
    recipientName: '',
    purpose: ''
  })
  
  const [icpDeduction, setIcpDeduction] = useState('0.000')
  const [exchangeRate] = useState('238.50')
  const [isFormValid, setIsFormValid] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  
  const headerRef = useRef<HTMLDivElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)
  const inputRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([])
  const conversionRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const icpValueRef = useRef<HTMLSpanElement>(null)

  const networks = [
    { value: '', label: 'Select Network' },
    { value: 'mtn', label: 'MTN Mobile Money' },
    { value: 'vodafone', label: 'Vodafone Cash' },
    { value: 'airteltigo', label: 'AirtelTigo Money' }
  ]

  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states
    gsap.set([headerRef.current, formContainerRef.current], {
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

    // Animate form container
    tl.to(formContainerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.3")

    // Staggered animation for form elements
    const formElements = inputRefs.current.filter(Boolean)
    if (formElements.length > 0) {
      gsap.fromTo(formElements,
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
          ease: "power2.out",
          delay: 0.3
        }
      )
    }

    // Animate conversion display
    tl.fromTo(conversionRef.current,
      { 
        opacity: 0, 
        y: 20,
        scale: 0.9
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.6, 
        ease: "back.out(1.7)" 
      }, "-=0.2"
    )

    // Animate button
    tl.fromTo(buttonRef.current,
      { 
        opacity: 0, 
        y: 20 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: "power2.out" 
      }, "-=0.3"
    )

  }, [])

  useEffect(() => {
    // Validate form
    const isValid = formData.recipientNumber.length >= 10 && 
                   formData.network && 
                   parseFloat(formData.amount) > 0

    setIsFormValid(isValid)

    // Calculate ICP deduction
    if (formData.amount && parseFloat(formData.amount) > 0) {
      setIsCalculating(true)
      
      // Simulate calculation delay
      const timer = setTimeout(() => {
        const ghsAmount = parseFloat(formData.amount)
        const rate = parseFloat(exchangeRate)
        const icpAmount = (ghsAmount / rate).toFixed(6)
        
        // Add fees (network fee + fusionPay fee)
        const networkFee = 0.0001 // 0.0001 ICP
        const fusionPayFee = parseFloat(icpAmount) * 0.001 // 0.1%
        const totalIcp = (parseFloat(icpAmount) + networkFee + fusionPayFee).toFixed(6)
        
        setIcpDeduction(totalIcp)
        setIsCalculating(false)

        // Animate ICP value update
        if (icpValueRef.current) {
          gsap.fromTo(icpValueRef.current,
            { 
              scale: 1.2, 
              color: '#3B82F6',
              filter: 'brightness(1.3)'
            },
            { 
              scale: 1, 
              color: '#FFFFFF',
              filter: 'brightness(1)',
              duration: 0.5, 
              ease: "back.out(1.7)" 
            }
          )
        }
      }, 800)

      return () => clearTimeout(timer)
    } else {
      setIcpDeduction('0.000')
    }
  }, [formData.amount, formData.network, formData.recipientNumber, exchangeRate])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContinue = () => {
    if (isFormValid) {
      // Add button click animation
      gsap.to(buttonRef.current, {
        scale: 0.98,
        duration: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(buttonRef.current, {
            scale: 1,
            duration: 0.1,
            ease: "power2.out",
            onComplete: () => {
              // Navigate to confirmation with form data
              navigate('/payment-confirmation', { 
                state: { 
                  formData: {
                    ...formData,
                    icpDeduction,
                    exchangeRate
                  }
                }
              })
            }
          })
        }
      })
    }
  }

  const handleButtonHover = () => {
    if (isFormValid) {
      gsap.to(buttonRef.current, {
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const handleButtonLeave = () => {
    if (isFormValid) {
      gsap.to(buttonRef.current, {
        scale: 1,
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as XXX XXX XXXX
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    if (formatted.replace(/\s/g, '').length <= 10) {
      handleInputChange('recipientNumber', formatted)
    }
  }

  const handleBack = () => {
    navigate('/pay-now')
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
          <BackButton onClick={handleBack} />
        </div>
        <div className="flex items-center space-x-3">
          <Smartphone className="w-6 h-6 text-green-400" />
          <h1 className="text-xl font-bold text-white">Pay Mobile Money</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div 
          ref={formContainerRef}
          className="w-full max-w-lg mx-auto bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 relative"
        >
          <div className="p-6 md:p-8">
            {/* Form Fields */}
            <div className="space-y-6">
              {/* Recipient Mobile Number */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Recipient Mobile Number *
                </label>
                <div className="relative">
                  <input
                    ref={el => inputRefs.current[0] = el}
                    type="tel"
                    value={formData.recipientNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="024 123 4567"
                    className="w-full p-4 rounded-lg bg-gray-900/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-mono"
                    inputMode="numeric"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {formData.recipientNumber.replace(/\s/g, '').length === 10 && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Money Network */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Mobile Money Network *
                </label>
                <select
                  ref={el => inputRefs.current[1] = el}
                  value={formData.network}
                  onChange={(e) => handleInputChange('network', e.target.value)}
                  className="w-full p-4 rounded-lg bg-gray-900/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg appearance-none cursor-pointer"
                >
                  {networks.map((network) => (
                    <option key={network.value} value={network.value} className="bg-gray-900">
                      {network.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount to Send */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Amount to Send *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-semibold">
                    GHS
                  </div>
                  <input
                    ref={el => inputRefs.current[2] = el}
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                    className="w-full p-4 pl-16 rounded-lg bg-gray-900/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-mono"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Recipient Name (Optional) */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Recipient Name (Optional)
                </label>
                <input
                  ref={el => inputRefs.current[3] = el}
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-4 rounded-lg bg-gray-900/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="flex items-center space-x-1 mt-1">
                  <Info className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">For your reference only</span>
                </div>
              </div>

              {/* Purpose/Description (Optional) */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Purpose/Description (Optional)
                </label>
                <input
                  ref={el => inputRefs.current[4] = el}
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="Payment for services"
                  className="w-full p-4 rounded-lg bg-gray-900/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Dynamic Conversion Display */}
            <div 
              ref={conversionRef}
              className="mt-8 p-6 bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-xl border border-white/10 backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300 font-medium">Approx. ICP Deduction:</span>
                <div className="flex items-center space-x-2">
                  {isCalculating && (
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                  )}
                  <span 
                    ref={icpValueRef}
                    className="text-2xl font-bold text-white font-mono"
                  >
                    ~{icpDeduction} ICP
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Exchange Rate:</span>
                <span className="text-blue-400 font-semibold">1 ICP = {exchangeRate} GHS</span>
              </div>

              {formData.amount && parseFloat(formData.amount) > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Base amount:</span>
                      <span>~{((parseFloat(formData.amount) || 0) / parseFloat(exchangeRate)).toFixed(6)} ICP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network fee:</span>
                      <span>0.0001 ICP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>fusionPay fee (0.1%):</span>
                      <span>~{(((parseFloat(formData.amount) || 0) / parseFloat(exchangeRate)) * 0.001).toFixed(6)} ICP</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Continue Button */}
            <button
              ref={buttonRef}
              onClick={handleContinue}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
              disabled={!isFormValid}
              className={`w-full py-4 rounded-lg font-bold text-lg mt-8 transition-all duration-300 ${
                isFormValid
                  ? 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-lg'
                  : 'bg-gray-700 cursor-not-allowed text-gray-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {!isFormValid && <AlertCircle className="w-5 h-5" />}
                <span>
                  {isFormValid ? 'Continue to Confirmation' : 'Complete Required Fields'}
                </span>
              </div>
            </button>

            {/* Form Validation Info */}
            {!isFormValid && (formData.recipientNumber || formData.network || formData.amount) && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-300 text-sm">
                    <div className="font-medium mb-1">Please complete:</div>
                    <ul className="text-xs space-y-1">
                      {formData.recipientNumber.replace(/\s/g, '').length < 10 && (
                        <li>• Valid 10-digit mobile number</li>
                      )}
                      {!formData.network && <li>• Select mobile money network</li>}
                      {!formData.amount || parseFloat(formData.amount) <= 0 && (
                        <li>• Enter amount greater than 0</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default MoMoPaymentForm