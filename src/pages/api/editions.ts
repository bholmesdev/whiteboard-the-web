import { getCollection } from "astro:content";

export async function get() {
  return new Response(JSON.stringify(await getCollection("editions")));
}
