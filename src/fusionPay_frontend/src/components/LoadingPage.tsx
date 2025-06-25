import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { Wallet } from 'lucide-react'

interface LoadingPageProps {
  message?: string
}

const LoadingPage: React.FC<LoadingPageProps> = ({ 
  message = 'Connecting to Internet Identity...' 
}) => {
  const logoRef = useRef<HTMLDivElement>(null)
  const spinnerRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states
    gsap.set([logoRef.current, spinnerRef.current, messageRef.current], {
      opacity: 0,
      scale: 0.8,
      y: 20
    })

    // Animate container background
    tl.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    )

    // Animate logo entrance
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    })

    // Animate spinner entrance
    tl.to(spinnerRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")

    // Animate message entrance
    tl.to(messageRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Continuous spinner rotation
    gsap.to(spinnerRef.current, {
      rotation: 360,
      duration: 1.5,
      ease: "none",
      repeat: -1
    })

    // Add subtle pulsing animation to logo
    gsap.to(logoRef.current, {
      filter: "brightness(1.1)",
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    })

    // Floating animation for the entire content
    gsap.to([logoRef.current, spinnerRef.current, messageRef.current], {
      y: -5,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.2
    })

  }, [])

  // Update message with fade animation when prop changes
  useEffect(() => {
    if (messageRef.current) {
      gsap.fromTo(messageRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      )
    }
  }, [message])

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-950 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Blockchain grid background */}
      <div className="absolute inset-0 blockchain-grid opacity-10"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Section */}
        <div ref={logoRef} className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            fusionPay
          </h1>
        </div>

        {/* Loading Spinner */}
        <div ref={spinnerRef} className="relative mb-6">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"></div>
          {/* Additional decorative rings */}
          <div className="absolute inset-0 w-12 h-12 border-2 border-purple-500/20 border-b-purple-500/50 rounded-full animate-pulse"></div>
          <div className="absolute -inset-2 w-16 h-16 border border-green-500/10 border-r-green-500/30 rounded-full"></div>
        </div>

        {/* Loading Message */}
        <p ref={messageRef} className="text-lg text-gray-300 text-center max-w-md px-4">
          {message}
        </p>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 text-center mt-2 max-w-md px-4">
          Powered by Internet Computer Protocol
        </p>

        {/* Connection Status Indicators */}
        <div className="flex items-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-green-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-0.5 h-0.5 bg-yellow-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  )
}

export default LoadingPage