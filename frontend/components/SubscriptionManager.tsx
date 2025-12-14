'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Calendar, AlertCircle, CheckCircle, Settings } from 'lucide-react'
import { paymentService, type Subscription, type PaymentMethod } from '@/lib/payment'
import toast from 'react-hot-toast'

export function SubscriptionManager() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      const [subData, paymentData] = await Promise.all([
        paymentService.getSubscriptionStatus(),
        paymentService.getPaymentMethods()
      ])
      
      setSubscription(subData)
      setPaymentMethods(paymentData)
    } catch (error) {
      console.error('Failed to load subscription data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return
    
    try {
      await paymentService.cancelSubscription()
      toast.success('Subscription canceled successfully')
      loadSubscriptionData()
    } catch (error) {
      toast.error('Failed to cancel subscription')
    }
  }

  const handleManageBilling = async () => {
    try {
      const { url } = await paymentService.createPortalSession()
      window.location.href = url
    } catch (error) {
      toast.error('Failed to open billing portal')
    }
  }

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'canceled': return 'text-red-600'
      case 'past_due': return 'text-yellow-600'
      default: return 'text-slate-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'canceled': return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'past_due': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default: return <AlertCircle className="w-5 h-5 text-slate-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Current Subscription</h3>
            <div className="flex items-center space-x-2">
              {subscription && getStatusIcon(subscription.status)}
              <span className="text-2xl font-bold capitalize">
                {subscription?.plan || 'Free'} Plan
              </span>
              {subscription && (
                <span className={`text-sm ${getStatusColor(subscription.status)}`}>
                  ({subscription.status})
                </span>
              )}
            </div>
          </div>
          
          {subscription?.plan !== 'free' && (
            <button
              onClick={handleManageBilling}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Manage</span>
            </button>
          )}
        </div>

        {subscription && subscription.plan !== 'free' && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4" />
              <span>
                {subscription.cancelAtPeriodEnd 
                  ? `Expires on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                  : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                }
              </span>
            </div>
            
            {!subscription.cancelAtPeriodEnd && (
              <button
                onClick={handleCancelSubscription}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Payment Methods */}
      {paymentMethods.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <div>
                    <div className="font-medium">
                      {method.brand?.toUpperCase()} •••• {method.last4}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </div>
                  </div>
                </div>
                
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Update
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-4">Billing History</h3>
        
        <div className="text-center py-8 text-slate-600 dark:text-slate-300">
          <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No billing history available</p>
          <p className="text-sm">Your invoices will appear here once you have an active subscription</p>
        </div>
      </motion.div>
    </div>
  )
}