import { api } from './api'

export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
}

export interface Subscription {
  id: string
  status: 'active' | 'canceled' | 'past_due' | 'incomplete'
  plan: 'free' | 'premium' | 'enterprise'
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

class PaymentService {
  async createCheckoutSession(planType: string, successUrl?: string, cancelUrl?: string) {
    try {
      const response = await api.post('/payment/create-checkout-session', {
        planType,
        successUrl: successUrl || `${window.location.origin}/dashboard?payment=success`,
        cancelUrl: cancelUrl || `${window.location.origin}/pricing?payment=canceled`
      })
      
      return response.data
    } catch (error) {
      console.error('Create checkout session error:', error)
      throw new Error('Failed to create checkout session')
    }
  }

  async createPortalSession(returnUrl?: string) {
    try {
      const response = await api.post('/payment/create-portal-session', {
        returnUrl: returnUrl || `${window.location.origin}/dashboard`
      })
      
      return response.data
    } catch (error) {
      console.error('Create portal session error:', error)
      throw new Error('Failed to create portal session')
    }
  }

  async getSubscriptionStatus(): Promise<Subscription | null> {
    try {
      const response = await api.get('/payment/subscription-status')
      return response.data.subscription
    } catch (error) {
      console.error('Get subscription status error:', error)
      return null
    }
  }

  async cancelSubscription() {
    try {
      const response = await api.post('/payment/cancel-subscription')
      return response.data
    } catch (error) {
      console.error('Cancel subscription error:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  async updatePaymentMethod(paymentMethodId: string) {
    try {
      const response = await api.post('/payment/update-payment-method', {
        paymentMethodId
      })
      return response.data
    } catch (error) {
      console.error('Update payment method error:', error)
      throw new Error('Failed to update payment method')
    }
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await api.get('/payment/payment-methods')
      return response.data.paymentMethods || []
    } catch (error) {
      console.error('Get payment methods error:', error)
      return []
    }
  }

  async processPayment(paymentData: {
    planType: string
    paymentMethod: {
      type: 'card'
      card: {
        number: string
        expMonth: number
        expYear: number
        cvc: string
      }
    }
  }) {
    try {
      const response = await api.post('/payment/process-payment', paymentData)
      return response.data
    } catch (error) {
      console.error('Process payment error:', error)
      throw new Error('Payment processing failed')
    }
  }

  formatCardNumber(number: string): string {
    return number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  }

  validateCardNumber(number: string): boolean {
    const cleanNumber = number.replace(/\s/g, '')
    return /^\d{13,19}$/.test(cleanNumber) && this.luhnCheck(cleanNumber)
  }

  validateExpiryDate(expiry: string): boolean {
    const [month, year] = expiry.split('/')
    if (!month || !year) return false
    
    const expMonth = parseInt(month, 10)
    const expYear = parseInt(`20${year}`, 10)
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    
    return expMonth >= 1 && expMonth <= 12 && 
           (expYear > currentYear || (expYear === currentYear && expMonth >= currentMonth))
  }

  validateCVC(cvc: string): boolean {
    return /^\d{3,4}$/.test(cvc)
  }

  private luhnCheck(number: string): boolean {
    let sum = 0
    let alternate = false
    
    for (let i = number.length - 1; i >= 0; i--) {
      let n = parseInt(number.charAt(i), 10)
      
      if (alternate) {
        n *= 2
        if (n > 9) {
          n = (n % 10) + 1
        }
      }
      
      sum += n
      alternate = !alternate
    }
    
    return sum % 10 === 0
  }

  getCardBrand(number: string): string {
    const cleanNumber = number.replace(/\s/g, '')
    
    if (/^4/.test(cleanNumber)) return 'visa'
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard'
    if (/^3[47]/.test(cleanNumber)) return 'amex'
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover'
    
    return 'unknown'
  }
}

export const paymentService = new PaymentService()