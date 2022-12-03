import { fileURLToPath, URL } from 'node:url';
import { join } from 'node:path';

import { defineConfig, searchForWorkspaceRoot } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'VueFloatingUIInteractions',
      fileName: 'vue-floating-ui-interactions',
    },
    rollupOptions: {
      external: ['vue-floating-ui', 'vue-floating-ui-vue-demi'],
      output: {
        globals: {
          'vue-floating-ui': 'VueFloatingUI',
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
      skipDiagnostics: true,
    }),
  ],
});
