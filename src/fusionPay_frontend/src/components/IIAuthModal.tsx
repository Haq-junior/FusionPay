import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { X, Shield, Loader, AlertCircle, Fingerprint, Smartphone } from 'lucide-react'

interface IIAuthModalProps {
  isOpen: boolean
  onCancel: () => void
  status: 'redirecting' | 'authenticating' | 'verifying' | 'error'
  errorMessage?: string
}

const IIAuthModal: React.FC<IIAuthModalProps> = ({ 
  isOpen, 
  onCancel, 
  status, 
  errorMessage 
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const spinnerRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Set initial states
      gsap.set([overlayRef.current, modalRef.current], {
        opacity: 0
      })
      gsap.set(modalRef.current, {
        scale: 0.8,
        y: 50
      })

      const tl = gsap.timeline()

      // Animate overlay
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })

      // Animate modal
      tl.to(modalRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.2")

      // Animate content
      tl.fromTo([logoRef.current, messageRef.current, stepsRef.current],
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          stagger: 0.1,
          ease: "power2.out" 
        }, "-=0.3"
      )

      // Start spinner animation if not error
      if (status !== 'error') {
        gsap.to(spinnerRef.current, {
          rotation: 360,
          duration: 1.5,
          ease: "none",
          repeat: -1
        })
      }
    }
  }, [isOpen, status])

  const handleClose = () => {
    const tl = gsap.timeline()
    
    tl.to(modalRef.current, {
      opacity: 0,
      scale: 0.8,
      y: 50,
      duration: 0.3,
      ease: "power2.in"
    })
    
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: onCancel
    }, "-=0.1")
  }

  const getStatusContent = () => {
    switch (status) {
      case 'redirecting':
        return {
          icon: <Loader className="w-8 h-8 text-blue-500" />,
          title: 'Redirecting to Internet Identity...',
          description: 'Opening secure authentication window',
          color: 'text-blue-400'
        }
      case 'authenticating':
        return {
          icon: <Fingerprint className="w-8 h-8 text-purple-500" />,
          title: 'Authenticating...',
          description: 'Please complete authentication in the Internet Identity window',
          color: 'text-purple-400'
        }
      case 'verifying':
        return {
          icon: <Shield className="w-8 h-8 text-green-500" />,
          title: 'Verifying identity...',
          description: 'Confirming your authentication with the Internet Computer',
          color: 'text-green-400'
        }
      case 'error':
        return {
          icon: <AlertCircle className="w-8 h-8 text-red-500" />,
          title: 'Authentication Failed',
          description: errorMessage || 'An error occurred during authentication',
          color: 'text-red-400'
        }
      default:
        return {
          icon: <Loader className="w-8 h-8 text-blue-500" />,
          title: 'Connecting...',
          description: 'Establishing connection',
          color: 'text-blue-400'
        }
    }
  }

  const statusContent = getStatusContent()

  if (!isOpen) return null

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div 
        ref={modalRef}
        className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20 relative"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Logo */}
        <div ref={logoRef} className="flex justify-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              fusionPay
            </h2>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex justify-center mb-6">
          <div ref={spinnerRef} className="relative">
            {statusContent.icon}
            {status !== 'error' && (
              <div className="absolute inset-0 border-2 border-transparent border-t-current rounded-full opacity-30"></div>
            )}
          </div>
        </div>

        {/* Status Message */}
        <div ref={messageRef} className="text-center mb-6">
          <h3 className={`text-xl font-semibold mb-2 ${statusContent.color}`}>
            {statusContent.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {statusContent.description}
          </p>
        </div>

        {/* Authentication Steps */}
        {status !== 'error' && (
          <div ref={stepsRef} className="space-y-3 mb-6">
            <div className="glass-effect rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'redirecting' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
                }`}></div>
                <span className="text-sm text-gray-300">Opening Internet Identity</span>
              </div>
            </div>
            
            <div className="glass-effect rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'authenticating' ? 'bg-purple-500 animate-pulse' : 
                  ['verifying'].includes(status) ? 'bg-green-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-sm text-gray-300">Biometric authentication</span>
              </div>
            </div>
            
            <div className="glass-effect rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'verifying' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                }`}></div>
                <span className="text-sm text-gray-300">Verifying identity</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <Smartphone className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-300 text-sm font-medium mb-1">
                {status === 'error' ? 'Troubleshooting' : 'Instructions'}
              </p>
              <p className="text-blue-200 text-xs leading-relaxed">
                {status === 'error' 
                  ? 'Please try again or check if your browser allows pop-ups for this site.'
                  : 'Use your device\'s biometric authentication (fingerprint, face recognition) or security key when prompted.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {status === 'error' ? (
            <>
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="w-full py-3 px-4 bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 font-semibold rounded-lg transition-colors"
            >
              Cancel Authentication
            </button>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs">
            🔒 Secured by Internet Computer Protocol
          </p>
        </div>
      </div>
    </div>
  )
}

export default IIAuthModal