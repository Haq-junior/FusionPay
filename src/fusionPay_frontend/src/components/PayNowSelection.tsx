import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { 
  Smartphone, 
  CreditCard, 
  Building2,
  ArrowRight,
  Zap,
  Shield,
  Clock
} from 'lucide-react'
import BackButton from './BackButton'

interface PaymentMethod {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  features: string[]
  estimatedTime: string
  path: string
}

const PayNowSelection: React.FC = () => {
  const navigate = useNavigate()
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'momo',
      title: 'Mobile Money (MoMo) Transfer',
      description: 'Send money directly to MTN, Vodafone, or AirtelTigo mobile wallets',
      icon: Smartphone,
      color: 'from-green-500 to-emerald-600',
      features: ['Instant transfer', 'All networks supported', 'SMS confirmation'],
      estimatedTime: '< 1 minute',
      path: '/pay-momo'
    },
    {
      id: 'virtual-card',
      title: 'Virtual Card (Online Payments)',
      description: 'Use your ICP balance for online purchases and subscriptions',
      icon: CreditCard,
      color: 'from-blue-500 to-purple-600',
      features: ['Global acceptance', 'Instant conversion', 'Secure payments'],
      estimatedTime: 'Instant',
      path: '/virtual-card'
    },
    {
      id: 'bank-transfer',
      title: 'Bank Transfer',
      description: 'Transfer funds directly to any Ghanaian bank account',
      icon: Building2,
      color: 'from-orange-500 to-red-600',
      features: ['All banks supported', 'Secure transfer', 'Transaction receipt'],
      estimatedTime: '2-5 minutes',
      path: '/payments'
    }
  ]

  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states
    gsap.set([headerRef.current, cardsContainerRef.current], {
      opacity: 0,
      y: 30
    })

    gsap.set(backgroundRef.current, {
      opacity: 0
    })

    // Animate background
    tl.to(backgroundRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    })

    // Animate header
    tl.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")

    // Animate cards container
    tl.to(cardsContainerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.3")

    // Staggered animation for payment method cards
    const cards = cardsContainerRef.current?.children
    if (cards) {
      gsap.fromTo(Array.from(cards),
        { 
          opacity: 0, 
          y: 40,
          scale: 0.9
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.6, 
          stagger: 0.15,
          ease: "back.out(1.7)"
        }
      )
    }

  }, [])

  const handleCardHover = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1.02,
      y: -8,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      duration: 0.3,
      ease: "power2.out"
    })

    // Animate the icon
    const icon = element.querySelector('.payment-icon')
    if (icon) {
      gsap.to(icon, {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    // Animate the arrow
    const arrow = element.querySelector('.payment-arrow')
    if (arrow) {
      gsap.to(arrow, {
        x: 8,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const handleCardLeave = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1,
      y: 0,
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
      duration: 0.3,
      ease: "power2.out"
    })

    // Reset icon
    const icon = element.querySelector('.payment-icon')
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    // Reset arrow
    const arrow = element.querySelector('.payment-arrow')
    if (arrow) {
      gsap.to(arrow, {
        x: 0,
        opacity: 0.7,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const handleCardClick = (method: PaymentMethod) => {
    // Add click animation
    const card = document.getElementById(`card-${method.id}`)
    if (card) {
      gsap.to(card, {
        scale: 0.98,
        duration: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(card, {
            scale: 1.02,
            duration: 0.1,
            ease: "power2.out",
            onComplete: () => navigate(method.path)
          })
        }
      })
    }
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  return (
    <div className="h-screen bg-gray-950 relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        {/* Blockchain grid background */}
        <div className="absolute inset-0 blockchain-grid opacity-20"></div>
      </div>

      {/* Header */}
      <header 
        ref={headerRef}
        className="flex-shrink-0 flex justify-center items-center p-4 bg-gray-900/90 backdrop-blur-lg w-full relative border-b border-white/10 z-10"
      >
        <div className="absolute left-4">
          <BackButton onClick={handleBack} />
        </div>
        <h1 className="text-2xl font-bold text-white">Pay Now</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-center">
          {/* Payment Method Cards Container */}
          <div 
            ref={cardsContainerRef}
            className="flex flex-col lg:grid lg:grid-cols-3 items-center gap-6 lg:gap-8 w-full max-w-5xl"
          >
            {paymentMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <div
                  key={method.id}
                  id={`card-${method.id}`}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-700/80 border border-white/10 w-full max-w-sm lg:max-w-none group relative overflow-hidden"
                  onMouseEnter={(e) => handleCardHover(e.currentTarget)}
                  onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
                  onClick={() => handleCardClick(method)}
                >
                  {/* Card Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Card Content */}
                  <div className="relative z-10">
                    {/* Icon and Arrow */}
                    <div className="flex justify-between items-start mb-6">
                      <div className={`payment-icon p-4 rounded-2xl bg-gradient-to-br ${method.color} shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="payment-arrow opacity-70 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                        {method.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {method.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {method.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${method.color}`}></div>
                          <span className="text-gray-400 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Estimated Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500 text-sm">Est. time:</span>
                      </div>
                      <span className={`text-sm font-semibold bg-gradient-to-r ${method.color} bg-clip-text text-transparent`}>
                        {method.estimatedTime}
                      </span>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-xs font-medium">Secured by ICP Blockchain</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Bottom Info */}
      <div className="flex-shrink-0 p-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>All payments are processed instantly on the ICP blockchain</span>
        </div>
      </div>
    </div>
  )
}

export default PayNowSelection