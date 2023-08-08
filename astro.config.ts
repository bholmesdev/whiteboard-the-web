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
    "/transitions": "https://twitter.com/BHolmesDev/status/1682206832423579649",
    "/linear": "https://linear-easing-generator.netlify.app",
    "/button": "https://codepen.io/bholmesdev-the-reactor/full/xxQBvqR",
  },
  experimental: {
    viewTransitions: true,
  },
});
