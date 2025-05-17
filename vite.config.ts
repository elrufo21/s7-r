import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  build: {
    // Ignora errores de TypeScript durante el build
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'TS_ERROR') return // Ignora TS
        warn(warning)
      },
    },
  },
})
