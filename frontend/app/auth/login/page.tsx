'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { WaveBackground } from '@/components/WaveBackground'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const { signIn, signUp, signInWithGoogle, user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      console.log('Login: User authenticated, redirecting to dashboard')
      setTimeout(() => router.replace('/dashboard'), 100)
    }
  }, [user, authLoading, router])

  // Show loading or redirect
  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">{authLoading ? 'Loading...' : 'Redirecting...'}</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password, rememberMe)
        toast.success('Welcome back!')
      } else {
        if (!formData.name.trim()) {
          toast.error('Please enter your full name')
          setLoading(false)
          return
        }
        await signUp(formData.email, formData.password, formData.name, rememberMe)
        toast.success('Account created successfully!')
      }
      // Don't manually redirect - let useEffect handle it when user state changes
    } catch (error: any) {
      toast.error(error.message || (isLogin ? 'Login failed' : 'Signup failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <WaveBackground />
      
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center mt-6 mb-4"
            >
              <Sparkles className="w-6 h-6 text-blue-400 mr-2" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                ResumeAI
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-slate-300 text-lg font-light"
            >
              {isLogin ? 'Welcome back to the future of resumes' : 'Join the AI revolution'}
            </motion.p>
          </div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="relative backdrop-blur-xl bg-white/5 p-10 rounded-3xl border border-white/10 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="relative"
                >
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedField === 'name' ? 'text-blue-400' : 'text-slate-400'
                    }`} />
                    <input
                      type="text"
                      required={!isLogin}
                      className={`w-full bg-white/5 border-2 rounded-2xl px-12 py-4 text-white placeholder-slate-400 transition-all duration-300 focus:outline-none ${
                        focusedField === 'name' 
                          ? 'border-blue-400/50 bg-white/10 shadow-lg shadow-blue-500/20' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="Full Name"
                      value={formData.name}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <motion.label
                      className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                        formData.name || focusedField === 'name'
                          ? '-top-2 text-xs text-blue-400 bg-slate-900 px-2 rounded'
                          : 'top-4 text-slate-400'
                      }`}
                      animate={{
                        y: formData.name || focusedField === 'name' ? -8 : 0,
                        scale: formData.name || focusedField === 'name' ? 0.85 : 1
                      }}
                    >
                      {formData.name || focusedField === 'name' ? 'Full Name' : ''}
                    </motion.label>
                  </div>
                </motion.div>
              )}

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="relative"
              >
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedField === 'email' ? 'text-blue-400' : 'text-slate-400'
                  }`} />
                  <input
                    type="email"
                    required
                    className={`w-full bg-white/5 border-2 rounded-2xl px-12 py-4 text-white placeholder-slate-400 transition-all duration-300 focus:outline-none ${
                      focusedField === 'email' 
                        ? 'border-blue-400/50 bg-white/10 shadow-lg shadow-blue-500/20' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    placeholder="Email ID"
                    value={formData.email}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <motion.label
                    className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                      formData.email || focusedField === 'email'
                        ? '-top-2 text-xs text-blue-400 bg-slate-900 px-2 rounded'
                        : 'top-4 text-slate-400'
                    }`}
                    animate={{
                      y: formData.email || focusedField === 'email' ? -8 : 0,
                      scale: formData.email || focusedField === 'email' ? 0.85 : 1
                    }}
                  >
                    {formData.email || focusedField === 'email' ? 'Email ID' : ''}
                  </motion.label>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="relative"
              >
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedField === 'password' ? 'text-blue-400' : 'text-slate-400'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`w-full bg-white/5 border-2 rounded-2xl px-12 py-4 pr-12 text-white placeholder-slate-400 transition-all duration-300 focus:outline-none ${
                      focusedField === 'password' 
                        ? 'border-blue-400/50 bg-white/10 shadow-lg shadow-blue-500/20' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    placeholder="Password"
                    value={formData.password}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <motion.label
                    className={`absolute left-12 transition-all duration-300 pointer-events-none ${
                      formData.password || focusedField === 'password'
                        ? '-top-2 text-xs text-blue-400 bg-slate-900 px-2 rounded'
                        : 'top-4 text-slate-400'
                    }`}
                    animate={{
                      y: formData.password || focusedField === 'password' ? -8 : 0,
                      scale: formData.password || focusedField === 'password' ? 0.85 : 1
                    }}
                  >
                    {formData.password || focusedField === 'password' ? 'Password' : ''}
                  </motion.label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {isLogin && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
                      rememberMe 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-white/30 group-hover:border-blue-400'
                    }`}>
                      {rememberMe && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      )}
                    </div>
                    <span className="ml-3 text-sm text-slate-300 group-hover:text-white transition-colors">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                  </Link>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <div className="flex items-center justify-center space-x-3">
                  {loading ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </div>
                {!loading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </motion.button>
            </form>

            {/* Google Sign In */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9 }}
              className="mt-6"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900 text-slate-400">or</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={async () => {
                  setLoading(true)
                  try {
                    await signInWithGoogle()
                    toast.success('Welcome!')
                    // Don't manually redirect - let useEffect handle it
                  } catch (error: any) {
                    toast.error(error.message || 'Google sign-in failed')
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
                className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
              className="mt-8 text-center"
            >
              <p className="text-slate-300">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}