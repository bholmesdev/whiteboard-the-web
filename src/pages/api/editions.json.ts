import { getCollection } from "astro:content";
import { getEditionInfo } from "~utils";

export const prerender = true;

export async function get() {
  const editions = await getCollection("editions");
  const editionsWithHeadings = (
    await Promise.all(
      editions.map(async (edition) => {
        const { headings } = await edition.render();
        const number = getEditionInfo(edition.id)?.num ?? 0;
        return {
          ...edition,
          headings,
          number,
        };
      })
    )
  ).sort((a, b) => b.number - a.number);

  return new Response(JSON.stringify(editionsWithHeadings));
}
