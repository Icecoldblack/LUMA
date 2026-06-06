import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const nodeStub = fileURLToPath(new URL('./src/shims/node-stub.ts', import.meta.url))

// The Anthropic SDK pulls in a Node-only agent-toolset (file tools / session
// worker) that we never use in the browser. Alias its Node built-in imports to
// a browser stub so Vite can bundle. See src/shims/node-stub.ts.
const NODE_BUILTINS = [
  'node:crypto',
  'node:stream',
  'node:stream/promises',
  'node:util',
  'node:path',
  'node:fs',
  'node:fs/promises',
  'node:child_process',
  'node:readline',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: NODE_BUILTINS.map((builtin) => ({
      find: new RegExp(`^${builtin.replace('/', '\\/')}$`),
      replacement: nodeStub,
    })),
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
