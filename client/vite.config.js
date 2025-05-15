import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    optimizeDeps: {
    exclude: ['razorpay'], // Exclude Node.js modules
  },
   server: {
    historyApiFallback: true, // For dev server
  },
  build: {
    outDir: 'dist',
    // For production routing
    rollupOptions: {
      output: {
        // Ensures entry point is correct
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});
