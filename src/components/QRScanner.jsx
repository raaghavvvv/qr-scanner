import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Html5Qrcode } from 'html5-qrcode'

function QRScanner({ onScanSuccess, onScanError, onCancel }) {
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [hasPermission, setHasPermission] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const scannerId = 'qr-reader'
    
    // Wait for DOM element to be ready
    const initScanner = async () => {
      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const element = document.getElementById(scannerId)
      if (!element) {
        console.error('Scanner element not found')
        setError('Scanner element not found')
        setIsInitializing(false)
        setHasPermission(false)
        return
      }

      try {
        html5QrCodeRef.current = new Html5Qrcode(scannerId)
        
        const startScanner = async () => {
          try {
            // Request camera permissions first
            const devices = await Html5Qrcode.getCameras()
            if (devices && devices.length === 0) {
              throw new Error('No cameras found')
            }

            // Find back camera (environment) or use first available
            let cameraId = null
            for (const device of devices) {
              if (device.label.toLowerCase().includes('back') || 
                  device.label.toLowerCase().includes('rear') ||
                  device.label.toLowerCase().includes('environment')) {
                cameraId = device.id
                break
              }
            }
            
            // If no back camera found, use first available
            if (!cameraId && devices.length > 0) {
              cameraId = devices[0].id
            }

            const config = {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1,
              videoConstraints: {
                facingMode: 'environment'
              }
            }

            await html5QrCodeRef.current.start(
              cameraId || { facingMode: 'environment' },
              config,
              (decodedText) => {
                // Stop scanning on successful read
                if (html5QrCodeRef.current) {
                  html5QrCodeRef.current.stop().then(() => {
                    onScanSuccess(decodedText)
                  }).catch(console.error)
                }
              },
              (errorMessage) => {
                // Ignore continuous scan errors (not found, etc.)
                // Only log actual errors
                if (errorMessage && !errorMessage.includes('NotFoundException')) {
                  console.log('Scan error:', errorMessage)
                }
              }
            )
            // Successfully started - camera is working
            setIsInitializing(false)
            setError(null)
            setHasPermission(true)
          } catch (err) {
            console.error('Failed to start scanner:', err)
            // Only show permission error for actual permission issues
            const isPermissionError = err.message.includes('Permission') || 
                                     err.message.includes('NotAllowedError') ||
                                     err.message.includes('NotReadableError') ||
                                     err.name === 'NotAllowedError' ||
                                     err.name === 'NotReadableError'
            
            if (isPermissionError) {
              setError(err.message)
              setHasPermission(false)
            } else {
              // For other errors, try to continue - might still work
              setError(null)
              setHasPermission(true)
            }
            setIsInitializing(false)
          }
        }

        startScanner()
      } catch (err) {
        console.error('Failed to initialize scanner:', err)
        // Only show error for actual permission issues
        const isPermissionError = err.message.includes('Permission') || 
                                 err.message.includes('NotAllowedError') ||
                                 err.message.includes('NotReadableError')
        if (isPermissionError) {
          setError(err.message)
          setHasPermission(false)
        } else {
          setError(null)
          setHasPermission(true)
        }
        setIsInitializing(false)
      }
    }

    initScanner()

    return () => {
      const stopScanner = async () => {
        if (html5QrCodeRef.current) {
          try {
            if (html5QrCodeRef.current.isScanning) {
              await html5QrCodeRef.current.stop()
            }
            await html5QrCodeRef.current.clear()
          } catch (err) {
            console.error('Error stopping scanner:', err)
          }
        }
      }
      stopScanner()
    }
  }, [onScanSuccess, onScanError])

  const handleCancel = async () => {
    try {
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop()
        }
        await html5QrCodeRef.current.clear()
      }
    } catch (err) {
      console.error('Error stopping scanner:', err)
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
          <div className="scanner-loading" style={{ position: 'absolute', zIndex: 10 }}>
            <div className="spinner"></div>
            <p>Initializing camera...</p>
          </div>
        )}

        {!hasPermission && !isInitializing && error && (
          <div className="permission-denied">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 1l22 22"/>
              <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"/>
              <path d="M9.5 9.5A5 5 0 0 0 7 14a5 5 0 0 0 9.24 2.76"/>
            </svg>
            <h3>Camera Access Required</h3>
            <p>{error || 'Please allow camera access to scan QR codes'}</p>
            <button 
              className="retry-button" 
              onClick={() => {
                setIsInitializing(true)
                setHasPermission(true)
                setError(null)
                window.location.reload()
              }}
            >
              Try Again
            </button>
          </div>
        )}

        <div 
          id="qr-reader" 
          ref={scannerRef}
          className="qr-reader"
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

