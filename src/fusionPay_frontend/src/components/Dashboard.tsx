import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle, 
  Home, 
  CreditCard, 
  History, 
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  TrendingUp,
  Wallet,
  Shield,
  Download
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ICPConnectionStatus from './ICPConnectionStatus'
import ProfileMenu from './ProfileMenu'
import LoginPrompt from './LoginPrompt'
import LoadingPage from './LoadingPage'

interface Transaction {
  id: string
  type: 'sent' | 'received'
  amount: string
  icpAmount: string
  recipient: string
  date: string
  status: 'completed' | 'pending'
}

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(true)
  const [icpBalance] = useState('15.42')
  const [ghsBalance] = useState('3,500.00')
  const [activeNav, setActiveNav] = useState('home')
  
  const balanceCardRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const activityRef = useRef<HTMLDivElement>(null)
  const sideNavRef = useRef<HTMLDivElement>(null)
  const bottomNavRef = useRef<HTMLDivElement>(null)

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'sent',
      amount: 'GHS 250.00',
      icpAmount: '1.05 ICP',
      recipient: 'MTN Mobile Money',
      date: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'received',
      amount: 'GHS 1,200.00',
      icpAmount: '5.12 ICP',
      recipient: 'Salary Payment',
      date: 'Yesterday',
      status: 'completed'
    },
    {
      id: '3',
      type: 'sent',
      amount: 'GHS 75.50',
      icpAmount: '0.32 ICP',
      recipient: 'Vodafone Cash',
      date: '2 days ago',
      status: 'completed'
    },
    {
      id: '4',
      type: 'sent',
      amount: 'GHS 450.00',
      icpAmount: '1.89 ICP',
      recipient: 'AirtelTigo Money',
      date: '3 days ago',
      status: 'completed'
    }
  ]

  useEffect(() => {
    // Only run animations if elements are mounted
    if (!balanceCardRef.current || !actionsRef.current || !activityRef.current) {
      return
    }

    const tl = gsap.timeline()

    // Animate balance card
    if (balanceCardRef.current) {
      tl.fromTo(balanceCardRef.current, 
        { 
          opacity: 0, 
          y: 30, 
          scale: 0.95 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          ease: "back.out(1.7)" 
        }
      )
    }

    // Animate action buttons
    if (actionsRef.current && actionsRef.current.children.length > 0) {
      tl.fromTo(Array.from(actionsRef.current.children), 
        { 
          opacity: 0, 
          y: 20 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "power2.out" 
        }, 
        "-=0.4"
      )
    }

    // Animate activity section
    if (activityRef.current) {
      tl.fromTo(activityRef.current, 
        { 
          opacity: 0, 
          y: 20 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: "power2.out" 
        }, 
        "-=0.3"
      )
    }

    // Animate navigation - only animate elements that exist
    const navElements = [sideNavRef.current, bottomNavRef.current].filter(Boolean)
    if (navElements.length > 0) {
      tl.fromTo(navElements, 
        { 
          opacity: 0, 
          x: -20 
        },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6, 
          ease: "power2.out" 
        }, 
        "-=0.4"
      )
    }

    // Add floating animation to balance card
    if (balanceCardRef.current) {
      gsap.to(balanceCardRef.current, {
        y: -3,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      })
    }

  }, [])

  const handleActionHover = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1.02,
      y: -2,
      boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const handleActionLeave = (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const handleNavigation = (navId: string, path: string) => {
    setActiveNav(navId)
    navigate(path)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'pay-now':
        navigate('/pay-now')
        break
      case 'send-icp':
        navigate('/send-icp')
        break
      case 'virtual-card':
        navigate('/virtual-card')
        break
      case 'receive':
        navigate('/receive')
        break
      default:
        console.log(`Action ${action} not implemented yet`)
    }
  }

  if (isLoading) {
    return <LoadingPage message="Loading your dashboard..." />
  }

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  return (
    <div className="h-screen bg-gray-950 relative overflow-hidden flex">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Blockchain grid background */}
      <div className="absolute inset-0 blockchain-grid opacity-20"></div>

      {/* Desktop Side Navigation */}
      <nav 
        ref={sideNavRef}
        className="w-64 fixed left-0 top-0 h-screen bg-gray-900/90 backdrop-blur-lg p-4 hidden md:flex flex-col z-20 border-r border-white/10"
      >
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8 p-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center icp-glow">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            fusionPay
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 space-y-2">
          {[
            { icon: Home, label: 'Dashboard', id: 'home', path: '/dashboard' },
            { icon: CreditCard, label: 'Payments', id: 'payments', path: '/payments' },
            { icon: History, label: 'History', id: 'history', path: '/history' },
            { icon: Settings, label: 'Settings', id: 'settings', path: '/settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id, item.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                activeNav === item.id 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Section */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <ICPConnectionStatus />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Top Navigation Bar */}
        <nav className="fixed top-0 left-0 md:left-64 right-0 bg-gray-900/90 backdrop-blur-lg flex justify-between items-center p-4 z-30 border-b border-white/10">
          {/* Mobile Logo */}
          <div className="flex items-center space-x-3 md:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center icp-glow">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              fusionPay
            </h1>
          </div>
          
          {/* Desktop Title */}
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold text-white">Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <ICPConnectionStatus />
            </div>
            <ProfileMenu />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 pt-20 pb-20 md:pb-4 overflow-y-auto custom-scrollbar">
          <div className="p-4 lg:p-6 max-w-6xl mx-auto h-full flex flex-col">
            {/* Balance Display */}
            <div className="flex justify-center mb-6">
              <div 
                ref={balanceCardRef}
                className="balance-card rounded-2xl p-6 shadow-2xl w-full max-w-lg relative"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white/90">Total Balance</h2>
                    <button 
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      {showBalance ? (
                        <Eye className="w-4 h-4 text-white" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                      {showBalance ? `${icpBalance} ICP` : '••••••'}
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-lg text-white/80">
                      <span>~GHS {showBalance ? ghsBalance : '••••••'}</span>
                      <RefreshCw className="w-4 h-4 cursor-pointer hover:rotate-180 transition-transform duration-500" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-white/70">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span>+12.5% this month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div ref={actionsRef} className="flex flex-col md:flex-row justify-center items-center gap-3 mb-6">
              {[
                { icon: Send, label: 'Pay Now', color: 'from-purple-500 to-blue-500', action: 'pay-now' },
                { icon: ArrowUpRight, label: 'Send ICP', color: 'from-blue-500 to-cyan-500', action: 'send-icp' },
                { icon: CreditCard, label: 'Virtual Card', color: 'from-green-500 to-emerald-500', action: 'virtual-card' },
                { icon: Download, label: 'Receive', color: 'from-orange-500 to-red-500', action: 'receive' }
              ].map((actionItem, index) => (
                <button
                  key={index}
                  className="action-button glass-effect hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl shadow-lg border border-white/20 min-w-[140px] group transition-all"
                  onMouseEnter={(e) => handleActionHover(e.currentTarget)}
                  onMouseLeave={(e) => handleActionLeave(e.currentTarget)}
                  onClick={() => handleQuickAction(actionItem.action)}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${actionItem.color}`}>
                      <actionItem.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">{actionItem.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Recent Activity */}
            <div ref={activityRef} className="flex-1 min-h-0">
              <div className="glass-effect rounded-2xl p-4 border border-white/10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                  <button 
                    onClick={() => navigate('/history')}
                    className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                  {transactions.map((transaction, index) => (
                    <div 
                      key={transaction.id}
                      className="transaction-item flex justify-between items-center p-3 rounded-xl border-b border-white/5 last:border-b-0 hover:bg-white/5"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'sent' 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {transaction.type === 'sent' ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{transaction.recipient}</div>
                          <div className="text-xs text-gray-400">{transaction.date}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-semibold text-sm ${
                          transaction.type === 'sent' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {transaction.type === 'sent' ? '-' : '+'}{transaction.amount}
                        </div>
                        <div className="text-xs text-gray-400">
                          {transaction.type === 'sent' ? '-' : '+'}{transaction.icpAmount}
                        </div>
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-500">Completed</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav 
        ref={bottomNavRef}
        className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-lg flex justify-around items-center p-4 shadow-xl z-30 md:hidden border-t border-white/10"
      >
        {[
          { icon: Home, label: 'Home', id: 'home', path: '/dashboard' },
          { icon: CreditCard, label: 'Payments', id: 'payments', path: '/payments' },
          { icon: History, label: 'History', id: 'history', path: '/history' },
          { icon: Settings, label: 'Settings', id: 'settings', path: '/settings' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id, item.path)}
            className={`nav-item flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
              activeNav === item.id 
                ? 'text-purple-400 bg-purple-500/20' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Dashboard