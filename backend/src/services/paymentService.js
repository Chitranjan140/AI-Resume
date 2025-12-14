const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

class PaymentService {
  constructor() {
    this.plans = {
      premium: {
        priceId: 'price_premium_monthly',
        amount: 999, // $9.99
        currency: 'usd',
        interval: 'month',
        features: {
          resumesUploaded: 20,
          analysesPerformed: 50,
          jobMatches: 100
        }
      },
      enterprise: {
        priceId: 'price_enterprise_monthly',
        amount: 2999, // $29.99
        currency: 'usd',
        interval: 'month',
        features: {
          resumesUploaded: Infinity,
          analysesPerformed: Infinity,
          jobMatches: Infinity
        }
      }
    }
  }

  async createCheckoutSession(userId, planType, successUrl, cancelUrl) {
    try {
      if (!this.plans[planType]) {
        throw new Error('Invalid plan type')
      }

      const plan = this.plans[planType]
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: plan.currency,
            product_data: {
              name: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`,
              description: `Resume Analyzer ${planType} subscription`
            },
            unit_amount: plan.amount,
            recurring: {
              interval: plan.interval
            }
          },
          quantity: 1
        }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: userId,
        metadata: {
          userId,
          planType
        }
      })

      return {
        sessionId: session.id,
        url: session.url
      }
    } catch (error) {
      console.error('Stripe checkout error:', error)
      throw new Error('Failed to create checkout session')
    }
  }

  async createPortalSession(customerId, returnUrl) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      })

      return {
        url: session.url
      }
    } catch (error) {
      console.error('Stripe portal error:', error)
      throw new Error('Failed to create portal session')
    }
  }

  async handleWebhook(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )

      switch (event.type) {
        case 'checkout.session.completed':
          return this.handleCheckoutCompleted(event.data.object)
        case 'customer.subscription.updated':
          return this.handleSubscriptionUpdated(event.data.object)
        case 'customer.subscription.deleted':
          return this.handleSubscriptionCanceled(event.data.object)
        default:
          console.log(`Unhandled event type: ${event.type}`)
          return null
      }
    } catch (error) {
      console.error('Webhook error:', error)
      throw new Error('Webhook signature verification failed')
    }
  }

  async handleCheckoutCompleted(session) {
    const userId = session.client_reference_id
    const planType = session.metadata.planType
    
    return {
      userId,
      planType,
      customerId: session.customer,
      subscriptionId: session.subscription,
      status: 'active'
    }
  }

  async handleSubscriptionUpdated(subscription) {
    return {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    }
  }

  async handleSubscriptionCanceled(subscription) {
    return {
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: 'canceled',
      canceledAt: new Date(subscription.canceled_at * 1000)
    }
  }

  getPlanFeatures(planType) {
    return this.plans[planType]?.features || this.plans.free
  }

  validatePlanAccess(userPlan, requiredPlan) {
    const planHierarchy = { free: 0, premium: 1, enterprise: 2 }
    return planHierarchy[userPlan] >= planHierarchy[requiredPlan]
  }
}

module.exports = new PaymentService()