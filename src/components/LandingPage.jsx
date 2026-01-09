import PropTypes from 'prop-types'

function LandingPage({ onStartScanning, error }) {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="logo-container">
          <div className="logo">
            <svg viewBox="0 0 100 100" className="aadhar-icon">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="35" r="15" fill="currentColor"/>
              <path d="M25 75 Q50 55 75 75" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
              <rect x="20" y="80" width="60" height="8" rx="4" fill="currentColor"/>
            </svg>
          </div>
        </div>
        
        <h1 className="title">Aadhar Scanner</h1>
        <p className="subtitle">
          Instantly scan and extract details from your Aadhar card QR code
        </p>

        {error && (
          <div className="error-banner">
            <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <button className="scan-button" onClick={onStartScanning}>
          <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
            <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
            <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
            <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
            <rect x="7" y="7" width="10" height="10" rx="1"/>
          </svg>
          Read Aadhar
        </button>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span>Secure & Private</span>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <span>Instant Results</span>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <span>Works Offline</span>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>Your data stays on your device. No information is sent to any server.</p>
      </div>
    </div>
  )
}

LandingPage.propTypes = {
  onStartScanning: PropTypes.func.isRequired,
  error: PropTypes.string
}

export default LandingPage

