import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { 
  Download, 
  Copy, 
  QrCode, 
  CheckCircle, 
  Share,
  Wallet
} from 'lucide-react'
import BackButton from './BackButton'
import { useAuth } from '../contexts/AuthContext'

const ReceivePage: React.FC = () => {
  const navigate = useNavigate()
  const { principal } = useAuth()
  const [copied, setCopied] = useState(false)
  
  const headerRef = useRef<HTMLDivElement>(null)
  const qrContainerRef = useRef<HTMLDivElement>(null)
  const addressContainerRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)

  // Mock principal for demo (replace with actual principal)
  const receivingAddress = principal || 'rdmx6-jaaaa-aaaaa-aaadq-cai-example-principal-id-for-demo'

  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states
    gsap.set([headerRef.current, qrContainerRef.current, addressContainerRef.current, actionsRef.current], {
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

    // Animate QR container
    tl.to(qrContainerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.3")

    // Animate address container
    tl.to(addressContainerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")

    // Animate actions
    tl.to(actionsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

  }, [])

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(receivingAddress)
      setCopied(true)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
      
      // Animate copy feedback
      gsap.fromTo(addressContainerRef.current?.querySelector('.copy-feedback'),
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
      )
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My ICP Address',
          text: 'Send ICP to this address:',
          url: receivingAddress
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      // Fallback to copy
      handleCopyAddress()
    }
  }

  const handleBack = () => {
    navigate('/dashboard')
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
          <Download className="w-6 h-6 text-green-400" />
          <h1 className="text-xl font-bold text-white">Receive ICP</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto space-y-6">
            
            {/* QR Code Container */}
            <div 
              ref={qrContainerRef}
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Your ICP Address</h2>
                <p className="text-gray-400 text-sm">Share this address to receive ICP payments</p>
              </div>
              
              {/* QR Code Placeholder */}
              <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 mb-6 relative">
                <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 text-xs">
                Scan this QR code to get the address
              </p>
            </div>

            {/* Address Container */}
            <div 
              ref={addressContainerRef}
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  ICP Principal ID
                </label>
                <div className="relative">
                  <div className="w-full p-4 bg-gray-900/80 text-white border border-gray-700 rounded-lg font-mono text-sm break-all">
                    {receivingAddress}
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                    title="Copy Address"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
                
                {copied && (
                  <div className="copy-feedback text-green-400 text-xs font-medium mt-2">
                    ✓ Address copied to clipboard
                  </div>
                )}
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="text-blue-300 text-xs font-medium mb-1">Important:</div>
                <p className="text-blue-200 text-xs leading-relaxed">
                  Only send ICP tokens to this address. Sending other tokens may result in permanent loss.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div ref={actionsRef} className="space-y-3">
              <button
                onClick={handleCopyAddress}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold text-lg transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Copy className="w-5 h-5" />
                  <span>Copy Address</span>
                </div>
              </button>
              
              <button
                onClick={handleShare}
                className="w-full py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Share className="w-4 h-4" />
                  <span>Share Address</span>
                </div>
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/5">
              <h3 className="text-white font-medium mb-2 text-sm">How to receive ICP:</h3>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Share your address or QR code with the sender</li>
                <li>• Wait for the transaction to be confirmed on the network</li>
                <li>• Your balance will update automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ReceivePage