import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'https://mern-app-azwp.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
