/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import Inspect from 'vite-plugin-inspect';
import { resolve } from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
// import handlebars from 'vite-plugin-handlebars';

export default {
  publicDir: 'assets',
  plugins: [
    Inspect(),
    ViteImageOptimizer({
      png: {
        quality: 85,
      },
      jpg: {
        quality: 85,
      },
      webp: {
        quality: 70,
      },
    }),
    // handlebars({
    //   partialDirectory: resolve(__dirname, './src/templates'),
    // }),
  ],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
      },
    },
    minify: false,
    compact: false,
    sourcemap: true,
  },
};
