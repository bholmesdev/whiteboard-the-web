import { defineCollection, z } from "astro:content";

const editions = defineCollection({
  schema: {
    youtube: z.string().url(),
    twitter: z.string().url(),
  },
});

export const collections = {
  editions,
};
