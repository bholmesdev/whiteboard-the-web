import { defineData } from "@astrojs/db";
import { Video } from "./astro.config";
import { loadEnv } from "vite";
import { z } from "zod";

const { YOUTUBE_API_KEY, YOUTUBE_PLAYLIST_ID } = loadEnv(
  process.env.NODE_ENV ?? "prod",
  process.cwd(),
  ""
);

const thumbnailResponse = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

// @see https://developers.google.com/youtube/v3/docs/search#resource
const youtubeApiResponse = z.object({
  nextPageToken: z.string().optional(),
  prevPageToken: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
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

export const data = defineData(async ({ seed }) => {
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.append("part", "snippet");
  url.searchParams.append("playlistId", YOUTUBE_PLAYLIST_ID);
  url.searchParams.append("key", YOUTUBE_API_KEY);
  url.searchParams.append("maxResults", "50");

  let nextPageToken: string | undefined;
  let items: z.infer<typeof youtubeApiResponse>["items"] = [];
  let pagesCollected = 0;
  const rawResponse = await fetch(url);
  const response = youtubeApiResponse.parse(await rawResponse.json());
  nextPageToken = response.nextPageToken;
  items.push(...response.items);

  while (nextPageToken) {
    if (pagesCollected > 20) {
      throw new Error(
        "Fetched from YouTube many times! Either there's over 1000 videos in the playlist, or the YouTube API is returning unexpected results."
      );
    }
    url.searchParams.set("pageToken", nextPageToken);
    const rawResponse = await fetch(url);
    const response = youtubeApiResponse.parse(await rawResponse.json());
    nextPageToken = response.nextPageToken;
    items.push(...response.items);
    pagesCollected++;
  }

  await seed(
    Video,
    items.map((i, idx) => {
      const thumbnail =
        i.snippet.thumbnails.high ?? i.snippet.thumbnails.default;

      return {
        id: idx + 36, // 36 was the first video uploaded to YouTube
        title: i.snippet.title,
        embedUrl: `https://www.youtube-nocookie.com/embed/${i.id}`,
        youtubeUrl: `https://www.youtube.com/watch?v=${i.id}&list=${YOUTUBE_PLAYLIST_ID}`,
        thumbnailUrl: thumbnail.url,
        thumbnailWidth: thumbnail.width,
        thumbnailHeight: thumbnail.height,
        description: i.snippet.description,
      };
    })
  );
});
