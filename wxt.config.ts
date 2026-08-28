import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: '.',
  outDir: '.output',
  manifest: {
    name: 'Focus Flow Map',
    description: 'Record a local keyboard focus journey and export reproducible evidence.',
    version: '1.0.0',
    permissions: ['activeTab', 'storage', 'tabs'],
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'Focus Flow Map',
      default_icon: {
        '16': 'icons/16.png',
        '32': 'icons/32.png',
      },
    },
    icons: {
      '16': 'icons/16.png',
      '32': 'icons/32.png',
      '48': 'icons/48.png',
      '128': 'icons/128.png',
    },
    web_accessible_resources: [
      {
        resources: ['fonts/*'],
        matches: ['<all_urls>'],
      },
    ],
  },
  vite: () => ({
    build: { target: 'es2022' },
  }),
});
