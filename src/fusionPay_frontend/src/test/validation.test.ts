import { describe, it, expect } from 'vitest'
import { PaymentValidator, CardValidator, Sanitizer } from '../utils/validation'

describe('PaymentValidator', () => {
  describe('validateAmount', () => {
    it('should validate positive amounts', () => {
      const result = PaymentValidator.validateAmount(100, 'GHS')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject negative amounts', () => {
      const result = PaymentValidator.validateAmount(-10, 'GHS')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Amount must be greater than 0')
    })

    it('should reject zero amounts', () => {
      const result = PaymentValidator.validateAmount(0, 'GHS')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Amount must be greater than 0')
    })

    it('should reject amounts exceeding maximum limit', () => {
      const result = PaymentValidator.validateAmount(2000000, 'GHS')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Amount exceeds maximum limit')
    })

    it('should reject invalid number strings', () => {
      const result = PaymentValidator.validateAmount('invalid', 'GHS')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Amount must be a valid number')
    })

    it('should validate string amounts', () => {
      const result = PaymentValidator.validateAmount('100.50', 'GHS')
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateCurrency', () => {
    it('should validate supported currencies', () => {
      const result = PaymentValidator.validateCurrency('GHS')
      expect(result.isValid).toBe(true)
    })

    it('should reject unsupported currencies', () => {
      const result = PaymentValidator.validateCurrency('XYZ')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Unsupported currency')
    })

    it('should handle case insensitive currencies', () => {
      const result = PaymentValidator.validateCurrency('ghs')
      expect(result.isValid).toBe(true)
    })

    it('should reject empty currency', () => {
      const result = PaymentValidator.validateCurrency('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Currency is required')
    })
  })

  describe('validateDescription', () => {
    it('should validate normal descriptions', () => {
      const result = PaymentValidator.validateDescription('Payment for services')
      expect(result.isValid).toBe(true)
    })

    it('should reject empty descriptions', () => {
      const result = PaymentValidator.validateDescription('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Description is required')
    })

    it('should reject too long descriptions', () => {
      const longDesc = 'a'.repeat(1001)
      const result = PaymentValidator.validateDescription(longDesc)
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Description must be less than 1000 characters')
    })
  })
})

describe('CardValidator', () => {
  describe('validateCardNumber', () => {
    it('should validate valid card numbers', () => {
      // Valid Visa test card number
      const result = CardValidator.validateCardNumber('4111111111111111')
      expect(result.isValid).toBe(true)
    })

    it('should reject invalid card numbers', () => {
      const result = CardValidator.validateCardNumber('1234567890123456')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invalid card number')
    })

    it('should reject card numbers with non-digits', () => {
      const result = CardValidator.validateCardNumber('411111111111111a')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Card number must contain only digits')
    })

    it('should reject card numbers too short', () => {
      const result = CardValidator.validateCardNumber('123456789012')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Card number must be between 13-19 digits')
    })
  })

  describe('validateCVV', () => {
    it('should validate 3-digit CVV', () => {
      const result = CardValidator.validateCVV('123')
      expect(result.isValid).toBe(true)
    })

    it('should validate 4-digit CVV for Amex', () => {
      const result = CardValidator.validateCVV('1234', 'amex')
      expect(result.isValid).toBe(true)
    })

    it('should reject CVV with non-digits', () => {
      const result = CardValidator.validateCVV('12a')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('CVV must contain only digits')
    })

    it('should reject empty CVV', () => {
      const result = CardValidator.validateCVV('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('CVV is required')
    })
  })
})

describe('Sanitizer', () => {
  describe('sanitizeText', () => {
    it('should remove HTML tags', () => {
      const result = Sanitizer.sanitizeText('<script>alert("test")</script>')
      expect(result).toBe('alert("test")')
    })

    it('should remove javascript protocols', () => {
      const result = Sanitizer.sanitizeText('javascript:alert("test")')
      expect(result).toBe('alert("test")')
    })

    it('should remove event handlers', () => {
      const result = Sanitizer.sanitizeText('onclick="alert()"')
      expect(result).toBe('')
    })

    it('should trim whitespace', () => {
      const result = Sanitizer.sanitizeText('  test  ')
      expect(result).toBe('test')
    })

    it('should handle non-string input', () => {
      const result = Sanitizer.sanitizeText(123 as any)
      expect(result).toBe('')
    })
  })

  describe('sanitizeAmount', () => {
    it('should keep only digits and decimal point', () => {
      const result = Sanitizer.sanitizeAmount('$100.50')
      expect(result).toBe('100.50')
    })

    it('should handle non-string input', () => {
      const result = Sanitizer.sanitizeAmount(123 as any)
      expect(result).toBe('0')
    })
  })

  describe('sanitizeCurrency', () => {
    it('should keep only letters and convert to uppercase', () => {
      const result = Sanitizer.sanitizeCurrency('ghs123')
      expect(result).toBe('GHS')
    })

    it('should handle non-string input', () => {
      const result = Sanitizer.sanitizeCurrency(123 as any)
      expect(result).toBe('')
    })
  })
})
