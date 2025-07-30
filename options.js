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

let formats = [];

// Initialize options page
document.addEventListener('DOMContentLoaded', async () => {
	await loadFormats();
	renderFormats();
	
	// Event listeners
	document.getElementById('add-format').addEventListener('click', addNewFormat);
	document.getElementById('save-formats').addEventListener('click', saveFormats);
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
	div.innerHTML = `
		<label>Name:</label>
		<input type="text" class="name-input" value="${escapeAttr(format.name)}" data-index="${index}">
		
		<label>Template:</label>
		<input type="text" class="template-input" value="${escapeAttr(format.template)}" data-index="${index}">
		
		<label>Type:</label>
		<select class="type-select" data-index="${index}">
			<option value="plain" ${format.type === 'plain' ? 'selected' : ''}>Plain Text</option>
			<option value="markdown" ${format.type === 'markdown' ? 'selected' : ''}>Markdown</option>
			<option value="rich" ${format.type === 'rich' ? 'selected' : ''}>Rich Text</option>
		</select>
		
		<div class="preview" id="preview-${index}"></div>
		
		<button class="delete" onclick="deleteFormat(${index})">Delete</button>
	`;
	
	// Add event listeners for live preview
	const nameInput = div.querySelector('.name-input');
	const templateInput = div.querySelector('.template-input');
	
	nameInput.addEventListener('input', () => updatePreview(index));
	templateInput.addEventListener('input', () => updatePreview(index));
	
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
		
		const preview = formatTemplate(templateInput.value, sampleTitle, sampleUrl, sampleDomain);
		previewDiv.textContent = preview;
	}
}

function formatTemplate(template, title, url, domain) {
	return template
		.replace(/\{\{title\}\}/g, title)
		.replace(/\{\{url\}\}/g, url)
		.replace(/\{\{domain\}\}/g, domain);
}

function addNewFormat() {
	const newFormat = {
		name: 'New Format',
		template: '{{title}} - {{url}}',
		type: 'plain'
	};
	
	formats.push(newFormat);
	renderFormats();
}

function deleteFormat(index) {
	if (formats.length > 1) {
		formats.splice(index, 1);
		renderFormats();
	} else {
		alert('You must have at least one format.');
	}
}

async function saveFormats() {
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
		alert('Please add at least one valid format.');
		return;
	}
	
	// Save to storage
	await browser.storage.sync.set({ formats: updatedFormats });
	formats = updatedFormats;
	
	// Show success message
	const saveButton = document.getElementById('save-formats');
	const originalText = saveButton.textContent;
	saveButton.textContent = 'Saved!';
	saveButton.style.background = '#28a745';
	
	setTimeout(() => {
		saveButton.textContent = originalText;
		saveButton.style.background = '#007bff';
	}, 2000);
}

async function resetToDefaults() {
	if (confirm('Reset to default formats? This will remove all custom formats.')) {
		formats = [...DEFAULT_FORMATS];
		await browser.storage.sync.set({ formats: formats });
		renderFormats();
	}
}

function escapeAttr(text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}