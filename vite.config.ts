import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Configuração oficial do Tailwind CSS v4 para Vite: plugin @tailwindcss/vite.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
