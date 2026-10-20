import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5173', trace: 'retain-on-failure' },
  webServer: [
    {
      command: 'node ../../part4/bloglist/scripts/e2e-server.cjs',
      url: 'http://127.0.0.1:3003/api/blogs',
      timeout: 120000,
      reuseExistingServer: false,
    },
    {
      command:
        'npm --prefix ../bloglist run dev -- --host 127.0.0.1 --port 5173 --strictPort',
      url: 'http://127.0.0.1:5173',
      timeout: 60000,
      reuseExistingServer: false,
    },
  ],
})
