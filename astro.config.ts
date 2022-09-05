import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import vercel from "@astrojs/vercel/serverless";
import { getEditionNumber } from "./src/utils";
import { visit } from "unist-util-visit";

function remarkDefaultLayout() {
  return (tree, { basename, data }) => {
    if (typeof getEditionNumber(basename) === "number") {
      data.astro.frontmatter.layout = "~/layouts/Edition.astro";
    }
  };
}

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDefaultLayout],
    extendDefaultPlugins: true,
  },
  integrations: [solid()],
  output: "server",
  adapter: vercel(),
});
