# Open Positions System

This system allows you to easily manage and display job openings on the Hephaestus Engine page.

## Files

- **`open-positions.json`** - Contains all position data
- **`positions.js`** - JavaScript that loads and displays positions
- **`hephaestus.html`** - Updated to include the positions section
- **`hephaestus.css`** - Includes styling for position cards

## How to Edit Positions

### Adding a New Position

Open `open-positions.json` and add a new object to the `positions` array:

```json
{
  "id": 5,
  "title": "Your Position Title",
  "department": "Engine Development",
  "location": "Remote",
  "type": "Full-Time",
  "description": "Brief description of the role...",
  "requirements": [
    "First requirement",
    "Second requirement",
    "Third requirement"
  ],
  "isActive": true
}
```

### Editing an Existing Position

1. Find the position in `open-positions.json` by its `id` or `title`
2. Modify any field you want to change
3. Save the file

### Closing a Position

Set `"isActive": false` for any position that's no longer available. It will automatically show as "Filled" instead of "Open".

### Removing a Position

Simply delete the entire position object from the `positions` array in `open-positions.json`.

### Updating Contact Information

Edit these fields in `open-positions.json`:
- `contactEmail` - Email for position inquiries
- `applicationUrl` - URL for the application form

## Position Fields

- **id** (number) - Unique identifier for the position
- **title** (string) - Job title
- **department** (string) - Department name
- **location** (string) - Work location (Remote, Hybrid, On-site, etc.)
- **type** (string) - Employment type (Full-Time, Part-Time, Contract, etc.)
- **description** (string) - Brief overview of the role
- **requirements** (array) - List of job requirements
- **isActive** (boolean) - Whether the position is currently open

## Example Usage

The positions automatically load when the page loads. No additional setup needed!

### Manually Refresh Positions

If you need to reload positions dynamically (e.g., after updating the JSON):

```javascript
positionsManager.renderPositions('positions-container');
```

### Get Active Position Count

```javascript
const count = await positionsManager.getActiveCount();
console.log(`We have ${count} open positions`);
```

### Show All Positions (Including Inactive)

```javascript
positionsManager.renderPositions('positions-container', true);
```

## Customization

### Styling

All position styles are in `hephaestus.css` under the section:
```css
/* ===== OPEN POSITIONS SECTION ===== */
```

You can customize colors, spacing, fonts, etc. by modifying these styles.

### Custom Application URL per Position

To have different application URLs for each position, you can modify the `renderPositionCard` method in `positions.js` to use a `position.applicationUrl` field if provided.

## Notes

- Positions marked as `isActive: false` will still display but won't show the "Apply Now" button
- The system gracefully handles when there are no active positions
- All links support URL parameters (e.g., `?position=1` for tracking applications)
