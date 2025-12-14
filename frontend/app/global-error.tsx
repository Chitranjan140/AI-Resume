'use client'

import { motion } from 'framer-motion'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </motion.div>
            
            <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              An unexpected error occurred. Please try again.
            </p>

            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              <a
                href="/"
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </a>
            </div>
          </motion.div>
        </div>
      </body>
    </html>
  )
}