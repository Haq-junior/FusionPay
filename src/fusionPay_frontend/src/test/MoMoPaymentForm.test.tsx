import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MoMoPaymentForm from '../components/MoMoPaymentForm'

// Mock the modules
vi.mock('../utils/priceService', () => ({
  usePriceData: vi.fn(() => ({
    getCurrentPrice: vi.fn(() => 5.0),
    refreshPrices: vi.fn(),
    isLoading: false,
  })),
}))

vi.mock('gsap', () => ({
  gsap: {
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
    })),
  },
}))

const renderMoMoPaymentForm = () => {
  return render(
    <BrowserRouter>
      <MoMoPaymentForm />
    </BrowserRouter>
  )
}

describe('MoMoPaymentForm', () => {
  it('renders all form fields', () => {
    renderMoMoPaymentForm()
    
    expect(screen.getByLabelText(/recipient mobile number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mobile money network/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/amount to send/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/recipient name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/purpose/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    renderMoMoPaymentForm()
    
    const phoneInput = screen.getByLabelText(/recipient mobile number/i)
    const amountInput = screen.getByLabelText(/amount to send/i)
    
    // Trigger validation by focusing and blurring
    fireEvent.focus(phoneInput)
    fireEvent.blur(phoneInput)
    
    fireEvent.focus(amountInput)
    fireEvent.blur(amountInput)
    
    await waitFor(() => {
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument()
      expect(screen.getByText(/amount must be a valid number/i)).toBeInTheDocument()
    })
  })

  it('formats phone number correctly', () => {
    renderMoMoPaymentForm()
    
    const phoneInput = screen.getByLabelText(/recipient mobile number/i) as HTMLInputElement
    
    fireEvent.change(phoneInput, { target: { value: '0241234567' } })
    
    expect(phoneInput.value).toBe('024 123 4567')
  })

  it('validates amount input', async () => {
    renderMoMoPaymentForm()
    
    const amountInput = screen.getByLabelText(/amount to send/i)
    
    // Test negative amount
    fireEvent.change(amountInput, { target: { value: '-10' } })
    fireEvent.blur(amountInput)
    
    await waitFor(() => {
      expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument()
    })
    
    // Test valid amount
    fireEvent.change(amountInput, { target: { value: '100' } })
    fireEvent.blur(amountInput)
    
    await waitFor(() => {
      expect(screen.queryByText(/amount must be greater than 0/i)).not.toBeInTheDocument()
    })
  })

  it('shows network selection options', () => {
    renderMoMoPaymentForm()
    
    const networkSelect = screen.getByLabelText(/mobile money network/i)
    
    expect(networkSelect).toContainHTML('MTN Mobile Money')
    expect(networkSelect).toContainHTML('Vodafone Cash')
    expect(networkSelect).toContainHTML('AirtelTigo Money')
  })

  it('calculates ICP deduction when valid amount is entered', async () => {
    renderMoMoPaymentForm()
    
    const amountInput = screen.getByLabelText(/amount to send/i)
    const networkSelect = screen.getByLabelText(/mobile money network/i)
    const phoneInput = screen.getByLabelText(/recipient mobile number/i)
    
    // Fill in required fields
    fireEvent.change(phoneInput, { target: { value: '0241234567' } })
    fireEvent.change(networkSelect, { target: { value: 'mtn' } })
    fireEvent.change(amountInput, { target: { value: '100' } })
    
    // ICP calculation should be triggered
    await waitFor(() => {
      expect(screen.getByText(/icp deduction/i)).toBeInTheDocument()
    })
  })

  it('disables continue button when form is invalid', () => {
    renderMoMoPaymentForm()
    
    const continueButton = screen.getByRole('button', { name: /continue/i })
    
    expect(continueButton).toBeDisabled()
  })

  it('enables continue button when form is valid', async () => {
    renderMoMoPaymentForm()
    
    const phoneInput = screen.getByLabelText(/recipient mobile number/i)
    const networkSelect = screen.getByLabelText(/mobile money network/i)
    const amountInput = screen.getByLabelText(/amount to send/i)
    const nameInput = screen.getByLabelText(/recipient name/i)
    const purposeInput = screen.getByLabelText(/purpose/i)
    
    // Fill in all required fields
    fireEvent.change(phoneInput, { target: { value: '0241234567' } })
    fireEvent.change(networkSelect, { target: { value: 'mtn' } })
    fireEvent.change(amountInput, { target: { value: '100' } })
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(purposeInput, { target: { value: 'Payment for services' } })
    
    await waitFor(() => {
      const continueButton = screen.getByRole('button', { name: /continue/i })
      expect(continueButton).not.toBeDisabled()
    })
  })
})
