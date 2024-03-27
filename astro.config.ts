import { defineConfig } from "astro/config";
import db from "@astrojs/db";
import vercel from "@astrojs/vercel/serverless";
import simpleStackFrame from "simple-stack-frame";
import { parse as esModuleParse } from "es-module-lexer";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  site: "https://wtw.dev",
  integrations: [db(), simpleStackFrame(), react()],
  vite: {
    esbuild: {
      keepNames: true,
    },
    plugins: [
      {
        name: "action-resolver",
        transform(code, id) {
          if (id.includes("/src/pages/")) {
            const [_, exports] = esModuleParse(code);
            if (!exports.some((exp) => exp.n === "actions")) return;

            const hasNonActionExports = exports.some(
              (exp) => exp.n !== "actions" && exp.n !== "prerender"
            );
            const formattedId = id.slice(id.indexOf("/src/pages/") + 11);
            if (hasNonActionExports) {
              throw new Error(
                `API route **${formattedId}** cannot have other exports when using 'actions'. Move other exports to a separate file.`
              );
            }
            // TODO: magic string
            return `${code}
            for (const [key, action] of Object.entries(actions)) {
              action.toString = () => 'testing'
            }`;
          }
        },
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
