import hashtagRegex from "hashtag-regex";
import sanitize from "sanitize-html";
import { z } from "zod";
import { sqlLikeMatch } from "./util";

export type Thumbnail = {
  quality: string;
  url: string;
  width: number;
  height: number;
};

export type VideoWithThumbnail = {
  id: number;
  title: string;
  description: string;
  unformattedTitle: string;
  unformattedDescription: string;
  embedUrl: string;
  youtubeUrl: string;
  publishedAt: Date;
  thumbnails: Thumbnail[];
};

function formatTitle(text: string) {
  return text.replace(hashtagRegex(), "").trim();
}

function formatDescription(text: string) {
  return (
    sanitize(text)
      .replace(hashtagRegex(), "")
      // Support basic YouTube comment formatting
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(
        /\bhttps?:\/\/\S+\b/g,
        (match) => `<a href="${match}">${match}</a>`
      )
      .trim()
  );
}

export async function getPlaylist(
  query?: string
): Promise<VideoWithThumbnail[]> {
  const { YOUTUBE_API_KEY, YOUTUBE_PLAYLIST_ID } = import.meta.env;
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.append("part", "snippet");
  url.searchParams.append("part", "contentDetails");
  url.searchParams.append("playlistId", YOUTUBE_PLAYLIST_ID);
  url.searchParams.append("key", YOUTUBE_API_KEY);
  url.searchParams.append("maxResults", "50");

  let nextPageToken: string | undefined;
  const items: z.infer<typeof youtubeApiResponse>["items"] = [];
  let pagesCollected = 0;
  const rawResponse = await fetchWithDevCache(url).then((res) => res.json());
  const response = youtubeApiResponse.parse(rawResponse);
  nextPageToken = response.nextPageToken;
  items.push(...response.items);

  while (nextPageToken) {
    if (pagesCollected > 20) {
      throw new Error(
        "Fetched from YouTube many times! Either there's over 1000 videos in the playlist, or the YouTube API is returning unexpected results."
      );
    }
    url.searchParams.set("pageToken", nextPageToken);
    const rawResponse = await fetchWithDevCache(url.href).then((res) =>
      res.json()
    );
    const response = youtubeApiResponse.parse(rawResponse);
    nextPageToken = response.nextPageToken;
    items.push(...response.items);
    pagesCollected++;
  }

  const mappedItems = items
    .filter(
      (item): item is z.infer<typeof videoSchema> =>
        item.snippet.title !== "Deleted video" &&
        item.snippet.title !== "Private video"
    )
    .sort(
      (a, b) =>
        b.contentDetails.videoPublishedAt.getTime() -
        a.contentDetails.videoPublishedAt.getTime()
    )
    .map((item, idx) => {
      const id = items.length - 1 - idx + 35; // edition 35 was my first upload to YouTube
      const title = formatTitle(item.snippet.title);
      const description = formatDescription(item.snippet.description);
      return {
        id,
        title,
        description,
        unformattedTitle: item.snippet.title,
        unformattedDescription: item.snippet.description,
        embedUrl: `https://www.youtube-nocookie.com/embed/${item.snippet.resourceId.videoId}?autoplay=1`,
        youtubeUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}&list=${YOUTUBE_PLAYLIST_ID}`,
        publishedAt: item.contentDetails.videoPublishedAt,
        thumbnails: Object.entries(item.snippet.thumbnails)
          .map(([quality, thumbnail]) => {
            if (!thumbnail) return;
            return {
              quality,
              url: thumbnail.url,
              width: thumbnail.width,
              height: thumbnail.height,
            };
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item)),
      };
    });

  if (!query) return mappedItems;

  return mappedItems.filter((item) => {
    return (
      sqlLikeMatch(query, item.unformattedTitle) ||
      sqlLikeMatch(query, item.unformattedDescription)
    );
  });
}

const thumbnailResponse = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

const deletedVideoSchema = z.object({
  snippet: z.object({
    title: z.literal("Deleted video"),
  }),
});

const privateVideoSchema = z.object({
  snippet: z.object({
    title: z.literal("Private video"),
  }),
});

const videoSchema = z.object({
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
});

// @see https://developers.google.com/youtube/v3/docs/search#resource
const youtubeApiResponse = z.object({
  nextPageToken: z.string().optional(),
  prevPageToken: z.string().optional(),
  items: z.array(deletedVideoSchema.or(privateVideoSchema).or(videoSchema)),
});

async function fetchWithDevCache(url: URL | string, init: RequestInit = {}) {
  if (import.meta.env.DEV) {
    const { default: EleventyFetch } = await import("@11ty/eleventy-fetch");
    const res = await EleventyFetch(url.toString(), {
      duration: "1h",
      type: "json",
    });
    return new Response(JSON.stringify(res), {
      headers: {
        "Content-type": "application/json",
      },
    });
  }
  return await fetch(url, init);
}
