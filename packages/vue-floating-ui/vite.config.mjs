import { fileURLToPath, URL } from 'node:url';
import { join } from 'node:path';

import { defineConfig, searchForWorkspaceRoot } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'VueFloatingUI',
      fileName: 'vue-floating-ui',
    },
    rollupOptions: {
      external: ['@floating-ui/dom', 'vue-floating-ui-vue-demi'],
      output: {
        globals: {
          '@floating-ui/dom': 'FloatingUIDOM',
          'vue-floating-ui-vue-demi': 'VueFloatingUIVueDemi',
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['vue-floating-ui-vue-demi'],
  },
  plugins: [
    dts({
      tsConfigFilePath: join(searchForWorkspaceRoot(process.cwd()), 'tsconfig.json'),
      entryRoot: './src/',
      include: ['./src/'],
    }),
  ],
});
