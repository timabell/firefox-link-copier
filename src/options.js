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
		name: 'Title First',
		template: '"{{title}}" - {{url}}',
		type: 'plain'
	},
	{
		name: 'Link First',
		template: '{{url}} - "{{title}}"',
		type: 'plain'
	},
	{
		name: 'Rich: domain',
		template: '<a href="{{url}}">{{domain}}</a>',
		type: 'rich'
	},
	{
		name: 'Rich: domain+path',
		template: '<a href="{{url}}">{{domain_path}}</a>',
		type: 'rich'
	},
	{
		name: 'Markdown: domain',
		template: '[{{domain}}]({{url}})',
		type: 'plain'
	},
	{
		name: 'Markdown: domain+path',
		template: '[{{domain_path}}]({{url}})',
		type: 'plain'
	}
];

let formats = [];

// Initialize options page
document.addEventListener('DOMContentLoaded', async () => {
	await loadFormats();
	renderFormats();
	
	// Event listeners
	document.getElementById('add-format').addEventListener('click', addNewFormat);
	document.getElementById('reset-defaults').addEventListener('click', resetToDefaults);
});

async function loadFormats() {
	const result = await browser.storage.sync.get('formats');
	formats = result.formats || DEFAULT_FORMATS;
}

function renderFormats() {
	const container = document.getElementById('formats-container');
	container.innerHTML = '';
	
	formats.forEach((format, index) => {
		const formatDiv = createFormatElement(format, index);
		container.appendChild(formatDiv);
	});
}

function createFormatElement(format, index) {
	const div = document.createElement('div');
	div.className = 'format-item';
	
	// Name label and input
	const nameLabel = document.createElement('label');
	nameLabel.textContent = 'Name:';
	div.appendChild(nameLabel);
	
	const nameInput = document.createElement('input');
	nameInput.type = 'text';
	nameInput.className = 'name-input';
	nameInput.value = format.name;
	nameInput.setAttribute('data-index', index);
	div.appendChild(nameInput);
	
	// Template label and input
	const templateLabel = document.createElement('label');
	templateLabel.textContent = 'Template:';
	div.appendChild(templateLabel);
	
	const templateInput = document.createElement('input');
	templateInput.type = 'text';
	templateInput.className = 'template-input';
	templateInput.value = format.template;
	templateInput.setAttribute('data-index', index);
	div.appendChild(templateInput);
	
	// Type label and select
	const typeLabel = document.createElement('label');
	typeLabel.textContent = 'Type:';
	div.appendChild(typeLabel);
	
	const typeSelect = document.createElement('select');
	typeSelect.className = 'type-select';
	typeSelect.setAttribute('data-index', index);
	
	const plainOption = document.createElement('option');
	plainOption.value = 'plain';
	plainOption.textContent = 'Plain Text';
	plainOption.selected = format.type === 'plain';
	typeSelect.appendChild(plainOption);
	
	const markdownOption = document.createElement('option');
	markdownOption.value = 'markdown';
	markdownOption.textContent = 'Markdown';
	markdownOption.selected = format.type === 'markdown';
	typeSelect.appendChild(markdownOption);
	
	const richOption = document.createElement('option');
	richOption.value = 'rich';
	richOption.textContent = 'Rich Text';
	richOption.selected = format.type === 'rich';
	typeSelect.appendChild(richOption);
	
	div.appendChild(typeSelect);
	
	// Preview div
	const previewDiv = document.createElement('div');
	previewDiv.className = 'preview';
	previewDiv.id = `preview-${index}`;
	div.appendChild(previewDiv);
	
	// Delete button
	const deleteButton = document.createElement('button');
	deleteButton.className = 'delete';
	deleteButton.textContent = 'Delete';
	deleteButton.setAttribute('data-index', index);
	div.appendChild(deleteButton);
	
	nameInput.addEventListener('input', () => {
		updatePreview(index);
		autoSave();
	});
	templateInput.addEventListener('input', () => {
		updatePreview(index);
		autoSave();
	});
	typeSelect.addEventListener('change', () => {
		autoSave();
	});
	deleteButton.addEventListener('click', () => {
		deleteFormat(index);
	});
	
	// Initial preview
	setTimeout(() => updatePreview(index), 0);
	
	return div;
}

function updatePreview(index) {
	const templateInput = document.querySelector(`.template-input[data-index="${index}"]`);
	const previewDiv = document.getElementById(`preview-${index}`);
	
	if (templateInput && previewDiv) {
		const sampleTitle = 'Example Page Title';
		const sampleUrl = 'https://example.com/page';
		const sampleDomain = 'example.com';
		const sampleDomainPath = 'example.com/page';
		
		const preview = formatTemplate(templateInput.value, sampleTitle, sampleUrl, sampleDomain, sampleDomainPath);
		previewDiv.textContent = preview;
	}
}

function formatTemplate(template, title, url, domain, domainPath) {
	return template
		.replace(/\{\{title\}\}/g, title)
		.replace(/\{\{url\}\}/g, url)
		.replace(/\{\{domain\}\}/g, domain)
		.replace(/\{\{domain_path\}\}/g, domainPath);
}

function addNewFormat() {
	const newFormat = {
		name: 'New Format',
		template: '{{title}} - {{url}}',
		type: 'plain'
	};
	
	formats.push(newFormat);
	renderFormats();
	autoSave();
}

function deleteFormat(index) {
	if (formats.length > 1) {
		formats.splice(index, 1);
		renderFormats();
		autoSave();
	} else {
		alert('You must have at least one format.');
	}
}

async function autoSave() {
	// Collect data from form
	const nameInputs = document.querySelectorAll('.name-input');
	const templateInputs = document.querySelectorAll('.template-input');
	const typeSelects = document.querySelectorAll('.type-select');
	
	const updatedFormats = [];
	
	for (let i = 0; i < nameInputs.length; i++) {
		const name = nameInputs[i].value.trim();
		const template = templateInputs[i].value.trim();
		const type = typeSelects[i].value;
		
		if (name && template) {
			updatedFormats.push({ name, template, type });
		}
	}
	
	if (updatedFormats.length === 0) {
		return; // Don't save empty formats
	}
	
	// Save to storage
	await browser.storage.sync.set({ formats: updatedFormats });
	formats = updatedFormats;
}

async function resetToDefaults() {
	if (confirm('Reset to default formats? This will remove all custom formats.')) {
		formats = [...DEFAULT_FORMATS];
		renderFormats();
		autoSave();
	}
}

