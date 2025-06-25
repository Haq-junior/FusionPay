import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Palette, 
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react'
import BackButton from './BackButton'
import { useAuth } from '../contexts/AuthContext'

interface SettingItem {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  hasToggle?: boolean
  toggleValue?: boolean
  onToggle?: (value: boolean) => void
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { logout, principal } = useAuth()
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  
  const headerRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile Settings',
          description: 'Manage your account information',
          icon: User,
          action: () => console.log('Profile settings')
        },
        {
          id: 'security',
          title: 'Security & Privacy',
          description: 'Manage your security preferences',
          icon: Shield,
          action: () => console.log('Security settings')
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          description: 'Control your notification preferences',
          icon: Bell,
          action: () => {},
          hasToggle: true,
          toggleValue: notifications,
          onToggle: setNotifications
        },
        {
          id: 'theme',
          title: 'Dark Mode',
          description: 'Toggle between light and dark themes',
          icon: darkMode ? Moon : Sun,
          action: () => {},
          hasToggle: true,
          toggleValue: darkMode,
          onToggle: setDarkMode
        },
        {
          id: 'language',
          title: 'Language & Region',
          description: 'Set your preferred language',
          icon: Globe,
          action: () => console.log('Language settings')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          description: 'Get help and contact support',
          icon: HelpCircle,
          action: () => console.log('Help & Support')
        }
      ]
    }
  ]

  useEffect(() => {
    const tl = gsap.timeline()

    // Set initial states
    gsap.set([headerRef.current, profileRef.current, settingsRef.current], {
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

    // Animate profile section
    tl.to(profileRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Animate settings sections
    tl.to(settingsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")

    // Staggered animation for setting items
    const settingItems = settingsRef.current?.querySelectorAll('.setting-item')
    if (settingItems) {
      gsap.fromTo(settingItems,
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

  const handleBack = () => {
    navigate('/dashboard')
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const formatPrincipal = (principal: string) => {
    return `${principal.slice(0, 8)}...${principal.slice(-8)}`
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
          <Settings className="w-6 h-6 text-gray-400" />
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
          
          {/* Profile Section */}
          <div ref={profileRef} className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white mb-1">fusionPay User</h2>
                <p className="text-gray-400 text-sm font-mono">
                  {principal ? formatPrincipal(principal) : 'Loading...'}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-xs font-medium">Connected to ICP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div ref={settingsRef} className="space-y-6">
            {settingsSections.map((section, sectionIndex) => (
              <div key={section.title} className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/10">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => {
                      const IconComponent = item.icon
                      return (
                        <div 
                          key={item.id}
                          className="setting-item flex items-center justify-between p-4 rounded-lg border border-white/5 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                          onClick={item.action}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-gray-600 transition-colors">
                              <IconComponent className="w-5 h-5 text-gray-300" />
                            </div>
                            <div>
                              <div className="font-medium text-white text-sm mb-1">{item.title}</div>
                              <div className="text-xs text-gray-400">{item.description}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {item.hasToggle && item.onToggle ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  item.onToggle!(!item.toggleValue)
                                }}
                                className={`relative w-12 h-6 rounded-full transition-colors ${
                                  item.toggleValue ? 'bg-blue-500' : 'bg-gray-600'
                                }`}
                              >
                                <div
                                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                    item.toggleValue ? 'translate-x-7' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Logout Section */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-red-500/30">
            <div className="p-6">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                    <LogOut className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="font-medium text-red-400 text-sm mb-1">Logout</div>
                    <div className="text-xs text-red-300">Disconnect from Internet Identity</div>
                  </div>
                </div>
                
                <ChevronRight className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SettingsPage