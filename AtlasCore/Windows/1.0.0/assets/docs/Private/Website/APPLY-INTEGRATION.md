# Application Form Integration Guide

The application form is now fully integrated with **Web3Forms**.

## Current Setup

- **Endpoint:** `https://api.web3forms.com/submit`
- **Access Key:** `7877854f-7a7b-492b-90b8-b1fe2d02d29c`
- **Implementation:** The JavaScript in `apply.js` sends a JSON payload directly to Web3Forms and displays inline success/error messages.

### What Gets Sent

| Field | Web3Forms Payload Key |
| --- | --- |
| Selected position ID | `position_id` |
| Selected position title | `position_title` |
| Applicant name | `name` |
| Applicant email | `email` |
| Discord username | `discord` |
| GitHub profile | `github` |
| Portfolio | `portfolio` |
| Experience level | `experience_level` |
| Weekly availability | `availability` |
| Why join | `why_join` |
| Relevant experience | `relevant_experience` |
| Learning goals | `learning_goals` |
| Additional info | `additional_info` |
| Volunteer agreement | `volunteer_agreement` |
| Submitted timestamp | `submitted_at` |
| Page URL | `page_url` |

The email you receive from Web3Forms will contain all of these fields.

## Testing the Integration

1. Open `apply.html` in the browser.
2. Select a position, fill out the form, and submit.
3. You should see a green success banner and receive an email at the address configured inside your Web3Forms dashboard.
4. If something fails you'll see a red error banner. The error text comes directly from Web3Forms, making it easy to debug.

## Customizing

### Change the Access Key
1. Open `apply.html` and update the hidden `access_key` input.
2. Open `apply.js` and update `this.web3FormsAccessKey` in the constructor.

Both values must match your Web3Forms account.

### Change the Confirmation Message
Edit the success text inside `handleSubmit` in `apply.js`.

### Add/Edit Form Fields
1. Update the form markup in `apply.html`.
2. Mirror the changes in `handleSubmit` (collecting the field value) and `submitToWeb3Forms` (adding the payload key).

## Optional Enhancements

- **Spam protection:** Enable Web3Forms honey pot or reCAPTCHA from their dashboard.
- **Custom email subject:** Adjust the subject line in `submitToWeb3Forms`.
- **Multiple recipients:** Configure forwarding rules inside Web3Forms.
- **Redirect after submit:** Replace the inline success banner with a redirect by removing `e.preventDefault()` in `handleSubmit` and letting the native form submission occur.

## Switching Providers

If you later decide to use another service (Formspree, EmailJS, Netlify Forms, custom backend, etc.), replace the `submitToWeb3Forms` implementation with the provider-specific logic. The rest of the page structure can remain unchanged.
