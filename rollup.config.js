/*
 * This file is part of Wigator.
 *
 * Copyright (c) 2020 Aleksander Mazur
 *
 * Wigator is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * Wigator is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wigator. If not, see <https://www.gnu.org/licenses/>.
 */

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import css from 'rollup-plugin-css-porter'
import image from '@rollup/plugin-image'
import { terser } from 'rollup-plugin-terser'

const plugins = [
	resolve(),
	css({ raw: false }),
	image(),
	commonjs(),
	babel({
		babelHelpers: 'bundled',
		exclude: 'node_modules/**',
	}),
]

if (!process.env.DEV)
	plugins.push(terser({
		ecma: 5,
		//warnings: true,
		toplevel: true,
		compress: {
			passes: 2,
			toplevel: true,
			keep_fargs: false,
			pure_getters: true,
			hoist_funs: true,
			//unsafe: true,
			unsafe_math: true,
		},
		mangle: {
			toplevel: true,
		},
		output: {
			semicolons: false,
		},
	}))

export default {
	input: 'output/intermediate/index.js',
	output: {
		file: 'output/index.js',
		format: 'iife',
	},
	plugins,
}
