import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser'; 
import ts from 'rollup-plugin-typescript2';
import { resolve } from 'path';

const externals = [
    '@chaperone/util'
];

export default {
    input: resolve(__dirname, 'src/index.ts'),
    treeshake: true,
    preserveEntrySignatures: true,
    external: externals,
    output: [
        {
            format: 'esm',
            file: resolve("dist/esm.mjs")
        },
        {
            format: 'cjs',
            file: resolve("dist/c.cjs")
        }
    ],
    plugins: [
        del({
            targets: ['./dist'],
        }),
        ts({
            tsconfig: './tsconfig.json',
            check: true,
            clear: true,
            abortOnError: true,
            useTsconfigDeclarationDir: true
        }),
        terser({
            format: { comments: true }
        })
    ]
}