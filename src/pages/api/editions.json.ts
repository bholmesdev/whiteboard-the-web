import { getVideosWithThumbnail } from "src/db";

export async function get() {
  const videos = await getVideosWithThumbnail();

  return new Response(JSON.stringify(videos));
}
