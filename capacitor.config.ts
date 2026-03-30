import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.mahekprovisions.app',
  appName: 'Mahek Provisions',
  webDir: 'public',
  server: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://mahekprovisions.com/',
    cleartext: false,
  },
}

export default config
