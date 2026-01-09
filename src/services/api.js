// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzYqsmnUl9Q4bMGfe5JDAoLlv7lX6gwOSrLRho5oVFztZKoidUZDMx0-F4yzBZI7kO5/exec'

/**
 * Save Aadhar data to Google Sheet via Google Apps Script
 * @param {Object} formData - The form data to save
 * @returns {Promise<Object>} API response
 */
export async function saveAadharData(formData) {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors', // Required for Google Apps Script
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })

  // With no-cors mode, we can't read the response, but if no error thrown, it worked
  return { success: true }
}

