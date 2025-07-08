import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PaymentStatus from './PaymentStatus'

const PaymentStatusRoute: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const paymentData = location.state?.paymentData || {}

  const handleDismiss = () => {
    navigate('/dashboard')
  }

  const handleViewDetails = () => {
    navigate('/history')
  }

  const handleMakeAnother = () => {
    navigate('/pay-now')
  }

  return (
    <PaymentStatus
      paymentData={paymentData}
      onDismiss={handleDismiss}
      onViewDetails={handleViewDetails}
      onMakeAnother={handleMakeAnother}
    />
  )
}

export default PaymentStatusRoute
