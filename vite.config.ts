import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { UserConfig as VitestUserConfigExport } from 'vitest/config'

// Add reference types for vitest/globals
/// <reference types="vitest" />

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Makes describe, it, expect available globally
    environment: 'jsdom', // Use jsdom for DOM simulation
    setupFiles: './src/setupTests.ts', // Path to setup file
    // Optional: You might need to exclude node_modules from transformations
    // deps: {
    //   inline: [/^(?!.*node_modules)/],
    // },
  },
} as UserConfig & { test: VitestUserConfigExport })
