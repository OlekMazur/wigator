// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			'indent': ['error', 'tab', {
				'MemberExpression': 0,
				'SwitchCase': 1,
				'flatTernaryExpressions': true,
			}],
			'linebreak-style': ['error', 'unix'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'never'],
			'no-empty': ['error', { "allowEmptyCatch": true }],
			'@typescript-eslint/no-explicit-any': ['off'],
			'@typescript-eslint/no-unused-vars': ['error', {
				"caughtErrorsIgnorePattern": "^_",
			}],
		},
	},
)
