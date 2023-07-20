import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  site: "https://wtw.dev",
  integrations: [solid()],
  redirects: {
    "/chat": "https://discord.gg/jBqmtCBVN4",
    "/newsletter": "https://buttondown.email/bholmesdev",
    "/rainy": "https://github.com/bholmesdev/astro-client-when-rainy-in-ny",
    "/vite-week": "https://twitter.com/BHolmesDev/status/1541423974202150913",
  },
  experimental: {
    viewTransitions: true,
  },
});
