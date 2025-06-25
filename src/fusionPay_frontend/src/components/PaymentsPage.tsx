import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ArrowUpRight, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import BackButton from './BackButton'

interface Payment {
  id: string
  type: 'momo' | 'bank' | 'virtual-card'
  recipient: string
  amount: string
  icpAmount: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  reference: string
}

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate()
  const headerRef = useRef<HTMLDivElement>(null)
  const quickActionsRef = useRef<HTMLDivElement>(null)
  const paymentsListRef = useRef<HTMLDivElement>(null)

  const recentPayments: Payment[] = [
    {
      id: '1',
      type: 'momo',
      recipient: 'MTN Mobile Money - 024 123 4567',
      amount: 'GHS 250.00',
      icpAmount: '1.05 ICP',
      status: 'completed',
      date: '2 hours ago',
      reference: 'FP-MM-001234'
    },
    {
      id: '2',
      type: 'virtual-card',
      recipient: 'Amazon Online Store',
      amount: 'GHS 125.50',
      icpAmount: '0.52 ICP',
      status: 'completed',
      date: 'Yesterday',
      reference: 'FP-VC-001235'
    },
    {
      id: '3',
      type: 'bank',
      recipient: 'GCB Bank - John Doe',
      amount: 'GHS 500.00',
      icpAmount: '2.10 ICP',
      status: 'pending',
      date: '2 days ago',
      reference: 'FP-BT-001236'
    }
  ]

  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states
    gsap.set([headerRef.current, quickActionsRef.current, paymentsListRef.current], {
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

    // Animate quick actions
    tl.to(quickActionsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Animate payments list
    tl.to(paymentsListRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Staggered animation for payment items
    const paymentItems = paymentsListRef.current?.querySelectorAll('.payment-item')
    if (paymentItems) {
      gsap.fromTo(paymentItems,
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.5, 
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3
        }
      )
    }

  }, [])

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'momo': return Smartphone
      case 'bank': return Building2
      case 'virtual-card': return CreditCard
      default: return CreditCard
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500'
      case 'pending': return 'text-yellow-500'
      case 'failed': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  const handleNewPayment = () => {
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
          <CreditCard className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Payments</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
          
          {/* Quick Actions */}
          <div ref={quickActionsRef} className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleNewPayment}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 rounded-lg transition-all duration-300 group"
              >
                <Plus className="w-5 h-5 text-white" />
                <span className="text-white font-medium">New Payment</span>
                <ArrowUpRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button
                onClick={() => navigate('/send-icp')}
                className="flex items-center space-x-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 group"
              >
                <ArrowUpRight className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300 font-medium">Send ICP</span>
              </button>
              
              <button
                onClick={() => navigate('/receive')}
                className="flex items-center space-x-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 group"
              >
                <ArrowUpRight className="w-5 h-5 text-gray-300 transform rotate-180" />
                <span className="text-gray-300 font-medium">Receive</span>
              </button>
            </div>
          </div>

          {/* Recent Payments */}
          <div ref={paymentsListRef} className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Payments</h2>
                <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentPayments.map((payment, index) => {
                  const IconComponent = getPaymentIcon(payment.type)
                  return (
                    <div 
                      key={payment.id}
                      className="payment-item flex items-center justify-between p-4 rounded-lg border border-white/5 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm mb-1">{payment.recipient}</div>
                          <div className="text-xs text-gray-400">
                            {payment.reference} • {payment.date}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-white text-sm mb-1">
                          -{payment.amount}
                        </div>
                        <div className="text-xs text-gray-400 mb-2">
                          -{payment.icpAmount}
                        </div>
                        <div className="flex items-center justify-end space-x-1">
                          {getStatusIcon(payment.status)}
                          <span className={`text-xs font-medium capitalize ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {recentPayments.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No payments yet</h3>
                  <p className="text-gray-500 text-sm mb-6">Start by making your first payment</p>
                  <button
                    onClick={handleNewPayment}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Make Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PaymentsPage