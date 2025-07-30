// Basic tests for background.js functionality

// Mock browser APIs for testing
const mockBrowser = {
	storage: {
		sync: {
			get: jest.fn(),
			set: jest.fn()
		}
	},
	contextMenus: {
		create: jest.fn(),
		removeAll: jest.fn(),
		onClicked: {
			addListener: jest.fn()
		}
	},
	runtime: {
		onStartup: {
			addListener: jest.fn()
		},
		onInstalled: {
			addListener: jest.fn()
		}
	}
};

global.browser = mockBrowser;

// Test formatTemplate function
describe('formatTemplate', () => {
	test('replaces title variable', () => {
		const template = '{{title}} test';
		const result = formatTemplate(template, 'My Title', 'http://example.com', 'example.com');
		expect(result).toBe('My Title test');
	});
	
	test('replaces url variable', () => {
		const template = 'Link: {{url}}';
		const result = formatTemplate(template, 'Title', 'http://example.com', 'example.com');
		expect(result).toBe('Link: http://example.com');
	});
	
	test('replaces domain variable', () => {
		const template = 'Domain: {{domain}}';
		const result = formatTemplate(template, 'Title', 'http://example.com', 'example.com');
		expect(result).toBe('Domain: example.com');
	});
	
	test('replaces multiple variables', () => {
		const template = '[{{title}}]({{url}}) from {{domain}}';
		const result = formatTemplate(template, 'Test Page', 'https://example.com/page', 'example.com');
		expect(result).toBe('[Test Page](https://example.com/page) from example.com');
	});
});

// Test extractDomain function
describe('extractDomain', () => {
	test('extracts domain from https URL', () => {
		const result = extractDomain('https://example.com/path');
		expect(result).toBe('example.com');
	});
	
	test('extracts domain from http URL', () => {
		const result = extractDomain('http://subdomain.example.com');
		expect(result).toBe('subdomain.example.com');
	});
	
	test('handles invalid URL', () => {
		const result = extractDomain('not-a-url');
		expect(result).toBe('');
	});
	
	test('extracts domain with port', () => {
		const result = extractDomain('http://localhost:3000/path');
		expect(result).toBe('localhost');
	});
});