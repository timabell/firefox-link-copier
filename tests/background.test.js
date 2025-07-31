// Basic tests for background.js functionality

// Mock browser APIs for testing
const mockBrowser = {
	storage: {
		sync: {
			get: jest.fn(),
			set: jest.fn()
		},
		onChanged: {
			addListener: jest.fn()
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

// Import functions from background.js for testing
const { formatTemplate, extractDomain, extractDomainPath } = require('../src/background.js');

// Test formatTemplate function
describe('formatTemplate', () => {
	test('replaces title variable', () => {
		const template = '{{title}} test';
		const result = formatTemplate(template, 'My Title', 'http://example.com', 'example.com', 'example.com');
		expect(result).toBe('My Title test');
	});
	
	test('replaces url variable', () => {
		const template = 'Link: {{url}}';
		const result = formatTemplate(template, 'Title', 'http://example.com', 'example.com', 'example.com');
		expect(result).toBe('Link: http://example.com');
	});
	
	test('replaces domain variable', () => {
		const template = 'Domain: {{domain}}';
		const result = formatTemplate(template, 'Title', 'http://example.com', 'example.com', 'example.com');
		expect(result).toBe('Domain: example.com');
	});
	
	test('replaces domain_path variable', () => {
		const template = 'Path: {{domain_path}}';
		const result = formatTemplate(template, 'Title', 'https://github.com/user/repo', 'github.com', 'github.com/user/repo');
		expect(result).toBe('Path: github.com/user/repo');
	});
	
	test('replaces multiple variables', () => {
		const template = '[{{title}}]({{url}}) from {{domain}} at {{domain_path}}';
		const result = formatTemplate(template, 'Test Page', 'https://example.com/page', 'example.com', 'example.com/page');
		expect(result).toBe('[Test Page](https://example.com/page) from example.com at example.com/page');
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

// Test extractDomainPath function
describe('extractDomainPath', () => {
	test('extracts domain and path from https URL', () => {
		const result = extractDomainPath('https://github.com/user/repo');
		expect(result).toBe('github.com/user/repo');
	});
	
	test('extracts domain and path from http URL', () => {
		const result = extractDomainPath('http://example.com/path/to/page');
		expect(result).toBe('example.com/path/to/page');
	});
	
	test('extracts domain only when no path', () => {
		const result = extractDomainPath('https://example.com');
		expect(result).toBe('example.com');
	});
	
	test('extracts domain and path, ignoring query parameters', () => {
		const result = extractDomainPath('https://github.com/user/repo?tab=readme');
		expect(result).toBe('github.com/user/repo');
	});
	
	test('extracts domain and path, ignoring fragment', () => {
		const result = extractDomainPath('https://example.com/docs/page#section');
		expect(result).toBe('example.com/docs/page');
	});
	
	test('handles complex URLs with subdomain, path, query and fragment', () => {
		const result = extractDomainPath('https://api.github.com/repos/user/project/issues?state=open&sort=created#top');
		expect(result).toBe('api.github.com/repos/user/project/issues');
	});
	
	test('handles invalid URL', () => {
		const result = extractDomainPath('not-a-url');
		expect(result).toBe('');
	});
	
	test('handles URL with port', () => {
		const result = extractDomainPath('http://localhost:3000/api/users');
		expect(result).toBe('localhost/api/users');
	});
});