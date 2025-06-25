import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Wallet, Shield, Lock, Globe } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LoginPrompt: React.FC = () => {
  const { login, isLoading } = useAuth()
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const explanationRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states
    gsap.set([
      logoRef.current, 
      titleRef.current, 
      subtitleRef.current, 
      buttonRef.current, 
      featuresRef.current, 
      explanationRef.current
    ], {
      opacity: 0,
      y: 30,
      scale: 0.9
    })

    // Animate container background
    tl.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" }
    )

    // Animate logo entrance
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)"
    })

    // Animate title
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6")

    // Animate subtitle
    tl.to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")

    // Animate features
    tl.to(featuresRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Animate button
    tl.to(buttonRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.4")

    // Animate explanation
    tl.to(explanationRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Add floating animation to logo
    gsap.to(logoRef.current, {
      y: -8,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    })

    // Add subtle glow animation to button
    gsap.to(buttonRef.current, {
      boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    })

  }, [])

  const handleButtonHover = () => {
    if (!isLoading) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const handleButtonLeave = () => {
    if (!isLoading) {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950 relative overflow-hidden px-4"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Blockchain grid background */}
      <div className="absolute inset-0 blockchain-grid opacity-10"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center">
        {/* Logo Section */}
        <div ref={logoRef} className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl icp-glow">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            fusionPay
          </h1>
        </div>

        {/* Main Title */}
        <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-white mb-4">
          Your secure gateway to Web3 payments
        </h2>

        {/* Subtitle */}
        <p ref={subtitleRef} className="text-xl text-gray-300 mb-8 max-w-lg">
          Connect with Internet Identity to access your ICP wallet and start making secure, decentralized payments.
        </p>

        {/* Feature Highlights */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
          <div className="glass-effect rounded-xl p-6 border border-white/10">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Secure</h3>
            <p className="text-gray-400 text-sm">Protected by Internet Computer's cryptographic security</p>
          </div>
          <div className="glass-effect rounded-xl p-6 border border-white/10">
            <Lock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Private</h3>
            <p className="text-gray-400 text-sm">No passwords, no personal data stored</p>
          </div>
          <div className="glass-effect rounded-xl p-6 border border-white/10">
            <Globe className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Decentralized</h3>
            <p className="text-gray-400 text-sm">Built on blockchain technology</p>
          </div>
        </div>

        {/* Connect Button */}
        <button
          ref={buttonRef}
          onClick={login}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
          disabled={isLoading}
          className={`w-auto py-4 px-12 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold text-lg rounded-xl shadow-2xl transition-all duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-blue-500/25'
          }`}
        >
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Connect Internet Identity</span>
              </>
            )}
          </div>
        </button>

        {/* Explanation */}
        <div ref={explanationRef} className="mt-8 max-w-lg">
          <div className="glass-effect rounded-lg p-4 border border-blue-500/30 bg-blue-500/10">
            <h4 className="text-blue-300 font-semibold mb-2">What is Internet Identity?</h4>
            <p className="text-blue-200 text-sm leading-relaxed">
              Internet Identity is a secure, anonymous authentication system built on the Internet Computer. 
              It uses your device's biometric authentication (fingerprint, face recognition) or security keys 
              to create a unique, cryptographic identity without storing any personal information.
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mt-6 text-gray-500 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No passwords</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Biometric secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Fully decentralized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/6 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-green-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-yellow-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  )
}

export default LoginPrompt