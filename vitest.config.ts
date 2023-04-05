import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  esbuild: {
    tsconfigRaw: '{}',
  },
  test: {
    clearMocks: true,
    globals: true,
    setupFiles: ['dotenv/config'],
    testTimeout: 60000,
  },
  resolve: {
    alias: [{ find: '~', replacement: resolve(__dirname, 'src') }],
  },
});
