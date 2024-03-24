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
            // TODO: use pagesDir and id resolve
            const pagesDir = new URL("src/pages/", import.meta.url).pathname;
            const path = id.replace(pagesDir, "").replace(/\.(ts|js)$/, "");
            return `
            const actionProxy = new Proxy({}, {
              get: (_, action) => {
                return async (formData) => {
                  const res = await fetch(\`${path}.\${action}\`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                      Accept: 'application/json',
                    }
                  });
                  return res.json();
                };
              },
            });

            export const actions = actionProxy;
          `;
          }
        },
      },
    ],
  },
});
