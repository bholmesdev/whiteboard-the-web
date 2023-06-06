import { defineCollection, z } from "astro:content";

const editions = defineCollection({
  schema: z.object({
    youtube: z
      .string()
      .url()
      .transform((url) => ({
        url,
        embedUrl: youtubeVidToEmbed(url),
        thumbnailUrl: youtubeVidToThumbnail(url),
      })),
    twitter: z.string().url(),
  }),
});

export const collections = {
  editions,
};

function youtubeVidToEmbed(videoUrl: string): string {
  return (
    videoUrl
      .replace("/watch?v=", "/embed/")
      .replace("/shorts/", "/embed/")
      .replace("https://www.youtube.com", "https://www.youtube-nocookie.com")
      // map non-www URLs to www. Will raise SSL cert error without it!
      // ex. https://nocookie-youtube.com/embed/HaFORudBWhQ
      .replace("https://youtube.com", "https://www.youtube-nocookie.com") +
    "?autoplay=1"
  );
}

function youtubeVidToThumbnail(shortUrl: string): string | undefined {
  const idMatch = shortUrl.match(/[\/=]((\w|-)+)$/);
  if (!idMatch) throw Error("TODO: handle default thumbnail URL");

  const [, id] = idMatch;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
