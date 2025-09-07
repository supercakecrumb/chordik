import React, { createContext, useState, useEffect, useContext } from 'react'
import http from '../http'

interface User {
  id: string
  email: string
  displayName: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Fixed: Remove double /api prefix - http instance already has /api in base URL
      const response = await http.get<User>('/auth/me')
      setUser(response.data)
    } catch (error) {
      // Not authenticated, that's fine
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await http.post('/auth/login', {
        email,
        password
      })
      // After successful login, check auth status to get user data
      await checkAuthStatus()
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await http.post('/auth/logout', {})
      setUser(null)
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}