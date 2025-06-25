import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Shield, Wifi, WifiOff, User, LogOut } from 'lucide-react'

const ICPConnectionStatus: React.FC = () => {
  const { isAuthenticated, principal, login, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <span>Connecting...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={login}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
      >
        <WifiOff className="w-4 h-4" />
        <span>Connect Internet Identity</span>
      </button>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
        <Shield className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <span className="text-xs font-medium">Connected</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="text-xs text-gray-400">
          {principal?.slice(0, 8)}...{principal?.slice(-4)}
        </div>
        <button
          onClick={logout}
          className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  )
}

export default ICPConnectionStatus