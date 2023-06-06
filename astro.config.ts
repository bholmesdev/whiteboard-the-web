import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: "https://wtw.dev",
  integrations: [solid()],
  output: "server",
  adapter: vercel(),
});
