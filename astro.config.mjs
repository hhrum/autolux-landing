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
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});
