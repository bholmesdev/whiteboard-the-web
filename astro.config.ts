import { defineConfig } from "astro/config";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";
import simpleStackFrame from "simple-stack-frame";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  site: "https://wtw.dev",
  integrations: [db(), simpleStackFrame()],
  vite: {
    esbuild: {
      keepNames: true,
    },
    plugins: [
      {
        name: "action-resolver",
        load(id, options) {
          if (id.includes("/src/pages/")) {
            if (options?.ssr) return;
            return `
            export const actions = {
              checkout: async (formData) => {
                const res = await fetch('api.checkout', {
                  method: 'POST',
                  body: formData,
                  headers: {
                    Accept: 'application/json',
                  }
                });
                return res.json();
              }
            }
          `;
          }
        },
      },
    ],
  },
});
