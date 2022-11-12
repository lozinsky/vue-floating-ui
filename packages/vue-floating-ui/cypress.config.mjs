import { defineConfig } from 'cypress';
import { searchForWorkspaceRoot } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vueJsx from '@vitejs/plugin-vue-jsx';
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
        plugins: [tsconfigPaths({ root: workspaceRoot }), vueJsx(), checker({ typescript: true })],
      },
    },
  },
  video: false,
});
