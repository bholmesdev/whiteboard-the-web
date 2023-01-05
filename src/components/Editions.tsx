import { default as UFuzzy } from "@leeoniya/ufuzzy";
import { CollectionEntry } from "astro:content";
import { createEffect, createSignal } from "solid-js";
import { getEditionInfo } from "~utils";
import Video from "./Video";

let u = new UFuzzy();

function search(list: string[], term: string) {
  const unsortedIdxs = u.filter(list, term);
  const info = u.info(unsortedIdxs, list, term);
  const order = u.sort(info, list, term);

  return {
    lookup: (idx: number) => info.idx[order[idx]],
    order,
  };
}

type ProcessedEdition = CollectionEntry<"editions"> & { title?: string };

export default function Editions(props: { editions: ProcessedEdition[] }) {
  const [searchTerm, setSearchTerm] = createSignal("Zod");
  const [filteredEditions, setFilteredEditions] = createSignal<
    ProcessedEdition[]
  >([]);

  createEffect(() => {
    const titles = props.editions.map((e) => e.title ?? "");
    const { lookup, order } = search(titles, searchTerm());

    let allFilteredEditions: ProcessedEdition[] = [];

    for (let i = 0; i < order.length; i++) {
      // using info.idx here instead of idxs because uf.info() may have
      // further reduced the initial idxs based on prefix/suffix rules
      allFilteredEditions.push(props.editions[lookup(i)]);
    }

    setFilteredEditions(allFilteredEditions);
  });

  return (
    <>
      <label for="search">Search</label>
      <input
        id="search"
        type="text"
        value={searchTerm()}
        onInput={(e) => setSearchTerm(e.currentTarget.value)}
      />
      <ul>
        {filteredEditions().map((edition) => (
          <li>{edition.title}</li>
        ))}
      </ul>
    </>
  );
}
