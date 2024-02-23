import { defineData, defineReadableTable, column } from "@astrojs/db";
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
      snippet: z.object({
        title: z.string(),
        description: z.string(),
        thumbnails: z.object({
          default: thumbnailResponse,
          medium: thumbnailResponse.optional(),
          high: thumbnailResponse.optional(),
        }),
        resourceId: z.object({
          videoId: z.string(),
        }),
      }),
      contentDetails: z.object({
        videoPublishedAt: z.coerce.date(),
      }),
    })
  ),
});

export const Video = defineReadableTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    embedUrl: column.text(),
    youtubeUrl: column.text(),
    description: column.text(),
    publishedAt: column.date(),
  },
});

export const Thumbnail = defineReadableTable({
  columns: {
    videoId: column.number({ references: () => Video.columns.id }),
    // TODO: enum validator with zod?
    quality: column.text(),
    url: column.text(),
    width: column.number(),
    height: column.number(),
  },
});

export const data = defineData(async ({ seed, seedReturning }) => {
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.append("part", "snippet");
  url.searchParams.append("part", "contentDetails");
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

  const sortedItems = items.sort((a, b) => {
    return (
      a.contentDetails.videoPublishedAt.getTime() -
      b.contentDetails.videoPublishedAt.getTime()
    );
  });

  for (const [idx, item] of sortedItems.entries()) {
    const { id } = await seedReturning(Video, {
      id: idx + 36, // edition 36 was my first upload to YouTube
      title: item.snippet.title,
      embedUrl: `https://www.youtube-nocookie.com/embed/${item.snippet.resourceId.videoId}?autoplay=1`,
      youtubeUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}&list=${YOUTUBE_PLAYLIST_ID}`,
      description: item.snippet.description,
      publishedAt: item.contentDetails.videoPublishedAt,
    });
    for (const [quality, thumbnail] of Object.entries(
      item.snippet.thumbnails
    )) {
      if (!thumbnail) continue;
      await seed(Thumbnail, {
        videoId: id,
        quality,
        url: thumbnail.url,
        width: thumbnail.width,
        height: thumbnail.height,
      });
    }
  }
});
