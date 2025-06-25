import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter,
  Search,
  Download
} from 'lucide-react'
import BackButton from './BackButton'

interface Transaction {
  id: string
  type: 'sent' | 'received'
  category: 'momo' | 'bank' | 'virtual-card' | 'icp-transfer'
  amount: string
  icpAmount: string
  recipient: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  reference: string
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  
  const headerRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const transactionsRef = useRef<HTMLDivElement>(null)

  const allTransactions: Transaction[] = [
    {
      id: '1',
      type: 'sent',
      category: 'momo',
      amount: 'GHS 250.00',
      icpAmount: '1.05 ICP',
      recipient: 'MTN Mobile Money',
      date: '2 hours ago',
      status: 'completed',
      reference: 'FP-MM-001234'
    },
    {
      id: '2',
      type: 'received',
      category: 'icp-transfer',
      amount: 'GHS 1,200.00',
      icpAmount: '5.12 ICP',
      recipient: 'Salary Payment',
      date: 'Yesterday',
      status: 'completed',
      reference: 'FP-IT-001235'
    },
    {
      id: '3',
      type: 'sent',
      category: 'virtual-card',
      amount: 'GHS 75.50',
      icpAmount: '0.32 ICP',
      recipient: 'Amazon Online Store',
      date: '2 days ago',
      status: 'completed',
      reference: 'FP-VC-001236'
    },
    {
      id: '4',
      type: 'sent',
      category: 'bank',
      amount: 'GHS 450.00',
      icpAmount: '1.89 ICP',
      recipient: 'GCB Bank Transfer',
      date: '3 days ago',
      status: 'pending',
      reference: 'FP-BT-001237'
    },
    {
      id: '5',
      type: 'sent',
      category: 'momo',
      amount: 'GHS 100.00',
      icpAmount: '0.42 ICP',
      recipient: 'Vodafone Cash',
      date: '1 week ago',
      status: 'failed',
      reference: 'FP-MM-001238'
    }
  ]

  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch = transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    const matchesType = filterType === 'all' || transaction.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states
    gsap.set([headerRef.current, filtersRef.current, transactionsRef.current], {
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

    // Animate filters
    tl.to(filtersRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Animate transactions
    tl.to(transactionsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Staggered animation for transaction items
    const transactionItems = transactionsRef.current?.querySelectorAll('.transaction-item')
    if (transactionItems) {
      gsap.fromTo(transactionItems,
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

  }, [filteredTransactions])

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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'momo': return 'Mobile Money'
      case 'bank': return 'Bank Transfer'
      case 'virtual-card': return 'Virtual Card'
      case 'icp-transfer': return 'ICP Transfer'
      default: return category
    }
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting transaction history...')
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
          <History className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-bold text-white">Transaction History</h1>
        </div>
        <div className="absolute right-4">
          <button
            onClick={handleExport}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            title="Export History"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
          
          {/* Filters */}
          <div ref={filtersRef} className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/80 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-gray-900/80 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              {/* Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 bg-gray-900/80 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="sent">Sent</option>
                  <option value="received">Received</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div ref={transactionsRef} className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">
                {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <div 
                    key={transaction.id}
                    className="transaction-item flex items-center justify-between p-4 rounded-lg border border-white/5 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${
                        transaction.type === 'sent' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {transaction.type === 'sent' ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <ArrowDownLeft className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm mb-1">{transaction.recipient}</div>
                        <div className="text-xs text-gray-400 mb-1">
                          {getCategoryLabel(transaction.category)} • {transaction.reference}
                        </div>
                        <div className="text-xs text-gray-500">{transaction.date}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold text-sm mb-1 ${
                        transaction.type === 'sent' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {transaction.type === 'sent' ? '-' : '+'}{transaction.amount}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">
                        {transaction.type === 'sent' ? '-' : '+'}{transaction.icpAmount}
                      </div>
                      <div className="flex items-center justify-end space-x-1">
                        {getStatusIcon(transaction.status)}
                        <span className={`text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No transactions found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HistoryPage