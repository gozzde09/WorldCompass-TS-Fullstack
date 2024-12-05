import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
