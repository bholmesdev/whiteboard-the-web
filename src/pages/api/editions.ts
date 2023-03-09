import { getCollection } from "astro:content";

export async function get() {
  const editions = await getCollection("editions");
  const editionsWithHeadings = await Promise.all(
    editions.map(async (edition) => {
      const { headings } = await edition.render();
      return {
        ...edition,
        headings,
      };
    })
  );

  return new Response(JSON.stringify(editionsWithHeadings));
}
