# Firefox Link Copier - Design Document

## Overview

Firefox Link Copier is a simple WebExtension that adds tab context menu options to copy links in markdown, rich text, and plain text formats.

## Architecture

Keep it simple - just 3 core files:

```
┌─────────────────┐    ┌─────────────────┐
│   background.js │◄──►│   options.html  │
│   - context menu│    │   - settings UI │
│   - copy logic  │    │                 │
│   - storage     │    │                 │
└─────────────────┘    └─────────────────┘
```

### 1. Background Script (`background.js`)
- Create context menu items for the 3 default formats
- Handle menu clicks and copy to clipboard
- Load/save custom formats from storage
- Simple template replacement ({{title}}, {{url}}, {{domain}})

### 2. Options Page (`options.html/js`)
- Form to add/edit/delete custom formats
- Preview functionality
- Basic validation

## Data Models

### Format Definition
```javascript
{
  name: 'Display Name',
  template: '{{title}} - {{url}}',
  type: 'plain' | 'markdown' | 'rich'
}
```

### Template Variables
- `{{title}}` - Tab title
- `{{url}}` - Full URL
- `{{domain}}` - Domain name only (e.g., 'github.com')

## Implementation

### Default Formats
- **Markdown**: `[{{title}}]({{url}})`
- **Rich Text**: HTML `<a href="{{url}}">{{title}}</a>`
- **Plain Text**: `{{title}} - {{url}}`

### Core Functions
```javascript
// Template replacement
function formatTemplate(template, title, url, domain) {
  return template
    .replace(/\{\{title\}\}/g, title)
    .replace(/\{\{url\}\}/g, url)
    .replace(/\{\{domain\}\}/g, domain);
}

// Copy to clipboard
function copyToClipboard(text, isRich = false) {
  if (isRich) {
    // Copy as HTML for rich text
  } else {
    // Copy as plain text
  }
}
```

## File Structure
```
firefox-link-copier/
├── manifest.json       # Extension config
├── background.js       # Main logic
├── options.html        # Settings page
├── options.js          # Settings logic
├── icon.png           # Extension icon
└── tests/             # Test files
```

## Testing
- Test template replacement function
- Test context menu creation
- Test clipboard operations
- Manual testing in Firefox