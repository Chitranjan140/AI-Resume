'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { api } from './api'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string, name?: string, remember?: boolean) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user)
        if (user) {
          const token = await user.getIdToken()
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
          delete api.defaults.headers.common['Authorization']
        }
        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.warn('Firebase not configured, checking for remembered user')
      const remembered = localStorage.getItem('rememberUser')
      const userEmail = localStorage.getItem('userEmail')
      const userName = localStorage.getItem('userName')
      
      if (remembered && userEmail) {
        const mockUser = {
          uid: 'dev-user',
          email: userEmail,
          displayName: userName || 'Development User',
          getIdToken: () => Promise.resolve('mock-token')
        } as User
        setUser(mockUser)
        api.defaults.headers.common['Authorization'] = 'Bearer mock-token'
        if (userName) {
          api.defaults.headers.common['x-user-name'] = userName
        }
      }
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string, name?: string, remember = false) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      if (remember) {
        localStorage.setItem('rememberUser', 'true')
      }
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        // Mock authentication for development
        const mockUser = {
          uid: 'dev-user',
          email: email,
          displayName: name || 'Development User',
          getIdToken: () => Promise.resolve('mock-token')
        } as User
        setUser(mockUser)
        api.defaults.headers.common['Authorization'] = 'Bearer mock-token'
        if (name) {
          api.defaults.headers.common['x-user-name'] = name
        }
        if (remember) {
          localStorage.setItem('rememberUser', 'true')
          localStorage.setItem('userEmail', email)
          localStorage.setItem('userName', name || '')
        }
        toast.success('Signed in with mock authentication')
        return
      }
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        // Mock authentication for development
        const mockUser = {
          uid: 'dev-user',
          email: email,
          displayName: 'Development User',
          getIdToken: () => Promise.resolve('mock-token')
        } as User
        setUser(mockUser)
        api.defaults.headers.common['Authorization'] = 'Bearer mock-token'
        toast.success('Signed up with mock authentication')
        return
      }
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        // Mock authentication for development
        const mockUser = {
          uid: 'dev-user',
          email: 'dev@example.com',
          displayName: 'Development User',
          getIdToken: () => Promise.resolve('mock-token')
        } as User
        setUser(mockUser)
        api.defaults.headers.common['Authorization'] = 'Bearer mock-token'
        toast.success('Signed in with mock authentication')
        return
      }
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      // For mock auth, just clear the user
      setUser(null)
      delete api.defaults.headers.common['Authorization']
    }
    // Clear remember me data
    localStorage.removeItem('rememberUser')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}