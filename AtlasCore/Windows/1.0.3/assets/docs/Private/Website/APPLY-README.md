# Apply Page - Quick Start Guide

## What's Been Created

A complete application system for volunteer positions on the Hephaestus Engine page.

### Files Created:
1. **`apply.html`** - The application form page
2. **`apply.css`** - Styling for the apply page
3. **`apply.js`** - Form handling and validation logic
4. **`APPLY-INTEGRATION.md`** - Guide for connecting to email services

### Files Modified:
- **`open-positions.json`** - Updated applicationUrl to point to `apply.html`

## How It Works

1. **Position Selection**: Users select which position they're applying for from a dropdown that loads from `open-positions.json`

2. **Dynamic Details**: When a position is selected, the job details appear below the dropdown

3. **Application Form**: Users fill out:
   - Personal information (name, email, Discord, GitHub, portfolio)
   - Experience level and availability
   - Why they want to join
   - Relevant experience
   - Learning goals
   - Additional information

4. **Validation**: Form validates required fields and requires agreement checkbox

5. **Submission**: Sends the completed application to Web3Forms, which emails the details to your configured inbox

## URL Parameters

You can link directly to a specific position:
- `apply.html?position=1` - C++ Engine Programmer
- `apply.html?position=2` - Graphics Programmer
- `apply.html?position=3` - Gameplay Programmer (Lua)
- `apply.html?position=4` - Tools & Editor Developer

The form will auto-select that position and show its details.

## Features

✅ Responsive design - works on mobile, tablet, desktop
✅ Matches your site's visual style
✅ Prominent volunteer/unpaid notice
✅ Interactive position cards on the apply page
✅ Position details displayed before applying
✅ Form validation
✅ Success/error messages
✅ Web3Forms email integration out of the box
✅ Accessible (keyboard navigation, ARIA labels)
✅ Back to positions link

## Testing Locally

1. Open `apply.html` in your browser
2. Select a position
3. Fill out the form
4. Submit
5. Confirm you see the success banner and verify the Web3Forms email arrives in your inbox

## Next Steps

1. Update the Web3Forms access key in `apply.html` and `apply.js` to match your account (see `APPLY-INTEGRATION.md`).
2. Configure spam protection and notification settings inside the Web3Forms dashboard.
3. Customize the confirmation messaging or add extra fields as needed.

## Customization

### Change Form Fields
Edit the form in `apply.html` - add/remove fields as needed

### Modify Styling
Edit `apply.css` - all colors use CSS variables from `style.css`

### Adjust Validation
Modify `apply.js` - the `handleSubmit` method contains validation logic

### Update Notice Text
Edit the notice in `open-positions.json` or modify the HTML in `apply.html`

## Email Contact Fallback

If users have issues with the form, they can always email directly to the address specified in `open-positions.json` (currently: careers@olympusstudios.com)

## Support

All applications include:
- Timestamp
- Position applied for
- Full contact details
- Experience and availability
- Detailed responses to why/experience/goals questions
- Confirmation of volunteer agreement

This data can be sent via email, stored in a database, or saved to Google Sheets depending on your integration choice.
