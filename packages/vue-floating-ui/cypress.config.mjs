import { defineConfig } from 'cypress';
import { isVue2 } from 'vue-demi';
import { searchForWorkspaceRoot } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

const workspaceRoot = searchForWorkspaceRoot(process.cwd());

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        server: {
          fs: { allow: [workspaceRoot] },
        },
        resolve: {
          alias: isVue2
            ? { vue: 'vue2.7/dist/vue.esm.js', 'vue2.7': 'vue2.7/dist/vue.esm.js', 'cypress/vue': 'cypress/vue2' }
            : { vue: 'vue/dist/vue.esm-bundler.js' },
        },
        define: {
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
        },
        plugins: [tsconfigPaths({ root: workspaceRoot }), checker({ typescript: true })],
      },
    },
  },
  video: false,
});
