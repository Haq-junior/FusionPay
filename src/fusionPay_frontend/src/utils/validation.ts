// Input validation utilities for FusionPay

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export class PaymentValidator {
  static validateAmount(amount: string | number, currency: string = 'GHS'): ValidationResult {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    
    if (isNaN(numAmount)) {
      return { isValid: false, error: 'Amount must be a valid number' }
    }
    
    if (numAmount <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' }
    }
    
    if (numAmount > 1000000) {
      return { isValid: false, error: 'Amount exceeds maximum limit' }
    }
    
    // Check decimal places based on currency
    const decimalPlaces = this.getDecimalPlaces(currency)
    const roundedAmount = Math.round(numAmount * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
    
    if (roundedAmount !== numAmount) {
      return { isValid: false, error: `Amount can have at most ${decimalPlaces} decimal places` }
    }
    
    return { isValid: true }
  }
  
  static validateCurrency(currency: string): ValidationResult {
    const supportedCurrencies = ['GHS', 'USD', 'EUR', 'ICP']
    
    if (!currency || typeof currency !== 'string') {
      return { isValid: false, error: 'Currency is required' }
    }
    
    if (!supportedCurrencies.includes(currency.toUpperCase())) {
      return { isValid: false, error: `Unsupported currency. Supported: ${supportedCurrencies.join(', ')}` }
    }
    
    return { isValid: true }
  }
  
  static validateDescription(description: string): ValidationResult {
    if (!description || typeof description !== 'string') {
      return { isValid: false, error: 'Description is required' }
    }
    
    if (description.trim().length < 3) {
      return { isValid: false, error: 'Description must be at least 3 characters' }
    }
    
    if (description.length > 200) {
      return { isValid: false, error: 'Description must not exceed 200 characters' }
    }
    
    // Check for potentially harmful content
    if (this.containsSuspiciousContent(description)) {
      return { isValid: false, error: 'Description contains invalid characters' }
    }
    
    return { isValid: true }
  }
  
  static validatePrincipal(principal: string): ValidationResult {
    if (!principal || typeof principal !== 'string') {
      return { isValid: false, error: 'Principal ID is required' }
    }
    
    // Basic principal format validation
    const principalRegex = /^[a-z0-9-]+$/
    if (!principalRegex.test(principal)) {
      return { isValid: false, error: 'Invalid principal format' }
    }
    
    if (principal.length < 5 || principal.length > 63) {
      return { isValid: false, error: 'Principal ID length is invalid' }
    }
    
    return { isValid: true }
  }
  
  private static getDecimalPlaces(currency: string): number {
    switch (currency.toUpperCase()) {
      case 'ICP':
        return 8 // ICP supports 8 decimal places
      case 'USD':
      case 'EUR':
      case 'GHS':
        return 2 // Fiat currencies typically use 2 decimal places
      default:
        return 2
    }
  }
  
  private static containsSuspiciousContent(text: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /\bexec\b/i,
      /\beval\b/i,
      /\balert\b/i,
    ]
    
    return suspiciousPatterns.some(pattern => pattern.test(text))
  }
}

export class CardValidator {
  static validateCardNumber(cardNumber: string): ValidationResult {
    if (!cardNumber || typeof cardNumber !== 'string') {
      return { isValid: false, error: 'Card number is required' }
    }
    
    // Remove spaces and dashes
    const cleanNumber = cardNumber.replace(/[\s-]/g, '')
    
    // Check if all characters are digits
    if (!/^\d+$/.test(cleanNumber)) {
      return { isValid: false, error: 'Card number must contain only digits' }
    }
    
    // Check length (13-19 digits for most cards)
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return { isValid: false, error: 'Card number must be between 13-19 digits' }
    }
    
    // Luhn algorithm validation
    if (!this.luhnCheck(cleanNumber)) {
      return { isValid: false, error: 'Invalid card number' }
    }
    
    return { isValid: true }
  }
  
  static validateCVV(cvv: string, cardType?: string): ValidationResult {
    if (!cvv || typeof cvv !== 'string') {
      return { isValid: false, error: 'CVV is required' }
    }
    
    if (!/^\d+$/.test(cvv)) {
      return { isValid: false, error: 'CVV must contain only digits' }
    }
    
    const expectedLength = cardType === 'AMEX' ? 4 : 3
    if (cvv.length !== expectedLength) {
      return { isValid: false, error: `CVV must be ${expectedLength} digits` }
    }
    
    return { isValid: true }
  }
  
  static validateExpiryDate(month: number, year: number): ValidationResult {
    if (!month || !year) {
      return { isValid: false, error: 'Expiry date is required' }
    }
    
    if (month < 1 || month > 12) {
      return { isValid: false, error: 'Invalid expiry month' }
    }
    
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { isValid: false, error: 'Card has expired' }
    }
    
    // Cards shouldn't be valid more than 10 years in the future
    if (year > currentYear + 10) {
      return { isValid: false, error: 'Invalid expiry year' }
    }
    
    return { isValid: true }
  }
  
  private static luhnCheck(cardNumber: string): boolean {
    let sum = 0
    let isEven = false
    
    // Process digits from right to left
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i])
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  }
}

export class FormValidator {
  static validateEmail(email: string): ValidationResult {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' }
    }
    
    return { isValid: true }
  }
  
  static validatePhone(phone: string): ValidationResult {
    if (!phone || typeof phone !== 'string') {
      return { isValid: false, error: 'Phone number is required' }
    }
    
    // Remove spaces, dashes, and parentheses
    const cleanPhone = phone.replace(/[\s()-]/g, '')
    
    // Check if it's a valid international format (starts with + and 7-15 digits)
    const internationalRegex = /^\+\d{7,15}$/
    if (!internationalRegex.test(cleanPhone)) {
      return { isValid: false, error: 'Invalid phone number format. Use international format (+233...)' }
    }
    
    return { isValid: true }
  }
  
  static validateRequired(value: any, fieldName: string): ValidationResult {
    if (value === null || value === undefined || value === '') {
      return { isValid: false, error: `${fieldName} is required` }
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      return { isValid: false, error: `${fieldName} is required` }
    }
    
    return { isValid: true }
  }
}

// Sanitization utilities
export class Sanitizer {
  static sanitizeText(text: string): string {
    if (typeof text !== 'string') return ''
    
    return text
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
  }
  
  static sanitizeAmount(amount: string): string {
    if (typeof amount !== 'string') return '0'
    
    // Keep only digits and decimal point
    return amount.replace(/[^\d.]/g, '')
  }
  
  static sanitizeCurrency(currency: string): string {
    if (typeof currency !== 'string') return ''
    
    // Keep only letters and convert to uppercase
    return currency.replace(/[^a-zA-Z]/g, '').toUpperCase()
  }
}

export default {
  PaymentValidator,
  CardValidator,
  FormValidator,
  Sanitizer,
}
