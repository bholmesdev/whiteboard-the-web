import { Video, db, desc } from "astro:db";
import { createVideoSlugger } from "~utils";

export type VideoType = typeof Video.$inferSelect & { slug: string };

export async function getVideos(): Promise<VideoType[]> {
  const dbVideos = await db.select().from(Video).orderBy(desc(Video.id));
  const slugger = createVideoSlugger();
  return dbVideos.map((v) => ({
    ...v,
    slug: slugger(v.id, v.title),
  }));
}
