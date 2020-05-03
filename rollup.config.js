import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default  [
	{ // UMD
		input: 'src/index.js',
		output: {
			name: 'zap',
			file: pkg.exports.browser,
			format: 'umd'
		},
		plugins: [
			resolve({preferBuiltins: true}),
			commonjs(),
			builtins(),
			terser({"compress": {"arrows": false}})
		]
	},
	{ // commonJS and ESM
		input: 'src/index.js',
		external: ['source-map'],
		output: [
			{ 
				file: pkg.exports.require, 
				format: 'cjs', 
				plugins: [terser({"compress": {"arrows": false}})]
			},
			{ 
				file: pkg.exports.import,
				format: 'es', 
				plugins: [terser({"compress": {"arrows": false}})]
			}
		]
	}
];