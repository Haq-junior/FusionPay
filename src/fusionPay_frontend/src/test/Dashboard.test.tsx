import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import Dashboard from '../components/Dashboard'

// Mock the hooks
vi.mock('../utils/useBackend', () => ({
  useBackend: () => ({
    getUserPayments: vi.fn().mockResolvedValue([]),
    getUserCards: vi.fn().mockResolvedValue([]),
    formatPaymentAmount: vi.fn((amount: number, currency: string) => `${amount} ${currency}`),
    formatTimestamp: vi.fn(() => '2025-07-07'),
    getPaymentStatusText: vi.fn(() => 'Completed'),
    getPaymentTypeText: vi.fn(() => 'Card'),
    isLoading: false,
    error: null,
  }),
}))

vi.mock('../utils/priceService', () => ({
  usePriceData: () => ({
    getCurrentPrice: vi.fn(() => 5.0),
    convertFromICP: vi.fn(() => 100),
    refreshPrices: vi.fn(),
    isLoading: false,
  }),
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Dashboard', () => {
  it('renders loading state when user is not authenticated', () => {
    renderWithProviders(<Dashboard />)
    // Since Dashboard shows LoginPrompt when not authenticated
    expect(screen.getByText(/connect/i)).toBeInTheDocument()
  })

  it('renders dashboard content for authenticated users', async () => {
    // This would require mocking the auth context to return authenticated state
    renderWithProviders(<Dashboard />)
    // Add assertions based on actual component behavior
  })

  it('displays error message when backend fails', () => {
    // Mock error state and test error handling
    renderWithProviders(<Dashboard />)
    // Add error state assertions
  })
})
