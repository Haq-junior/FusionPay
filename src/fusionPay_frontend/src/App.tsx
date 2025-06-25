import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Dashboard from './components/Dashboard'
import PayNowSelection from './components/PayNowSelection'
import MoMoPaymentForm from './components/MoMoPaymentForm'
import VirtualCardManager from './components/VirtualCardManager'
import PaymentConfirmation from './components/PaymentConfirmation'
import PaymentStatus from './components/PaymentStatus'
import PaymentsPage from './components/PaymentsPage'
import HistoryPage from './components/HistoryPage'
import SettingsPage from './components/SettingsPage'
import SendICPPage from './components/SendICPPage'
import ReceivePage from './components/ReceivePage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="h-screen bg-gray-950 overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/pay-now" element={<PayNowSelection />} />
            <Route path="/send-icp" element={<SendICPPage />} />
            <Route path="/receive" element={<ReceivePage />} />
            <Route path="/pay-momo" element={<MoMoPaymentForm />} />
            <Route path="/virtual-card" element={<VirtualCardManager />} />
            <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App