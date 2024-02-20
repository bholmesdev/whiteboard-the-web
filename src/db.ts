import { Thumbnail, Video, db, eq } from "astro:db";
import Slugger from "github-slugger";
import groupBy from "just-group-by";

export type VideoWithThumbnail = typeof Video.$inferSelect & {
  slug: string;
  thumbnails: Array<{
    quality: string;
    url: string;
    width: number;
    height: number;
  }>;
};

function createVideoSlugger() {
  const slugger = new Slugger();
  /** slugger misses these when stripping emojis */
  const encodedEmoji = ["⚛️", "❤️"];
  return (id: number, rawTitle: string) => {
    let title = rawTitle;
    for (const emoji of encodedEmoji) {
      title = title.replace(new RegExp(emoji, "g"), "");
    }
    return `${id}-${slugger.slug(title)}`;
  };
}

export async function getVideos(): Promise<
  Array<typeof Video.$inferSelect & { slug: string }>
> {
  const dbVideos = await db.select().from(Video);

  const slugger = createVideoSlugger();
  return dbVideos.map((video) => ({
    ...video,
    slug: slugger(video.id, video.title),
  }));
}

export async function getVideosWithThumbnail(): Promise<VideoWithThumbnail[]> {
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
    .innerJoin(Thumbnail, eq(Thumbnail.videoId, Video.id));

  const slugger = createVideoSlugger();
  const videosById = groupBy(dbVideos, (v) => v.id);
  const videos = Object.values(videosById)
    .map((videos) => {
      const { thumbnail, ...video } = videos[0]!;
      return {
        ...video,
        slug: slugger(video.id, video.title),
        thumbnails: videos.map((v) => v.thumbnail),
      };
    })
    .sort((a, b) => b.id - a.id);
  return videos;
}
