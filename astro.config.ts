import { defineConfig } from "astro/config";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";
import { Thumbnail, Video, data } from "./db.config";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: vercel(),
  site: "https://wtw.dev",
  integrations: [db()],
  db: {
    tables: {
      Video,
      Thumbnail,
    },
    data,
  },
  vite: {
    esbuild: {
      keepNames: true,
    },
  },
});
