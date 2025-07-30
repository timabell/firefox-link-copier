// Default formats
const DEFAULT_FORMATS = [
	{
		name: 'Markdown',
		template: '[{{title}}]({{url}})',
		type: 'plain'
	},
	{
		name: 'Rich Text',
		template: '<a href="{{url}}">{{title}}</a>',
		type: 'rich'
	},
	{
		name: 'Plain Text',
		template: '{{title}} - {{url}}',
		type: 'plain'
	}
];

// Initialize extension
browser.runtime.onStartup.addListener(initializeExtension);
browser.runtime.onInstalled.addListener(initializeExtension);

async function initializeExtension() {
	// Load formats from storage or use defaults
	const result = await browser.storage.sync.get('formats');
	const formats = result.formats || DEFAULT_FORMATS;
	
	// Create context menus
	createContextMenus(formats);
}

function createContextMenus(formats) {
	// Remove existing menus
	browser.contextMenus.removeAll();
	
	// Create parent menu
	browser.contextMenus.create({
		id: 'copy-link-parent',
		title: 'Copy Link As...',
		contexts: ['tab']
	});
	
	// Add format-specific submenus
	formats.forEach((format, index) => {
		browser.contextMenus.create({
			id: `copy-${index}`,
			parentId: 'copy-link-parent',
			title: format.name,
			contexts: ['tab']
		});
	});
}

// Handle context menu clicks
browser.contextMenus.onClicked.addListener(async (info, tab) => {
	if (info.menuItemId.startsWith('copy-')) {
		const formatIndex = parseInt(info.menuItemId.replace('copy-', ''));
		
		// Get formats from storage
		const result = await browser.storage.sync.get('formats');
		const formats = result.formats || DEFAULT_FORMATS;
		const format = formats[formatIndex];
		
		if (format && tab) {
			await copyTabLink(tab, format);
		}
	}
});

async function copyTabLink(tab, format) {
	const title = tab.title || 'Untitled';
	const url = tab.url || '';
	const domain = extractDomain(url);
	
	// Replace template variables
	const text = formatTemplate(format.template, title, url, domain);
	
	// Copy to clipboard
	if (format.type === 'rich') {
		await copyRichText(text, title, url);
	} else {
		await copyPlainText(text);
	}
}

function formatTemplate(template, title, url, domain) {
	return template
		.replace(/\{\{title\}\}/g, title)
		.replace(/\{\{url\}\}/g, url)
		.replace(/\{\{domain\}\}/g, domain);
}

function extractDomain(url) {
	try {
		const urlObj = new URL(url);
		return urlObj.hostname;
	} catch (e) {
		return '';
	}
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { formatTemplate, extractDomain };
}

async function copyPlainText(text) {
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error('Failed to copy text:', err);
	}
}

async function copyRichText(html, title, url) {
	try {
		const clipboardItem = new ClipboardItem({
			'text/html': new Blob([html], { type: 'text/html' }),
			'text/plain': new Blob([`${title} - ${url}`], { type: 'text/plain' })
		});
		await navigator.clipboard.write([clipboardItem]);
	} catch (err) {
		console.error('Failed to copy rich text:', err);
		// Fallback to plain text
		await copyPlainText(`${title} - ${url}`);
	}
}

// Listen for storage changes to update context menus
browser.storage.onChanged.addListener((changes, areaName) => {
	if (areaName === 'sync' && changes.formats) {
		createContextMenus(changes.formats.newValue || DEFAULT_FORMATS);
	}
});