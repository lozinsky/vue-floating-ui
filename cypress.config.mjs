import { defineConfig } from 'cypress';
import { version } from 'vue-floating-ui-vue-demi';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

function getAlias() {
  if (version.startsWith('2.7.')) {
    return { vue: 'vue2.7/dist/vue.esm.js', 'vue2.7': 'vue2.7/dist/vue.esm.js', 'cypress/vue': 'cypress/vue2' };
  }

  if (version.startsWith('2.')) {
    return { vue: 'vue2/dist/vue.esm.js', vue2: 'vue2/dist/vue.esm.js', 'cypress/vue': 'cypress/vue2' };
  }

  return { vue: 'vue/dist/vue.esm-bundler.js' };
}

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        resolve: { alias: getAlias() },
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
