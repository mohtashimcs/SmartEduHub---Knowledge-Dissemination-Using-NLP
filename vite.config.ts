import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

// because __dirname was showing undefined
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(_dirname, "./"),
    },
  },
  build: {
    chunkSizeWarningLimit: 3000, // Adjusts the chunk size warning limit to 1000KB, change as needed
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendors"; // This groups all libraries from node_modules into a 'vendors' chunk
          }
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
          // You can add more conditions here to split other specific chunks as needed
        },
      },
    },
  },
});
