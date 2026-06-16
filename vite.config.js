import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import PrerenderPlugin from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";

export default defineConfig({
  plugins: [
    react(),
    PrerenderPlugin({
      routes: [
        "/",
        "/services",
        "/projects",
        "/templates",
        "/contact",
        "/termeni-si-conditii",
        "/politica-de-confidentialitate",
        "/politica-cookies-gdpr",
      ],
      renderer: new PuppeteerRenderer({
        renderAfterTime: 3000,
        maxConcurrentRoutes: 1,
        headless: true,
        launchOptions: {
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      }),
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5170",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:5170",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
