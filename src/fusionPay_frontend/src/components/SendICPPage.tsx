import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowUpRight, 
  Scan, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Info
} from 'lucide-react'
import BackButton from './BackButton'

const SendICPPage: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    memo: ''
  })
  const [isFormValid, setIsFormValid] = useState(false)
  
  const headerRef = useRef<HTMLDivElement>(null)
  const formContainerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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

  }, [])

  useEffect(() => {
    // Validate form
    const isValid = formData.recipient.length > 20 && parseFloat(formData.amount) > 0
    setIsFormValid(isValid)
  }, [formData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSend = () => {
    if (isFormValid) {
      // Navigate to confirmation
      navigate('/payment-confirmation', { 
        state: { 
          formData,
          type: 'icp-transfer'
        }
      })
    }
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  const handleScanQR = () => {
    // Implement QR code scanning
    console.log('Scan QR code')
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      handleInputChange('recipient', text)
    } catch (err) {
      console.error('Failed to read clipboard:', err)
    }
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
          <ArrowUpRight className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Send ICP</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="min-h-full flex items-center justify-center p-4">
          <div 
            ref={formContainerRef}
            className="w-full max-w-lg mx-auto bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 relative my-4"
          >
          <div className="p-6 md:p-8">
            {/* Form Fields */}
            <div className="space-y-6">
              {/* Recipient Address */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Recipient ICP Address *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.recipient}
                    onChange={(e) => handleInputChange('recipient', e.target.value)}
                    placeholder="Enter ICP principal ID"
                    className="w-full p-4 pr-24 rounded-lg bg-gray-900/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm font-mono"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <button
                      onClick={handleScanQR}
                      className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                      title="Scan QR Code"
                    >
                      <Scan className="w-4 h-4 text-gray-300" />
                    </button>
                    <button
                      onClick={handlePasteFromClipboard}
                      className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                      title="Paste from Clipboard"
                    >
                      <Copy className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <Info className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Principal ID should be 63 characters long</span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Amount to Send *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00000000"
                    className="w-full p-4 pr-16 rounded-lg bg-gray-900/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-mono"
                    min="0"
                    step="0.00000001"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg font-semibold">
                    ICP
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">Available Balance:</span>
                  <span className="text-blue-400 font-semibold">15.42 ICP</span>
                </div>
              </div>

              {/* Memo (Optional) */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Memo (Optional)
                </label>
                <input
                  type="text"
                  value={formData.memo}
                  onChange={(e) => handleInputChange('memo', e.target.value)}
                  placeholder="Add a note for this transaction"
                  className="w-full p-4 rounded-lg bg-gray-900/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Transaction Fee Info */}
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-300">Network Fee:</span>
                <span className="text-blue-400 font-semibold">0.0001 ICP</span>
              </div>
              <div className="text-xs text-blue-200 mt-1">
                Standard ICP network transaction fee
              </div>
            </div>

            {/* Send Button */}
            <button
              ref={buttonRef}
              onClick={handleSend}
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
            {!isFormValid && (formData.recipient || formData.amount) && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-300 text-sm">
                    <div className="font-medium mb-1">Please complete:</div>
                    <ul className="text-xs space-y-1">
                      {formData.recipient.length <= 20 && (
                        <li>• Valid ICP principal ID (63 characters)</li>
                      )}
                      {!formData.amount || parseFloat(formData.amount) <= 0 && (
                        <li>• Amount greater than 0</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

export default SendICPPage