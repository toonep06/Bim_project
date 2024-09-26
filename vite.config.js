import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs'; // นำเข้า CommonJS plugin

export default defineConfig({
  plugins: [react(), commonjs()],
  optimizeDeps: {
    include: ['jquery'], // บังคับให้ Vite โหลด jQuery เป็น dependency
  },
  server: {
    historyApiFallback: true,  // ให้ Vite เสิร์ฟไฟล์ index.html สำหรับเส้นทางอื่น ๆ
  },
});
