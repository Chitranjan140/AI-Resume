'use client'

import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-bold text-blue-600 mb-4"
        >
          404
        </motion.div>
        
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
            
            <Link href="/" className="btn-primary flex items-center justify-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="btn-secondary flex items-center justify-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link href="/analyze" className="btn-secondary flex items-center justify-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Analyze Resume</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-sm text-slate-500">
          <p>Need help? <Link href="/contact" className="text-blue-600 hover:underline">Contact Support</Link></p>
        </div>
      </motion.div>
    </div>
  )
}