# Firefox Link Copier

A Firefox extension that allows users to copy tab links and information in multiple customizable formats through the tab context menu.

## Features

- **Multiple Copy Formats**: Copy links in various formats including Markdown, Rich Text, and Plain Text
- **Customizable Templates**: Define your own copy formats with flexible template system
- **Tab Context Menu Integration**: Right-click on any tab to access copy options
- **Rich Text Support**: Paste formatted links directly into Word processors and other applications
- **Easy Configuration**: Simple interface to manage and customize copy formats

## Default Formats

- **Markdown**: `[Tab Title](URL)` - Perfect for documentation and README files
- **Rich Text**: Formatted clickable links for word processors
- **Plain Text**: Simple "Tab Title - URL" format

## Installation

### From Firefox Add-ons Store
1. Visit the [Firefox Add-ons page](https://addons.mozilla.org) (coming soon)
2. Click "Add to Firefox"
3. Confirm installation

### Development Installation
1. Clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from this project

## Usage

1. Right-click on any tab
2. Select "Copy Link As..." from the context menu
3. Choose your desired format
4. Paste anywhere you need the formatted link

## Configuration

Access the extension options through:
- Firefox Add-ons Manager → Firefox Link Copier → Options
- Or right-click the extension icon and select "Options"

Create custom formats using template variables:
- `{{title}}` - Tab title
- `{{url}}` - Tab URL
- `{{domain}}` - Domain name only
- `{{timestamp}}` - Current timestamp

## Development

### Prerequisites
- Firefox 88+ for development
- Node.js 16+ (for testing and building)
- npm or yarn

### Setup
```bash
git clone https://github.com/yourusername/firefox-link-copier.git
cd firefox-link-copier
npm install
```

### Testing
```bash
npm test
npm run test:integration
```

### Building
```bash
npm run build
```

### Project Structure
```
firefox-link-copier/
├── manifest.json          # Extension manifest
├── background/            # Background scripts
├── content/              # Content scripts
├── popup/                # Extension popup UI
├── options/              # Options page
├── icons/                # Extension icons
├── tests/                # Test files
└── docs/                 # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the A-GPL v3 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Copy LinKTab name and URL](https://addons.mozilla.org/en-GB/firefox/addon/copy-linktab-name-and-url/)
- Built following Firefox WebExtension standards
