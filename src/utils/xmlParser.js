/**
 * Parses Aadhar QR code XML data and extracts relevant fields
 * @param {string} xmlString - The XML string from QR code
 * @returns {Object} Parsed Aadhar data
 */
export function parseAadharXML(xmlString) {
  if (!xmlString || typeof xmlString !== 'string') {
    throw new Error('Invalid QR code data: Empty or invalid input')
  }

  // Clean the XML string - remove any leading/trailing whitespace
  let cleanedXml = xmlString.trim()
  
  // If it doesn't start with <?xml, try to find the XML part
  if (!cleanedXml.startsWith('<?xml') && !cleanedXml.startsWith('<PrintLetterBarcodeData')) {
    // Try to extract XML from the string
    const xmlMatch = cleanedXml.match(/<?xml[\s\S]*<\/PrintLetterBarcodeData>/i) || 
                     cleanedXml.match(/<PrintLetterBarcodeData[\s\S]*\/>/i)
    if (xmlMatch) {
      cleanedXml = xmlMatch[0]
    }
  }

  // If still no XML declaration, add it
  if (!cleanedXml.startsWith('<?xml')) {
    cleanedXml = '<?xml version="1.0" encoding="UTF-8"?>' + cleanedXml
  }

  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(cleanedXml, 'text/xml')
  
  // Check for parsing errors
  const parseError = xmlDoc.querySelector('parsererror')
  if (parseError) {
    const errorText = parseError.textContent || 'Unknown XML parsing error'
    console.error('XML Parse Error:', errorText)
    console.error('Original XML:', xmlString.substring(0, 200))
    throw new Error(`Invalid XML format: ${errorText.substring(0, 100)}`)
  }

  // Get the PrintLetterBarcodeData element
  const barcodeData = xmlDoc.querySelector('PrintLetterBarcodeData')
  if (!barcodeData) {
    console.error('No PrintLetterBarcodeData found in XML')
    console.error('XML content:', cleanedXml.substring(0, 500))
    throw new Error('Invalid Aadhar QR code format: Missing PrintLetterBarcodeData element')
  }

  // Extract all attributes
  const extractedData = {
    uid: barcodeData.getAttribute('uid') || '',
    name: barcodeData.getAttribute('name') || '',
    gender: barcodeData.getAttribute('gender') || '',
    yob: barcodeData.getAttribute('yob') || '',
    dob: barcodeData.getAttribute('dob') || '',
    careOf: barcodeData.getAttribute('co') || '',
    house: barcodeData.getAttribute('house') || '',
    street: barcodeData.getAttribute('street') || '',
    locality: barcodeData.getAttribute('loc') || '',
    vtc: barcodeData.getAttribute('vtc') || '',
    postOffice: barcodeData.getAttribute('po') || '',
    district: barcodeData.getAttribute('dist') || '',
    subDistrict: barcodeData.getAttribute('subdist') || '',
    state: barcodeData.getAttribute('state') || '',
    pincode: barcodeData.getAttribute('pc') || ''
  }

  return extractedData
}

/**
 * Formats UID for display (XXXX-XXXX-XXXX)
 * @param {string} uid - 12 digit UID
 * @returns {string} Formatted UID
 */
export function formatUID(uid) {
  if (!uid || uid.length !== 12) return uid
  return `${uid.slice(0, 4)}-${uid.slice(4, 8)}-${uid.slice(8, 12)}`
}

/**
 * Gets full gender string from abbreviation
 * @param {string} gender - Gender abbreviation (M/F/O)
 * @returns {string} Full gender string
 */
export function getFullGender(gender) {
  const genderMap = {
    'M': 'Male',
    'F': 'Female',
    'O': 'Other'
  }
  return genderMap[gender] || gender
}

/**
 * Calculates age from date of birth or year of birth
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @param {string} yob - Year of birth (fallback if dob not available)
 * @returns {number|string} Calculated age or 'N/A' if not calculable
 */
export function calculateAge(dob, yob) {
  const today = new Date()
  const currentYear = today.getFullYear()
  
  if (dob) {
    const birthDate = new Date(dob)
    let age = currentYear - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }
  
  if (yob) {
    // If only year is available, return approximate age
    return currentYear - parseInt(yob, 10)
  }
  
  return 'N/A'
}

