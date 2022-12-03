import { defineConfig } from 'cypress';
import { isVue2 } from 'vue-floating-ui-vue-demi';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        resolve: {
          alias: isVue2
            ? { vue: 'vue2.7/dist/vue.esm.js', 'vue2.7': 'vue2.7/dist/vue.esm.js', 'cypress/vue': 'cypress/vue2' }
            : { vue: 'vue/dist/vue.esm-bundler.js' },
        },
        define: {
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
        },
        plugins: [tsconfigPaths(), checker({ typescript: true })],
      },
    },
  },
  video: false,
});
