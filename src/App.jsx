import { useState } from 'react'
import QRScanner from './components/QRScanner'
import AadharForm from './components/AadharForm'
import LandingPage from './components/LandingPage'
import { parseAadharXML } from './utils/xmlParser'
import { saveAadharData } from './services/api'

const APP_STATES = {
  LANDING: 'landing',
  SCANNING: 'scanning',
  FORM: 'form'
}

function App() {
  const [appState, setAppState] = useState(APP_STATES.LANDING)
  const [aadharData, setAadharData] = useState(null)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStartScanning = () => {
    setError(null)
    setAppState(APP_STATES.SCANNING)
  }

  const handleScanSuccess = (decodedText) => {
    try {
      console.log('Scanned QR code data:', decodedText.substring(0, 200))
      const parsedData = parseAadharXML(decodedText)
      console.log('Parsed data:', parsedData)
      setAadharData(parsedData)
      setAppState(APP_STATES.FORM)
    } catch (err) {
      console.error('Parse error:', err)
      setError(`Invalid QR code format: ${err.message}. Please scan a valid Aadhar QR code.`)
      setAppState(APP_STATES.LANDING)
    }
  }

  const handleScanError = (errorMessage) => {
    console.error('Scan error:', errorMessage)
  }

  const handleCancelScan = () => {
    setAppState(APP_STATES.LANDING)
  }

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      await saveAadharData(formData)
      alert('Data saved successfully to Google Sheet!')
      setAppState(APP_STATES.LANDING)
      setAadharData(null)
    } catch (err) {
      console.error('Failed to save data:', err)
      alert(`Failed to save data: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToHome = () => {
    setAppState(APP_STATES.LANDING)
    setAadharData(null)
    setError(null)
  }

  return (
    <div className="app">
      <div className="app-container">
        {appState === APP_STATES.LANDING && (
          <LandingPage 
            onStartScanning={handleStartScanning} 
            error={error}
          />
        )}

        {appState === APP_STATES.SCANNING && (
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
            onCancel={handleCancelScan}
          />
        )}

        {appState === APP_STATES.FORM && aadharData && (
          <AadharForm
            data={aadharData}
            onSubmit={handleFormSubmit}
            onBack={handleBackToHome}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}

export default App

