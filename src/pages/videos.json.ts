import { getPlaylist } from "../db";
import { CACHE_FOR_A_FEW_DAYS } from "../util";

export async function GET() {
  const videos = await getPlaylist();

  return new Response(JSON.stringify(videos), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": CACHE_FOR_A_FEW_DAYS,
    },
  });
}
