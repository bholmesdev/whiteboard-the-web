import { getPlaylist } from "../db";

export async function GET() {
  const videos = await getPlaylist();

  return new Response(JSON.stringify(videos), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
