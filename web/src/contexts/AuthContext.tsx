import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

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


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        withCredentials: true
      })
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
      await axios.post(`${API_BASE}/auth/login`, {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      // After successful login, check auth status to get user data
      await checkAuthStatus()
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`, {}, {
        withCredentials: true,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
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