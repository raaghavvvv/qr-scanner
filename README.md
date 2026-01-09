# Aadhar Scanner

A React web application that scans Aadhar card QR codes and extracts personal information into a pre-filled form, with Google Sheets integration.

## Features

- 📷 **QR Code Scanner** - Uses device camera to scan Aadhar QR codes
- 📝 **Auto-filled Forms** - Automatically populates form fields from scanned data
- 📊 **Google Sheets Integration** - Saves submitted data directly to Google Sheets
- 🔒 **Privacy First** - All QR processing happens locally on device
- 📱 **Mobile Friendly** - Responsive design optimized for mobile devices
- ⚡ **Serverless** - Deploys seamlessly to Vercel

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool
- **html5-qrcode** - QR code scanning library
- **googleapis** - Google Sheets API
- **Vercel** - Serverless deployment

## Local Development

### Prerequisites

- Node.js 16+ installed
- npm package manager

### Installation

1. Clone this repository

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

> **Note**: The Google Sheets API won't work in local development since it requires the Vercel serverless function. To test locally, you can use `vercel dev` command after setting up Vercel CLI.

## Deploying to Vercel

### Step 1: Push to GitHub

Push this project to a GitHub repository.

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite and configure the build settings

### Step 3: Configure Environment Variables (Recommended for Production)

For production, set these environment variables in Vercel dashboard:

| Variable | Value |
|----------|-------|
| `GOOGLE_PROJECT_ID` | annular-heading-469408-k8 |
| `GOOGLE_PRIVATE_KEY_ID` | (your private key id) |
| `GOOGLE_PRIVATE_KEY` | (your private key - include newlines) |
| `GOOGLE_CLIENT_EMAIL` | auto-filled@annular-heading-469408-k8.iam.gserviceaccount.com |
| `GOOGLE_CLIENT_ID` | 108017452025638190556 |

> **Note**: The current setup has credentials embedded for quick deployment. For production, move them to environment variables.

### Step 4: Share Google Sheet

Share your Google Sheet with the service account email:

**Email**: `auto-filled@annular-heading-469408-k8.iam.gserviceaccount.com`

1. Open your Google Sheet
2. Click "Share" button
3. Add the email above with "Editor" permission
4. Click "Done"

### Step 5: Deploy

Click "Deploy" and Vercel will build and deploy your app!

## Project Structure

```
├── api/
│   └── save-aadhar.js      # Vercel serverless function
├── src/
│   ├── components/
│   │   ├── AadharForm.jsx  # Form with prefilled Aadhar data
│   │   ├── LandingPage.jsx # Home page with scan button
│   │   └── QRScanner.jsx   # Camera-based QR scanner
│   ├── services/
│   │   └── api.js          # API service functions
│   ├── utils/
│   │   └── xmlParser.js    # Aadhar XML parsing utilities
│   ├── styles/
│   │   └── index.css       # Global styles
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── vercel.json             # Vercel configuration
└── package.json
```

## QR Code Format

The app expects Aadhar QR codes in the standard XML format:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<PrintLetterBarcodeData 
  uid="XXXXXXXXXXXX" 
  name="Full Name" 
  gender="M/F/O" 
  yob="YYYY" 
  dob="YYYY-MM-DD"
  co="S/O: Parent Name" 
  house="House No" 
  street="Street Name" 
  loc="Locality" 
  vtc="Village/Town/City" 
  po="Post Office" 
  dist="District" 
  subdist="Sub District" 
  state="State" 
  pc="Pincode"
/>
```

## Google Sheet Columns

Data is saved with the following columns:
1. Timestamp
2. Aadhar UID
3. Name
4. Gender
5. DOB/YOB
6. Age
7. Care Of
8. House
9. Street
10. Locality
11. VTC
12. Post Office
13. District
14. Sub District
15. State
16. Pincode
17. Appointment Type

## License

MIT
