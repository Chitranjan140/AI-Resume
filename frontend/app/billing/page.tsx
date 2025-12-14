'use client'

import { Navbar } from '@/components/Navbar'
import { SubscriptionManager } from '@/components/SubscriptionManager'
import { motion } from 'framer-motion'

export default function BillingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
            <p className="text-slate-600 dark:text-slate-300">
              Manage your subscription, payment methods, and billing history
            </p>
          </motion.div>

          <SubscriptionManager />
        </div>
      </div>
    </div>
  )
}