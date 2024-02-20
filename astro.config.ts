import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import db from "@astrojs/db";
import { Thumbnail, Video, data } from "./db.config";

// https://astro.build/config
export default defineConfig({
  site: "https://wtw.dev",
  integrations: [solid(), db()],
  db: {
    collections: { Video, Thumbnail },
    data,
  },
  redirects: {
    "/chat": "https://discord.gg/jbqmtcbvn4",
    "/newsletter": "https://buttondown.email/bholmesdev",
    "/rainy": "https://github.com/bholmesdev/astro-client-when-rainy-in-ny",
    "/vite-week": "https://twitter.com/bholmesdev/status/1541423974202150913",
    "/transitions": "https://twitter.com/bholmesdev/status/1682206832423579649",
    "/linear": "https://linear-easing-generator.netlify.app",
    "/button": "https://codepen.io/bholmesdev-the-reactor/full/xxqbvqr",
    "/react-context-setter":
      "https://stackblitz.com/edit/vitejs-vite-3ubqht?file=src%2fapp.tsx",
    "/tw-text":
      "https://www.fluid-type-scale.com/calculate?minFontSize=16&minWidth=400&minRatio=1.25&maxFontSize=19&maxWidth=1280&maxRatio=1.333&steps=sm,base,lg,xl,2xl,3xl,4xl,5xl,6xl&baseStep=base&prefix=font-size&decimals=2&useRems=on&remValue=16&previewFont=Italiana&previewText=Almost+before+we+knew+it,+we+had+left+the+ground&previewWidth=1280",
  },
});
