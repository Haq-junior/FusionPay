import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PaymentConfirmation from './PaymentConfirmation'

const PaymentConfirmationRoute: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const paymentData = location.state?.formData || {}

  const handleBack = () => {
    navigate(-1)
  }

  const handleConfirm = () => {
    navigate('/payment-status', { state: { paymentData } })
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <PaymentConfirmation
      paymentData={paymentData}
      onBack={handleBack}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  )
}

export default PaymentConfirmationRoute
