const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const paymentService = require('../services/paymentService')
const User = require('../models/User')

// Create checkout session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { planType } = req.body
    const userId = req.user._id.toString()
    
    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?payment=success`
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pricing?payment=canceled`
    
    const session = await paymentService.createCheckoutSession(
      userId,
      planType,
      successUrl,
      cancelUrl
    )
    
    res.json({
      success: true,
      sessionId: session.sessionId,
      url: session.url
    })
  } catch (error) {
    console.error('Checkout session error:', error)
    res.status(400).json({
      error: 'Payment Error',
      message: error.message
    })
  }
})

// Create customer portal session
router.post('/create-portal-session', authenticateToken, async (req, res) => {
  try {
    if (!req.user.stripeCustomerId) {
      return res.status(400).json({
        error: 'No Subscription',
        message: 'No active subscription found'
      })
    }
    
    const returnUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`
    
    const session = await paymentService.createPortalSession(
      req.user.stripeCustomerId,
      returnUrl
    )
    
    res.json({
      success: true,
      url: session.url
    })
  } catch (error) {
    console.error('Portal session error:', error)
    res.status(400).json({
      error: 'Portal Error',
      message: error.message
    })
  }
})

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature']
    const webhookData = await paymentService.handleWebhook(req.body, signature)
    
    if (webhookData) {
      // Update user subscription in database
      await updateUserSubscription(webhookData)
    }
    
    res.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(400).json({
      error: 'Webhook Error',
      message: error.message
    })
  }
})

// Process direct payment
router.post('/process-payment', authenticateToken, async (req, res) => {
  try {
    const { planType, paymentMethod } = req.body
    const userId = req.user._id.toString()
    
    // Simulate payment processing
    const paymentResult = {
      success: true,
      transactionId: `txn_${Date.now()}`,
      amount: planType === 'premium' ? 999 : 2999
    }
    
    // Update user subscription
    await User.findByIdAndUpdate(userId, {
      subscription: planType,
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    })
    
    res.json({
      success: true,
      payment: paymentResult,
      message: 'Payment processed successfully'
    })
  } catch (error) {
    console.error('Process payment error:', error)
    res.status(400).json({
      error: 'Payment Error',
      message: error.message
    })
  }
})

// Get payment methods
router.get('/payment-methods', authenticateToken, async (req, res) => {
  try {
    // Mock payment methods
    const paymentMethods = [
      {
        id: 'pm_1',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025
      }
    ]
    
    res.json({
      success: true,
      paymentMethods
    })
  } catch (error) {
    console.error('Get payment methods error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to get payment methods'
    })
  }
})

// Cancel subscription
router.post('/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      subscription: 'free',
      subscriptionStatus: 'canceled',
      subscriptionEndDate: new Date()
    })
    
    res.json({
      success: true,
      message: 'Subscription canceled successfully'
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to cancel subscription'
    })
  }
})

// Get subscription status
router.get('/subscription-status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    
    res.json({
      success: true,
      subscription: {
        plan: user.subscription,
        status: user.subscriptionStatus,
        customerId: user.stripeCustomerId,
        subscriptionId: user.stripeSubscriptionId,
        currentPeriodEnd: user.subscriptionEndDate
      }
    })
  } catch (error) {
    console.error('Subscription status error:', error)
    res.status(500).json({
      error: 'Server Error',
      message: 'Failed to get subscription status'
    })
  }
})

async function updateUserSubscription(webhookData) {
  try {
    if (webhookData.userId) {
      // New subscription
      await User.findByIdAndUpdate(webhookData.userId, {
        subscription: webhookData.planType,
        subscriptionStatus: webhookData.status,
        stripeCustomerId: webhookData.customerId,
        stripeSubscriptionId: webhookData.subscriptionId,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: webhookData.currentPeriodEnd
      })
    } else if (webhookData.customerId) {
      // Existing subscription update
      const updateData = {
        subscriptionStatus: webhookData.status
      }
      
      if (webhookData.currentPeriodEnd) {
        updateData.subscriptionEndDate = webhookData.currentPeriodEnd
      }
      
      if (webhookData.status === 'canceled') {
        updateData.subscription = 'free'
        updateData.subscriptionEndDate = new Date()
      }
      
      await User.findOneAndUpdate(
        { stripeCustomerId: webhookData.customerId },
        updateData
      )
    }
  } catch (error) {
    console.error('Update subscription error:', error)
  }
}

module.exports = router