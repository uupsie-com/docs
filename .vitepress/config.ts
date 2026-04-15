import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Uupsie Docs',
  description: 'Documentation for Uupsie — uptime monitoring, status pages, and Kubernetes observability.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Kubernetes Agent', link: '/agent/' },
      { text: 'Dashboard', link: 'https://app.uupsie.com' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Rate Limits & Errors', link: '/guide/errors' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Monitors', link: '/api/monitors' },
            { text: 'Incidents', link: '/api/incidents' },
            { text: 'Status Pages', link: '/api/status-pages' },
            { text: 'Notification Channels', link: '/api/notification-channels' },
            { text: 'Webhooks', link: '/api/webhooks' },
            { text: 'Maintenance Windows', link: '/api/maintenance-windows' },
            { text: 'Team & Roles', link: '/api/team' },
            { text: 'API Tokens', link: '/api/tokens' },
          ],
        },
      ],
      '/agent/': [
        {
          text: 'Kubernetes Agent',
          items: [
            { text: 'Overview', link: '/agent/' },
            { text: 'Installation', link: '/agent/installation' },
            { text: 'Configuration', link: '/agent/configuration' },
            { text: 'Supported Resources', link: '/agent/resources' },
            { text: 'Troubleshooting', link: '/agent/troubleshooting' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/uupsie-com' },
    ],
    editLink: {
      pattern: 'https://github.com/uupsie-com/docs/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Uupsie',
    },
    search: {
      provider: 'local',
    },
  },
})
