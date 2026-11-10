import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: { __BUILD_TIME__: JSON.stringify(Date.now()) },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
