import { Thumbnail, Video, db, eq, like, or } from "astro:db";
import Slugger from "github-slugger";
import groupBy from "just-group-by";
import emojiRegex from "emoji-regex";
import hashtagRegex from "hashtag-regex";
import sanitize from "sanitize-html";

export type VideoWithThumbnail = typeof Video.$inferSelect & {
  slug: string;
  thumbnails: Array<{
    quality: string;
    url: string;
    width: number;
    height: number;
  }>;
};

export async function getVideos(): Promise<
  Array<typeof Video.$inferSelect & { slug: string }>
> {
  const dbVideos = await db.select().from(Video);

  const slugger = createVideoSlugger();
  return dbVideos.map((video) => {
    const title = formatTitle(video.title);
    const description = formatDescription(video.description);
    const slug = slugger(video.id, title);
    return {
      ...video,
      title,
      description,
      slug,
    };
  });
}

export async function getVideosWithThumbnail(
  query = ""
): Promise<VideoWithThumbnail[]> {
  console.log(query);
  const dbVideos = await db
    .select({
      id: Video.id,
      title: Video.title,
      embedUrl: Video.embedUrl,
      youtubeUrl: Video.youtubeUrl,
      publishedAt: Video.publishedAt,
      description: Video.description,
      thumbnail: {
        quality: Thumbnail.quality,
        url: Thumbnail.url,
        width: Thumbnail.width,
        height: Thumbnail.height,
      },
    })
    .from(Video)
    .innerJoin(Thumbnail, eq(Thumbnail.videoId, Video.id))
    .where(
      or(like(Video.title, `%${query}%`), like(Video.description, `%${query}%`))
    );

  const slugger = createVideoSlugger();
  const videosById = groupBy(dbVideos, (v) => v.id);
  const videos = Object.values(videosById)
    .map((videos) => {
      const { thumbnail, ...video } = videos[0]!;
      const title = formatTitle(video.title);
      const description = formatDescription(video.description);
      const slug = slugger(video.id, title);
      return {
        ...video,
        title,
        description,
        slug,
        thumbnails: videos.map((v) => v.thumbnail),
      };
    })
    .sort((a, b) => b.id - a.id);
  return videos;
}

function createVideoSlugger() {
  const slugger = new Slugger();
  /** slugger misses these when stripping emojis */
  return (id: number, rawTitle: string) => {
    const title = rawTitle.replace(emojiRegex(), "").trim();
    return `${id}-${slugger.slug(title)}`;
  };
}

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
