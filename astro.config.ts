import { defineConfig } from "astro/config";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";
import simpleStackFrame from "simple-stack-frame";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: vercel(),
  site: "https://wtw.dev",
  integrations: [db(), simpleStackFrame()],
  vite: {
    esbuild: {
      keepNames: true,
    },
  },
});
