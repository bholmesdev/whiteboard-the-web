import { Video, db, desc } from "astro:db";
import Slugger from "github-slugger";

export type VideoType = typeof Video.$inferSelect & { slug: string };

function createVideoSlugger() {
  const slugger = new Slugger();
  return (id: number, title: string) => `${id}-${slugger.slug(title)}`;
}

export async function getVideos(): Promise<VideoType[]> {
  const dbVideos = await db.select().from(Video).orderBy(desc(Video.id));
  const slugger = createVideoSlugger();
  /** slugger misses these when stripping emojis */
  const encodedEmoji = ["⚛️", "❤️"];
  return dbVideos.map((v) => {
    let title = v.title;
    for (const emoji of encodedEmoji) {
      title = title.replace(new RegExp(emoji, "g"), "");
    }
    return {
      ...v,
      slug: slugger(v.id, title),
    };
  });
}
