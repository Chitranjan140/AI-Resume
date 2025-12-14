'use client'

import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Simple, Free Pricing</h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Everything you need, completely free forever
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 max-w-md mx-auto"
          >
            <div className="text-center mb-6">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Free Forever</h2>
              <div className="text-4xl font-bold text-green-600 mb-2">$0</div>
              <p className="text-slate-600 dark:text-slate-300">No hidden fees, no limits</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Unlimited resume uploads',
                'Unlimited AI analysis',
                'Unlimited job matching',
                'ATS optimization',
                'Skill extraction',
                'Performance insights',
                'Export results',
                '24/7 availability'
              ].map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/analyze" className="w-full btn-primary block text-center">
              Get Started Free
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-slate-600 dark:text-slate-300">
              Questions? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}