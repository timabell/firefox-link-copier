export default [
	{
		files: ["src/*.js", "tests/*.js"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "script",
			globals: {
				browser: "readonly",
				console: "readonly",
				navigator: "readonly",
				URL: "readonly",
				ClipboardItem: "readonly",
				Blob: "readonly",
				document: "readonly",
				window: "readonly",
				alert: "readonly",
				confirm: "readonly",
				setTimeout: "readonly"
			}
		},
		rules: {
			semi: ["error", "always"],
			quotes: ["error", "single"],
			"no-unused-vars": "error",
			"no-console": "warn"
		}
	},
	{
		files: ["tests/*.js"],
		languageOptions: {
			globals: {
				require: "readonly",
				module: "readonly",
				jest: "readonly",
				describe: "readonly",
				test: "readonly",
				expect: "readonly"
			}
		}
	}
];