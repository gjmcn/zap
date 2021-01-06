import nodePolyfills from 'rollup-plugin-node-polyfills';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default {
    input: 'src/index.js',
    external: ['source-map'],
    output: [
        { 
            file: pkg.exports.require, 
            format: 'cjs',
            exports: 'default'
        },
        { 
            file: pkg.exports.import,
            format: 'es', 
            exports: 'default'
        }
    ],
    plugins: [
        nodePolyfills(),
        resolve({preferBuiltins: true}),
        commonjs(),
        terser({"compress": {"arrows": false}})
    ]
};