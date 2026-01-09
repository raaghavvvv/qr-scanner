import { useState } from 'react'
import PropTypes from 'prop-types'
import { formatUID, getFullGender, calculateAge } from '../utils/xmlParser'

const APPOINTMENT_OPTIONS = [
  { value: '', label: 'Select appointment type' },
  { value: 'address_update', label: 'Address Update' },
  { value: 'mobile_update', label: 'Mobile Number Update' },
  { value: 'biometric_update', label: 'Biometric Update' },
  { value: 'name_correction', label: 'Name Correction' },
  { value: 'dob_correction', label: 'Date of Birth Correction' },
  { value: 'gender_correction', label: 'Gender Correction' },
  { value: 'new_enrollment', label: 'New Enrollment' },
  { value: 'duplicate_card', label: 'Duplicate Aadhar Card' },
  { value: 'pvc_card', label: 'PVC Aadhar Card Request' },
  { value: 'other', label: 'Other Services' }
]

function AadharForm({ data, onSubmit, onBack, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    ...data,
    appointmentType: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.appointmentType) {
      alert('Please select an appointment type')
      return
    }
    // Include calculated age in submission
    const age = calculateAge(formData.dob, formData.yob)
    onSubmit({ ...formData, age })
  }

  const buildFullAddress = () => {
    const parts = [
      data.house,
      data.street,
      data.locality,
      data.vtc,
      data.subDistrict !== data.district ? data.subDistrict : null,
      data.district,
      data.state,
      data.pincode
    ].filter(Boolean)
    return parts.join(', ')
  }

  return (
    <div className="form-page">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2>Aadhar Details</h2>
        <div className="header-spacer"></div>
      </div>

      <form className="aadhar-form" onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="card-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <h3>Personal Information</h3>
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="uid">Aadhar Number (UID)</label>
              <input
                type="text"
                id="uid"
                name="uid"
                value={formatUID(formData.uid)}
                readOnly
                className="readonly"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="careOf">Care Of</label>
              <input
                type="text"
                id="careOf"
                name="careOf"
                value={formData.careOf}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={getFullGender(formData.gender)}
                readOnly
                className="readonly"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="text"
                id="dob"
                name="dob"
                value={formData.dob || `Year: ${formData.yob}`}
                readOnly
                className="readonly"
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="text"
                id="age"
                name="age"
                value={`${calculateAge(formData.dob, formData.yob)} years`}
                readOnly
                className="readonly"
              />
            </div>
          </div>
        </div>

        <div className="form-card">
          <div className="card-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <h3>Address Details</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="house">House/Building</label>
              <input
                type="text"
                id="house"
                name="house"
                value={formData.house}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="street">Street</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="locality">Locality</label>
              <input
                type="text"
                id="locality"
                name="locality"
                value={formData.locality}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="vtc">Village/Town/City</label>
              <input
                type="text"
                id="vtc"
                name="vtc"
                value={formData.vtc}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="postOffice">Post Office</label>
              <input
                type="text"
                id="postOffice"
                name="postOffice"
                value={formData.postOffice}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="district">District</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pincode">PIN Code</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Full Address</label>
              <textarea
                readOnly
                className="readonly address-preview"
                value={buildFullAddress()}
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="form-card highlight">
          <div className="card-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h3>Appointment Details</h3>
          </div>

          <div className="form-group">
            <label htmlFor="appointmentType">Need of Appointment *</label>
            <select
              id="appointmentType"
              name="appointmentType"
              value={formData.appointmentType}
              onChange={handleInputChange}
              required
            >
              {APPOINTMENT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="secondary-button" 
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </button>
          <button 
            type="submit" 
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

AadharForm.propTypes = {
  data: PropTypes.shape({
    uid: PropTypes.string,
    name: PropTypes.string,
    gender: PropTypes.string,
    yob: PropTypes.string,
    dob: PropTypes.string,
    careOf: PropTypes.string,
    house: PropTypes.string,
    street: PropTypes.string,
    locality: PropTypes.string,
    vtc: PropTypes.string,
    postOffice: PropTypes.string,
    district: PropTypes.string,
    subDistrict: PropTypes.string,
    state: PropTypes.string,
    pincode: PropTypes.string
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool
}

export default AadharForm

