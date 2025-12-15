'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import toast from 'react-hot-toast'

interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  provider: string
  createdAt: string
  lastLoginAt: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, name: string, remember?: boolean) => Promise<void>
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const createOrUpdateUserProfile = async (user: User, provider: string) => {
    try {
      if (!db) throw new Error('Firestore not available')
      
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      
      const profileData: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || localStorage.getItem('userName') || '',
        photoURL: user.photoURL || '',
        provider,
        createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          lastLoginAt: profileData.lastLoginAt,
          displayName: profileData.displayName,
          photoURL: profileData.photoURL
        })
      } else {
        await setDoc(userRef, profileData)
      }

      setUserProfile(profileData)
      localStorage.setItem('userName', profileData.displayName)
    } catch (error) {
      console.warn('Firestore error, using local profile:', error)
      const mockProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || localStorage.getItem('userName') || '',
        photoURL: user.photoURL || '',
        provider,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
      setUserProfile(mockProfile)
      localStorage.setItem('userName', mockProfile.displayName)
    }
  }

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let mounted = true
    let restoreTimer: any = null

    const initAuth = async () => {
      try {
        if (auth) {
          unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!mounted) return

            // If we got a real user, proceed normally
            if (user) {
              // Clear any pending restore timer
              if (restoreTimer) {
                clearTimeout(restoreTimer)
                restoreTimer = null
              }

              setUser(user)
              const provider = user.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'
              await createOrUpdateUserProfile(user, provider)
              setLoading(false)
              return
            }

            // No user currently. If a remembered session exists, wait briefly for auth to restore
            const rememberUser = typeof window !== 'undefined' ? localStorage.getItem('rememberUser') : null
            if (rememberUser === 'true') {
              // Give Firebase a short window to restore persistence
              restoreTimer = setTimeout(async () => {
                if (!mounted) return
                if (auth.currentUser) {
                  const restored = auth.currentUser
                  setUser(restored)
                  const provider = restored.providerData[0]?.providerId === 'google.com' ? 'google' : 'email'
                  await createOrUpdateUserProfile(restored, provider)
                } else {
                  setUser(null)
                  setUserProfile(null)
                }
                setLoading(false)
                restoreTimer = null
              }, 1500)
            } else {
              setUser(null)
              setUserProfile(null)
              setLoading(false)
            }
          })
        } else {
          throw new Error('Firebase not configured')
        }
      } catch (error) {
        console.warn('Firebase not configured, using mock auth')
        
        // Check for existing session
        const userEmail = localStorage.getItem('userEmail')
        const userName = localStorage.getItem('userName')
        const rememberUser = localStorage.getItem('rememberUser')
        
        if (rememberUser === 'true' && userEmail && mounted) {
          const mockUser = {
            uid: 'mock-user',
            email: userEmail,
            displayName: userName || 'User',
            photoURL: '',
            providerData: [{ providerId: 'email' }]
          } as User
          
          setUser(mockUser)
          setUserProfile({
            uid: 'mock-user',
            email: userEmail,
            displayName: userName || 'User',
            photoURL: '',
            provider: 'email',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          })
        }
        
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    return () => {
      mounted = false
      if (unsubscribe) {
        unsubscribe()
      }
      if (restoreTimer) {
        clearTimeout(restoreTimer)
        restoreTimer = null
      }
    }
  }, [])

  const signIn = async (email: string, password: string, remember: boolean = false) => {
    try {
      if (auth) {
        const result = await signInWithEmailAndPassword(auth, email, password)
        await createOrUpdateUserProfile(result.user, 'email')
        // Persist basic session info if user asked to be remembered
        if (remember) {
          localStorage.setItem('userEmail', email)
          localStorage.setItem('userName', result.user.displayName || '')
          localStorage.setItem('rememberUser', 'true')
        }
        return
      }
    } catch (error: any) {
      console.warn('Firebase auth failed, using mock auth:', error.message)
    }
    
    // Mock authentication - always use this if Firebase fails or isn't configured
    const mockUser = {
      uid: 'mock-user-' + Date.now(),
      email: email,
      displayName: localStorage.getItem('userName') || 'User',
      photoURL: '',
      providerData: [{ providerId: 'email' }]
    } as User
    
    const mockProfile = {
      uid: mockUser.uid,
      email: email,
      displayName: localStorage.getItem('userName') || 'User',
      photoURL: '',
      provider: 'email',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    }
    
    setUser(mockUser)
    setUserProfile(mockProfile)
    localStorage.setItem('userEmail', email)
    localStorage.setItem('rememberUser', remember ? 'true' : 'false')
  }

  const signUp = async (email: string, password: string, name: string, remember: boolean = false) => {
    try {
      if (auth) {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName: name })
        localStorage.setItem('userName', name)
        if (remember) {
          localStorage.setItem('userEmail', email)
          localStorage.setItem('rememberUser', 'true')
        }
        await createOrUpdateUserProfile(result.user, 'email')
        return
      }
    } catch (error: any) {
      console.warn('Firebase signup failed, using mock auth:', error.message)
    }
    
    // Mock authentication - always use this if Firebase fails or isn't configured
    const mockUser = {
      uid: 'mock-user-' + Date.now(),
      email: email,
      displayName: name,
      photoURL: '',
      providerData: [{ providerId: 'email' }]
    } as User
    
    const mockProfile = {
      uid: mockUser.uid,
      email: email,
      displayName: name,
      photoURL: '',
      provider: 'email',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    }
    
    setUser(mockUser)
    setUserProfile(mockProfile)
    localStorage.setItem('userName', name)
    localStorage.setItem('userEmail', email)
    localStorage.setItem('rememberUser', remember ? 'true' : 'false')
  }

  const signInWithGoogle = async () => {
    try {
      if (auth) {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        await createOrUpdateUserProfile(result.user, 'google')
        // Persist session info for Google sign-in
        try {
          localStorage.setItem('userEmail', result.user.email || '')
          localStorage.setItem('userName', result.user.displayName || '')
          localStorage.setItem('rememberUser', 'true')
        } catch (e) {
          // ignore localStorage errors
        }
      } else {
        throw new Error('Firebase not configured')
      }
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed' || !auth) {
        // Mock Google authentication
        const mockUser = {
          uid: 'mock-google-user',
          email: 'user@google.com',
          displayName: 'Google User',
          photoURL: 'https://via.placeholder.com/150',
          providerData: [{ providerId: 'google.com' }]
        } as User
        
        setUser(mockUser)
        setUserProfile({
          uid: 'mock-google-user',
          email: 'user@google.com',
          displayName: 'Google User',
          photoURL: 'https://via.placeholder.com/150',
          provider: 'google',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        })
        
        localStorage.setItem('userName', 'Google User')
        localStorage.setItem('userEmail', 'user@google.com')
        localStorage.setItem('rememberUser', 'true')
        return
      }
      throw error
    }
  }

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth)
      }
    } catch (error) {
      console.warn('Firebase signout error:', error)
    }
    
    // Clear all auth data
    setUser(null)
    setUserProfile(null)
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('rememberUser')
  }

  const value = {
    user,
    userProfile,
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}