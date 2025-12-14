'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Star, Zap, Crown } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { api } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { PaymentModal } from '@/components/PaymentModal'
import toast from 'react-hot-toast'

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Star,
    color: 'blue',
    features: [
      '3 Resume uploads',
      '5 AI analyses',
      '10 Job matches',
      'Basic ATS scoring',
      'Email support'
    ],
    buttonText: 'Current Plan',
    popular: false
  },
  {
    name: 'Premium',
    price: 9.99,
    period: 'month',
    description: 'Best for job seekers',
    icon: Zap,
    color: 'purple',
    features: [
      '20 Resume uploads',
      '50 AI analyses',
      '100 Job matches',
      'Advanced ATS optimization',
      'Detailed skill analysis',
      'Priority support'
    ],
    buttonText: 'Upgrade to Premium',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 29.99,
    period: 'month',
    description: 'For teams and professionals',
    icon: Crown,
    color: 'gold',
    features: [
      'Unlimited uploads',
      'Unlimited AI analyses',
      'Unlimited job matches',
      'Advanced analytics',
      'Team collaboration',
      'API access'
    ],
    buttonText: 'Upgrade to Enterprise',
    popular: false
  }
]

export default function PricingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  const handleUpgrade = async (planType: string) => {
    if (!user) {
      toast.error('Please sign in to upgrade')
      return
    }

    if (planType === 'Free') return

    const plan = plans.find(p => p.name === planType)
    if (plan) {
      setSelectedPlan(plan)
      setShowPaymentModal(true)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Unlock the full potential of AI-powered resume analysis
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative glass-card p-8 ${
                    plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${
                      plan.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                      plan.color === 'purple' ? 'from-purple-500 to-pink-500' :
                      'from-yellow-500 to-orange-500'
                    } flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      {plan.description}
                    </p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold">
                        ${plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-slate-600 dark:text-slate-300">
                          /{plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={loading === plan.name}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {loading === plan.name ? 'Processing...' : plan.buttonText}
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={selectedPlan}
        />
      )}
    </div>
  )
}