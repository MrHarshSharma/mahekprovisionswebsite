import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.mahekprovisions.app',
  appName: 'Mahek Provisions',
  webDir: 'public',
  server: {
    url: (process.env.NEXT_PUBLIC_APP_URL || 'https://mahekprovisions.com') + '/products',
    cleartext: false,
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#1a1a1a',
    },
  },
}

export default config
