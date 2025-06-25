import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { AuthClient } from '@dfinity/auth-client'
import { Identity } from '@dfinity/agent'
import { backendService } from '../utils/backend'

interface AuthContextType {
  isAuthenticated: boolean
  identity: Identity | null
  principal: string | null
  login: () => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [principal, setPrincipal] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authClient, setAuthClient] = useState<AuthClient | null>(null)

  useEffect(() => {
    initAuth()
  }, [])

  const initAuth = async () => {
    try {
      const client = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      })
      
      setAuthClient(client)

      if (await client.isAuthenticated()) {
        const identity = client.getIdentity()
        setIdentity(identity)
        setPrincipal(identity.getPrincipal().toString())
        setIsAuthenticated(true)
        // Initialize backend service with authenticated client
        await backendService.init(client)
      } else {
        // Initialize backend service without authentication
        await backendService.init()
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = useCallback(async () => {
    if (!authClient) return

    try {
      setIsLoading(true)
      
      await authClient.login({
        identityProvider: import.meta.env.DEV 
          ? `http://localhost:4943/?canisterId=${import.meta.env.VITE_INTERNET_IDENTITY_CANISTER_ID || 'rdmx6-jaaaa-aaaaa-aaadq-cai'}`
          : 'https://identity.ic0.app',
        onSuccess: async () => {
          const identity = authClient.getIdentity()
          setIdentity(identity)
          setPrincipal(identity.getPrincipal().toString())
          setIsAuthenticated(true)
          // Re-initialize backend service with authenticated client
          await backendService.init(authClient)
        },
        onError: (error) => {
          console.error('Login failed:', error)
        }
      })
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [authClient])

  const logout = useCallback(async () => {
    if (!authClient) return

    try {
      setIsLoading(true)
      await authClient.logout()
      setIdentity(null)
      setPrincipal(null)
      setIsAuthenticated(false)
      // Re-initialize backend service without authentication
      await backendService.init()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [authClient])

  const value: AuthContextType = {
    isAuthenticated,
    identity,
    principal,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}