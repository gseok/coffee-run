#!/usr/bin/env node

import fs from 'fs';
import axios from 'axios';
import esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import { createRequire } from 'module';
import { livereloadPlugin } from '@jgoz/esbuild-plugin-livereload';
import copyStaticFiles from 'esbuild-copy-static-files';
import opn from 'better-opn';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { typecheckPlugin } from '@jgoz/esbuild-plugin-typecheck';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootPath = join(__dirname, '../..');
const destPath = `${rootPath}/dist/widget`;

const packageJson = createRequire(import.meta.url)(`${rootPath}/projects/widgets/package.json`);
const isString = (value) => typeof value === 'string';
const getCommitHash = (value) => {
  if (isString(value)) return value;
  const hash = (() => {
    try {
      // n2c 환경등에서 git 명령어 실행이 불가능 할 수 있음으로, try-catch 처리 필수
      return execSync('git rev-parse --short HEAD').toString().replace('\n', '');
    } catch (e) {
      return '';
    }
  })();
  return hash;
};

let called = false
const once = (fn) => {
  return (result) => {
    if (called) return
    called = true
    if (fn) setTimeout(() => fn(result), 100);
  }
}

const OpenBrowserPlugin = (url) => {
  return {
    name: 'OpenBrowserPlugin',
    setup(build) {
      build.onEnd(once((result) => {
        if (result.errors.length > 0) {
          console.log(`build ended with ${result.errors.length} errors`)
          return process.exit(1);
        }

        console.log('[Check] browser open url', url);
        const intervalId = setInterval(() => {
          axios.get(url)
          .then(() => {
              console.log('[Check] check ok...!!!!!');
              clearInterval(intervalId);
              // open browser
              console.log('[Open] open browser!');
              process.env.OPEN_MATCH_HOST_ONLY = 'true';
              opn(url);
            })
            .catch(() => {
              console.log('[Check] checking...');
            });
        }, 1000);
      }));
    },
  }
}

const { name, version } = packageJson;
const commitHash = getCommitHash();
const formats = [
  'iife',
];
const formatExtensionMap = {
  'iife': 'js',
};
const target = browserslistToEsbuild(['> 0.5%', 'last 2 versions', 'ie >= 11']);
const buildTime = new Date().getTime();

const tt = [
  'es2015',
  'chrome58',
  'edge16',
  'firefox57',
  'safari11',
  'ios14.5',
];

const config = {
  logLevel: "info",
  entryPoints: [`${rootPath}/projects/widgets/src/index.ts`],
  bundle: true,
  // target: 'es6',
  target,
  tsconfig: 'tsconfig.json',
  loader: {
    '.html': 'text',
  },
  plugins: [
    typecheckPlugin(),
    copyStaticFiles({
      src: `${rootPath}/projects/widgets/src/assets`,
      dest: destPath,
      dereference: true,
      errorOnExist: false,
      preserveTimestamps: true,
      recursive: true,
    })
  ],
};

export const getConfig = ({ prod = false, serve = false, port = 53099 }) => {
  return {
    ...config,
    define: {
      __PROD__: prod,
      __HASH__: `'${commitHash}'`,
      __TIME__: `${buildTime}`,
      __PKGNAME__: `'${name || ''}'`,
      __PKGVERSION__: `'${version || ''}'`,
    },
    minify: prod,
    sourcemap: !prod,
    footer: {
      js: `// ${version}-${commitHash}, ${buildTime}`,
      css: `/* ${version}-${commitHash}, ${buildTime} */`,
    },
    ...(serve ? {
      metafile: true,
      write: true,
      watch: {
        onRebuild(error, result) {
          if (error) console.error('watch build failed:', error)
          else console.log('watch build succeeded:', result)
        },
      },
      plugins: [
        ...(config?.plugins || []),
        livereloadPlugin({ port }),
        OpenBrowserPlugin('https://local-pages.map.naver.com'),
      ],
    } : {}),
  };
}

export const clearDist = () => {
  fs.rmSync(destPath, { recursive: true, force: true });
}

export const runEsBuild = (options) => {
  clearDist();

  formats.forEach((format, index) => {
    const port = 53099;
    const outfile = `${destPath}/${name}.${formatExtensionMap[format]}`
    esbuild.build({...getConfig({...options, port: port + index}), outfile }).catch(() => process.exit(1));
  });
}

runEsBuild(options);
