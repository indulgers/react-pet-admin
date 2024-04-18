import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import path from 'path';
export default defineConfig({
  server: {
    proxy: {
      '**': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      "@pages": resolve(__dirname, "src", "pages"),
      "@components": resolve(__dirname, "src", "components"),
      "@stores": resolve(__dirname, "src", "stores"),
      "@config": resolve(__dirname, "src", "config"),
      "@services": resolve(__dirname, "src", "services"),
      "@utils": resolve(__dirname, "src", "utils"),
      "@":path.resolve(__dirname, './src')
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {

        },
        javascriptEnabled: true,
      },
    },
  },
});
