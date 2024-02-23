import { getVideosWithThumbnail } from "src/db";

export async function GET() {
  const videos = await getVideosWithThumbnail();

  return new Response(JSON.stringify(videos));
}
