// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
// GitHub Pages: https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
  site: 'https://hhrum.github.io',
  base: '/autolux-landing',
  vite: {
    // POC: expose VITE_GH_* to the admin client bundle (intentionally insecure).
    // Astro defaults to PUBLIC_ only; Admin-GitHub.md uses VITE_* names.
    envPrefix: ['PUBLIC_', 'VITE_'],
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});
