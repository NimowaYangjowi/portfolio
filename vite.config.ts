import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: {
  env: Record<string, string | undefined>;
};

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'portfolio';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? `/${repositoryName}/` : '/',
  plugins: [react()],
});
