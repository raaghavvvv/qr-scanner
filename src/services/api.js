// Google Apps Script Web App URL
// IMPORTANT: You need the WEB APP deployment URL, not the library URL
// Format: https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
// 
// To get the correct URL:
// 1. Open your Google Sheet
// 2. Go to Extensions → Apps Script
// 3. Click "Deploy" → "Manage deployments"
// 4. If you see an existing web app deployment, click the copy icon next to the URL
// 5. OR create a new deployment: "Deploy" → "New deployment" → Type: "Web app"
//    - Execute as: Me
//    - Who has access: Anyone
//    - Click "Deploy" and copy the Web app URL
//
// The URL should end with /exec (NOT /library/d/...)
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

