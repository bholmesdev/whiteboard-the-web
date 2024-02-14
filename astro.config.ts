import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";
import { loadEnv } from "vite";
import { z } from "zod";

const { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } = loadEnv(
  process.env.NODE_ENV ?? "prod",
  process.cwd(),
  ""
);

import db, { defineCollection, field } from "@astrojs/db";

const Video = defineCollection({
  fields: {
    id: field.number({ primaryKey: true }),
    title: field.text(),
    embedUrl: field.text(),
    thumbnailUrl: field.text(),
    thumbnailWidth: field.number(),
    thumbnailHeight: field.number(),
    description: field.text(),
  },
});

const thumbnailResponse = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

// @see https://developers.google.com/youtube/v3/docs/search#resource
const youtubeApiResponse = z.object({
  items: z.array(
    z.object({
      id: z.object({
        videoId: z.string(),
      }),
      snippet: z.object({
        title: z.string(),
        description: z.string(),
        thumbnails: z.object({
          default: thumbnailResponse,
          medium: thumbnailResponse.optional(),
          high: thumbnailResponse.optional(),
        }),
      }),
    })
  ),
});

// https://astro.build/config
export default defineConfig({
  site: "https://wtw.dev",
  integrations: [solid(), db()],
  db: {
    collections: { Video },
    async data({ seed }) {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.append("part", "snippet");
      url.searchParams.append("type", "video");
      url.searchParams.append("channelId", YOUTUBE_CHANNEL_ID);
      url.searchParams.append("key", YOUTUBE_API_KEY);
      const rawResponse = await fetch(url);

      const response = youtubeApiResponse.parse(await rawResponse.json());
      response.items.reverse();
      await seed(
        Video,
        response.items.map((i, idx) => {
          const thumbnail =
            i.snippet.thumbnails.high ?? i.snippet.thumbnails.default;
          return {
            id: idx + 36, // 36 was the first video uploaded to YouTube
            title: i.snippet.title,
            embedUrl: `https://www.youtube-nocookie.com/embed/${i.id.videoId}`,
            thumbnailUrl: thumbnail.url,
            thumbnailWidth: thumbnail.width,
            thumbnailHeight: thumbnail.height,
            description: i.snippet.description,
          };
        })
      );
    },
  },
  redirects: {
    // "/chat": "https://discord.gg/jBqmtCBVN4",
    // "/newsletter": "https://buttondown.email/bholmesdev",
    // "/rainy": "https://github.com/bholmesdev/astro-client-when-rainy-in-ny",
    // "/vite-week": "https://twitter.com/BHolmesDev/status/1541423974202150913",
    // "/transitions": "https://twitter.com/BHolmesDev/status/1682206832423579649",
    // "/linear": "https://linear-easing-generator.netlify.app",
    // "/button": "https://codepen.io/bholmesdev-the-reactor/full/xxQBvqR",
    // "/react-context-setter":
    //   "https://stackblitz.com/edit/vitejs-vite-3ubqht?file=src%2FApp.tsx",
    // "/tw-text":
    //   "https://www.fluid-type-scale.com/calculate?minFontSize=16&minWidth=400&minRatio=1.25&maxFontSize=19&maxWidth=1280&maxRatio=1.333&steps=sm,base,lg,xl,2xl,3xl,4xl,5xl,6xl&baseStep=base&prefix=font-size&decimals=2&useRems=on&remValue=16&previewFont=Italiana&previewText=Almost+before+we+knew+it,+we+had+left+the+ground&previewWidth=1280",
  },
});
