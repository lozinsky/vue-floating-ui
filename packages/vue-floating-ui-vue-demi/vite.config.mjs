import { fileURLToPath, URL } from 'node:url';
import { join } from 'node:path';

import { defineConfig, searchForWorkspaceRoot } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL(join('./src', process.env.BUILD_TARGET, 'index.mjs'), import.meta.url)),
      name: 'VueFloatingUIVueDemi',
      fileName: 'vue-floating-ui-vue-demi',
    },
    rollupOptions: {
      external: ['vue-demi'],
      output: {
        globals: {
          'vue-demi': 'VueDemi',
        },
      },
    },
    outDir: join('./lib/', process.env.BUILD_TARGET),
  },
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  plugins: [
    dts({
      tsConfigFilePath: join(searchForWorkspaceRoot(process.cwd()), 'tsconfig.json'),
      entryRoot: join('./src/', process.env.BUILD_TARGET),
      include: ['./src/'],
    }),
  ],
});
