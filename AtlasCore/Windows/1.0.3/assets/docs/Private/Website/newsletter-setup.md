# Newsletter Google Apps Script Setup

## Overview
This document explains how to connect your HTML newsletter form to Google Apps Script to store email subscriptions in a Google Spreadsheet.

## Google Apps Script Code

Here's the complete Google Apps Script code you should use:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet (or specify by ID)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Alternative: Use specific spreadsheet by ID
    // var sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getSheetByName('Sheet1');
    
    // Parse the form data
    var email = e.parameter.email;
    var timestamp = e.parameter.timestamp || new Date().toISOString();
    
    // Validate email
    if (!email || !validateEmail(email)) {
      return ContentService.createTextOutput(
        JSON.stringify({ result: 'error', message: 'Invalid email address' })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Check if email already exists
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === email) {
        return ContentService.createTextOutput(
          JSON.stringify({ result: 'success', message: 'Already subscribed' })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Email', 'Timestamp', 'Source']);
    }
    
    // Append the new subscription
    sheet.appendRow([email, timestamp, 'Website Newsletter']);
    
    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'success', message: 'Successfully subscribed' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error and return error response
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Optional: Test function to verify the script works
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'Newsletter API is running' })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

## Deployment Steps

### 1. Create/Open Your Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Open your newsletter spreadsheet (or create a new one)
3. The script will automatically create headers: `Email`, `Timestamp`, `Source`

### 2. Open Apps Script Editor
1. In your spreadsheet, click **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Paste the Google Apps Script code above
4. Click **Save** (💾 icon) and give it a name like "Newsletter Handler"

### 3. Deploy as Web App
1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Newsletter Subscription API" (or whatever you prefer)
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Authorize access** (you may need to click "Advanced" > "Go to [Project Name]")
7. Copy the **Web app URL** that appears - it will look like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

### 4. Update Your Website Code
1. Open `script.js` in your website
2. Find this line (around line 95):
   ```javascript
   var SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace it with your actual web app URL:
   ```javascript
   var SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
4. Save the file

### 5. Test the Integration
1. Open your website in a browser
2. Navigate to the newsletter section
3. Enter a test email address
4. Click "Subscribe"
5. Check your Google Spreadsheet to verify the email was added

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure:
- The web app is deployed with "Who has access" set to **Anyone**
- You're using the `/exec` URL (not `/dev`)

### Email Not Appearing
- Check the Apps Script execution logs: **Executions** tab in Apps Script editor
- Verify the spreadsheet is the correct one
- Make sure the script has permission to access the spreadsheet

### Re-deploying After Changes
If you modify the Apps Script:
1. Click **Deploy** > **Manage deployments**
2. Click the pencil icon ✏️ next to your deployment
3. Change the version to **New version**
4. Click **Deploy**
5. The URL stays the same, no need to update your website

## Security Considerations

- The script validates email format before storing
- Duplicate emails are detected and handled gracefully
- All errors are caught and logged
- Consider adding rate limiting if you expect high traffic

## Optional Enhancements

### Email Confirmation (requires additional setup)
You could extend the script to send confirmation emails using `MailApp`:
```javascript
MailApp.sendEmail({
  to: email,
  subject: "Welcome to Olympus Studios Newsletter",
  body: "Thanks for subscribing! You'll receive updates about our games."
});
```

### Data Export
You can export your subscriber list anytime from Google Sheets as CSV or Excel.

## Support

If you encounter issues:
1. Check the Apps Script execution logs
2. Verify the deployment settings
3. Test the endpoint directly by visiting the URL in a browser (should return `{"status":"Newsletter API is running"}`)
