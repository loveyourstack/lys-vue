import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'unplugin-dts/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ tsconfigPath: './tsconfig.app.json', outDirs: 'dist', entryRoot: 'lib' }),
  ],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.spec.ts'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es']
    },
    rolldownOptions: {
      external: ['vue', 'vuetify', 'vuetify/components', 'vuetify/directives', 'vuetify/styles'],
    }
  }
})
