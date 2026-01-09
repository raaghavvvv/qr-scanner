import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Html5Qrcode } from 'html5-qrcode'

function QRScanner({ onScanSuccess, onScanError, onCancel }) {
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [hasPermission, setHasPermission] = useState(true)

  useEffect(() => {
    const scannerId = 'qr-reader'
    html5QrCodeRef.current = new Html5Qrcode(scannerId)

    const startScanner = async () => {
      try {
        await html5QrCodeRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1
          },
          (decodedText) => {
            // Stop scanning on successful read
            html5QrCodeRef.current.stop().then(() => {
              onScanSuccess(decodedText)
            }).catch(console.error)
          },
          (errorMessage) => {
            // Ignore continuous scan errors
            if (onScanError) {
              onScanError(errorMessage)
            }
          }
        )
        setIsInitializing(false)
      } catch (err) {
        console.error('Failed to start scanner:', err)
        setHasPermission(false)
        setIsInitializing(false)
      }
    }

    startScanner()

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error)
      }
    }
  }, [onScanSuccess, onScanError])

  const handleCancel = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      await html5QrCodeRef.current.stop().catch(console.error)
    }
    onCancel()
  }

  return (
    <div className="scanner-page">
      <div className="scanner-header">
        <button className="back-button" onClick={handleCancel}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2>Scan Aadhar QR</h2>
        <div className="header-spacer"></div>
      </div>

      <div className="scanner-container">
        {isInitializing && (
          <div className="scanner-loading">
            <div className="spinner"></div>
            <p>Initializing camera...</p>
          </div>
        )}

        {!hasPermission && (
          <div className="permission-denied">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1l22 22"/>
              <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"/>
              <path d="M9.5 9.5A5 5 0 0 0 7 14a5 5 0 0 0 9.24 2.76"/>
            </svg>
            <h3>Camera Access Required</h3>
            <p>Please allow camera access to scan QR codes</p>
            <button className="retry-button" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        <div 
          id="qr-reader" 
          ref={scannerRef}
          className={`qr-reader ${isInitializing ? 'hidden' : ''}`}
        ></div>

        {!isInitializing && hasPermission && (
          <div className="scanner-overlay">
            <div className="scan-frame">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
              <div className="scan-line"></div>
            </div>
          </div>
        )}
      </div>

      <div className="scanner-instructions">
        <p>Position the QR code within the frame</p>
        <span className="hint">Found on the back of your Aadhar card</span>
      </div>

      <button className="cancel-button" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  )
}

QRScanner.propTypes = {
  onScanSuccess: PropTypes.func.isRequired,
  onScanError: PropTypes.func,
  onCancel: PropTypes.func.isRequired
}

export default QRScanner

