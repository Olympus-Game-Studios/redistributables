# Devlog Template Guide

Welcome to the Olympus Studios devlog template! This guide will help you create beautiful, consistent devlog posts for our website.

## Quick Start

1. **Copy the template**: Make a copy of `devlog-template.html` in the `devlogs` folder (not in templates)
2. **Rename the file**: Use a descriptive name like `2025-11-10-feature-name.html`
3. **Edit the content**: Search for `TODO` comments and replace placeholder text
4. **Preview**: Open your file in a browser to see how it looks
5. **Publish**: Move or commit your file when ready

## Template Structure

### Header Section (Lines 1-20)
- **Title**: Update the `<title>` tag with your devlog title
- **Description**: Add a brief meta description for SEO

### Hero Section (Lines 27-47)
- **Badge**: Change the badge text (e.g., "Dev Update", "Feature Spotlight", "Progress Report")
- **Title**: Your main devlog heading
- **Date & Author**: Update with the current date and your name
- **Tagline**: Optional subtitle or summary

### Content Sections (Lines 50-160)
The template includes several pre-built sections:

1. **Introduction**: Opening paragraph
2. **Main Content Sections**: 3 customizable sections for your content
3. **Technical Details**: Optional technical deep-dive
4. **What's Next**: Upcoming features/plans
5. **Conclusion**: Wrap-up and thanks
6. **Call to Action**: Links to projects and contact

### Available Content Elements

#### Text Formatting
```html
<p>Regular paragraph text</p>
<strong>Bold text for emphasis</strong>
```

#### Headings
```html
<h2>Main Section Title</h2>
<h3>Subsection Title</h3>
```

#### Lists
```html
<!-- Unordered list -->
<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>

<!-- Ordered list -->
<ol>
  <li>Step one</li>
  <li>Step two</li>
</ol>
```

#### Images
```html
<figure class="devlog-image">
  <img src="../assets/images/devlog/your-image.png" alt="Description" />
  <figcaption>Optional image caption</figcaption>
</figure>
```

#### Blockquotes
```html
<blockquote class="devlog-quote">
  "An important quote or key takeaway"
</blockquote>
```

#### Technical Sections
```html
<div class="devlog-section devlog-technical">
  <h2>Technical Details</h2>
  <p>Technical content with highlighted background...</p>
</div>
```

## File Paths

When your devlog is in the `devlogs` folder:
- Stylesheets: `../style.css`
- Scripts: `../navbar.js`, `../footer.js`
- Images: `../assets/images/devlog/your-image.png`
- Logos: `../assets/logos/Logo.svg`

## Best Practices

### Writing Tips
- **Be conversational**: Write like you're talking to fellow developers
- **Use visuals**: Break up text with images, especially for new features
- **Highlight key points**: Use lists and bold text for important info
- **Keep it scannable**: Use headings and short paragraphs

### Technical Considerations
- **Image sizes**: Optimize images before adding (recommended max width: 1600px)
- **Alt text**: Always add descriptive alt text for accessibility
- **Links**: Use relative paths for internal links
- **Mobile**: The template is mobile-responsive by default

### Suggested Devlog Types

1. **Progress Updates**: General development progress
   - Badge: "Progress Report"
   - Focus: What's been done, what's next

2. **Feature Spotlights**: Deep dive into a specific feature
   - Badge: "Feature Spotlight"
   - Focus: Detailed explanation with visuals

3. **Technical Deep Dives**: Behind-the-scenes technical content
   - Badge: "Technical Deep Dive"
   - Use the technical section extensively

4. **Milestone Announcements**: Major achievements
   - Badge: "Milestone"
   - Focus: Celebration and impact

5. **Design Insights**: Art, UI/UX, and design decisions
   - Badge: "Design Insights"
   - Focus: Visual examples and reasoning

## Customization

### Changing Badge Colors
Edit the inline styles or add to your custom section:
```css
.badge.custom {
  background: var(--accent-2);
}
```

### Adding New Section Types
Create custom section styles in the `<style>` block:
```css
.devlog-section.my-custom-section {
  background: rgba(124, 58, 237, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
}
```

## Examples

### Example File Names
- `2025-11-10-combat-system-update.html`
- `2025-12-01-new-character-reveal.html`
- `2026-01-15-alpha-release-announcement.html`

### Example Directory Structure
```
devlogs/
├── templates/
│   ├── devlog-template.html
│   └── README.md
├── 2025-11-10-first-devlog.html
├── 2025-11-15-gameplay-update.html
└── 2025-12-01-art-showcase.html
```

## Troubleshooting

### Images Not Showing
- Check the file path (should be relative: `../assets/images/...`)
- Ensure the image file exists in the assets folder
- Verify the file extension matches (case-sensitive on some servers)

### Styling Looks Wrong
- Make sure `style.css` path is correct (`../style.css`)
- Check that you're using the same color variables as the main site
- Clear browser cache and refresh

### Navigation Not Working
- Verify `navbar.js` is loading (`../navbar.js`)
- Check browser console for JavaScript errors
- Ensure the placeholder div exists: `<div id="site-nav-placeholder"></div>`

## Need Help?

If you run into issues or have questions about the template:
1. Check this README first
2. Review the existing site files for examples (`index.html`, `hephaestus.html`)
3. Ask a team member familiar with the website structure

## Changelog

- **2025-11-10**: Initial template created
  - Basic structure with navbar and footer integration
  - Mobile-responsive design
  - Pre-built content sections
  - Inline styles for easy customization

---

Happy writing! 🎮✍️
