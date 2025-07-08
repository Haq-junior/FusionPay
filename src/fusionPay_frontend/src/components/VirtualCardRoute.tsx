import React from 'react'
import { useNavigate } from 'react-router-dom'
import VirtualCardManager from './VirtualCardManager'

const VirtualCardRoute: React.FC = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return <VirtualCardManager onBack={handleBack} />
}

export default VirtualCardRoute
