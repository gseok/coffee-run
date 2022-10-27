import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import copy from 'rollup-plugin-copy';
import livereload from 'rollup-plugin-livereload';

const root = path.join(__dirname, '../..');
const dist = path.resolve(root, 'dist');

export default (commandLineArgs) => {
  const isWatching = process.argv.includes('-w') || process.argv.includes('--watch');
  const isDev = !!commandLineArgs?.input?.includes('dev');
  delete commandLineArgs.input;

  console.log('Build is Dev:', isDev);
  console.log('Build is Watch:', isWatching);

  return {
    //  Our games entry point (edit as required)
    input: ['./src/game.ts'],

    // Where the build file is to be generated.
    // Most games being built for distribution can use iife as the module type.
    // You can also use 'umd' if you need to ingest your game into another system.
    // The 'intro' property can be removed if using Phaser 3.21 or above. Keep it for earlier versions.
    output: {
      file: `${dist}/coffeerun.js`,
      name: 'coffeerun',
      format: 'iife',
      sourcemap: isDev,
      intro: 'var global = window;',
    },

    plugins: [
      // Toggle the booleans here to enable / disable Phaser 3 features:
      replace({
        preventAssignment: true,
        'typeof CANVAS_RENDERER': JSON.stringify(true),
        'typeof WEBGL_RENDERER': JSON.stringify(true),
        'typeof EXPERIMENTAL': JSON.stringify(true),
        'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
        'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
        'typeof FEATURE_SOUND': JSON.stringify(true),
      }),

      // Parse our .ts source files
      resolve({
        extensions: ['.ts', '.tsx'],
      }),

      // We need to convert the Phaser 3 CJS modules into a format Rollup can use:
      commonjs({
        include: [`${root}/node_modules/eventemitter3/**`, `${root}/node_modules/phaser/**`],
        exclude: [`${root}/node_modules/phaser/src/polyfills/requestAnimationFrame.js`],
        sourceMap: isDev, // dev일때는 true, 배포시에는 false
        ignoreGlobal: true,
      }),

      // See https://www.npmjs.com/package/rollup-plugin-typescript2 for config options
      typescript(),

      copy({
        targets: [
          { src: 'src/index.html', dest: `${dist}` },
          { src: 'assets/**/*', dest: `${dist}/assets` },
        ],
      }),

      // 개발시에만 사용
      // See https://www.npmjs.com/package/rollup-plugin-serve for config options
      isDev &&
        isWatching &&
        serve({
          open: true,
          contentBase: `${dist}`,
          host: 'localhost',
          port: 10001,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }),

      isDev && isWatching && livereload({
        watch: `${dist}`,
        verbose: true,
        delay: 1500,
      }),

      // 배포시에만 사용
      !isDev &&
        uglify({
          mangle: false,
        }),
    ].filter(Boolean),
  };
};
