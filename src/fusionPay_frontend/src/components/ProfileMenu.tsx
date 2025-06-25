import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { User, Settings, LogOut, Eye, Shield, Wallet } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface ProfileMenuProps {
  className?: string
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { logout, principal, isAuthenticated } = useAuth()
  
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const openMenu = () => {
    setIsOpen(true)
    
    // Set initial state for dropdown
    gsap.set(dropdownRef.current, {
      opacity: 0,
      scale: 0.8,
      transformOrigin: 'top right',
      y: -10
    })

    // Animate dropdown appearance
    gsap.to(dropdownRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "back.out(1.7)"
    })

    // Animate menu items
    const menuItems = dropdownRef.current?.querySelectorAll('.menu-item')
    if (menuItems) {
      gsap.fromTo(menuItems,
        { opacity: 0, x: 20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.2, 
          stagger: 0.05,
          delay: 0.1,
          ease: "power2.out" 
        }
      )
    }
  }

  const closeMenu = () => {
    gsap.to(dropdownRef.current, {
      opacity: 0,
      scale: 0.8,
      y: -10,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setIsOpen(false)
    })
  }

  const handleToggle = () => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  const handleButtonHover = () => {
    gsap.to(buttonRef.current, {
      scale: 1.05,
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      duration: 0.2,
      ease: "power2.out"
    })
  }

  const handleButtonLeave = () => {
    if (!isOpen) {
      gsap.to(buttonRef.current, {
        scale: 1,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleLogout = async () => {
    closeMenu()
    
    // Add logout animation
    gsap.to(buttonRef.current, {
      scale: 0.8,
      opacity: 0.5,
      duration: 0.3,
      ease: "power2.out"
    })

    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
      // Reset button state on error
      gsap.to(buttonRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }
  }

  const handleMenuItemHover = (element: HTMLElement) => {
    gsap.to(element, {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      x: 4,
      duration: 0.2,
      ease: "power2.out"
    })
  }

  const handleMenuItemLeave = (element: HTMLElement) => {
    gsap.to(element, {
      backgroundColor: 'transparent',
      x: 0,
      duration: 0.2,
      ease: "power2.out"
    })
  }

  if (!isAuthenticated) {
    return null
  }

  const formatPrincipal = (principal: string) => {
    return `${principal.slice(0, 8)}...${principal.slice(-4)}`
  }

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-lg border-2 border-white/20"
        aria-label="Profile menu"
      >
        <User className="w-5 h-5 text-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 top-full mt-2 w-64 bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl py-2 z-50 border border-white/20"
        >
          {/* User Info Header */}
          <div className="menu-item px-4 py-3 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm">fusionPay User</div>
                <div className="text-gray-400 text-xs font-mono truncate">
                  {principal ? formatPrincipal(principal) : 'Loading...'}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              className="menu-item w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white transition-colors"
              onMouseEnter={(e) => handleMenuItemHover(e.currentTarget)}
              onMouseLeave={(e) => handleMenuItemLeave(e.currentTarget)}
              onClick={() => {
                closeMenu()
                // Add view profile functionality here
                console.log('View Profile clicked')
              }}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">View Profile</span>
            </button>

            <button
              className="menu-item w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white transition-colors"
              onMouseEnter={(e) => handleMenuItemHover(e.currentTarget)}
              onMouseLeave={(e) => handleMenuItemLeave(e.currentTarget)}
              onClick={() => {
                closeMenu()
                // Add wallet management functionality here
                console.log('Wallet Management clicked')
              }}
            >
              <Wallet className="w-4 h-4" />
              <span className="text-sm">Wallet Management</span>
            </button>

            <button
              className="menu-item w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white transition-colors"
              onMouseEnter={(e) => handleMenuItemHover(e.currentTarget)}
              onMouseLeave={(e) => handleMenuItemLeave(e.currentTarget)}
              onClick={() => {
                closeMenu()
                // Add settings functionality here
                console.log('Settings clicked')
              }}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>

            <button
              className="menu-item w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white transition-colors"
              onMouseEnter={(e) => handleMenuItemHover(e.currentTarget)}
              onMouseLeave={(e) => handleMenuItemLeave(e.currentTarget)}
              onClick={() => {
                closeMenu()
                // Add security settings functionality here
                console.log('Security clicked')
              }}
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm">Security</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className="border-t border-white/10 pt-1">
            <button
              className="menu-item w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              onMouseEnter={(e) => handleMenuItemHover(e.currentTarget)}
              onMouseLeave={(e) => handleMenuItemLeave(e.currentTarget)}
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>

          {/* Connection Status */}
          <div className="px-4 py-2 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Connected to ICP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu