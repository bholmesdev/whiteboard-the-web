import { parseHTML } from "linkedom";
import { EditionInfo } from "./~types";

export const WTW = "whiteboardtheweb";

const COLOR_VARIABLES = ["orange", "green", "pink", "purple"];

export function toRandomColorVariable() {
  const randomIdx = Math.floor(Math.random() * COLOR_VARIABLES.length);
  return COLOR_VARIABLES[randomIdx];
}

/** Based on Vercel recommendation - https://vercel.com/docs/concepts/functions/serverless-functions/edge-caching */
export const BIG_CACHE = "max-age=0, s-maxage=31536000";

export function colorIntersectionObserver(containerRef: HTMLElement) {
  return new IntersectionObserver(
    (changes) => {
      for (const change of changes) {
        if (change.isIntersecting && containerRef) {
          const colorHs =
            getComputedStyle(containerRef).getPropertyValue("--color-hs");
          (
            document.querySelector("#color-backdrop") as HTMLElement
          ).style.setProperty("--color-hs", colorHs);
        }
      }
    },
    { rootMargin: "0px 0px -70% 0px", threshold: 0 }
  );
}

export function getEditionInfo(id: string): EditionInfo | undefined {
  // matches file basename and first digit after the last "/" in a collection id
  // ex. "/example/44/32-eslint-prettier.md" will match "32-eslint-prettier" and "32"
  const match = id.match(/((\d+)(\w|-)+)(\w|-|\.)+$/);
  if (!match) return undefined;

  const [, base, rawNum] = match;
  const num = Number.parseInt(rawNum);
  if (Number.isNaN(num)) return undefined;

  return { base, num };
}

export function stripHtmlHeadings(rawHtml: string): string {
  const { document } = parseHTML(rawHtml);
  for (const h of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    document.removeChild(h);
  }
  return document.toString();
}

export function youtubeVidToEmbed(videoUrl: string): string {
  return (
    videoUrl
      .replace("/watch?v=", "/embed/")
      .replace("/shorts/", "/embed/")
      .replace("https://www.youtube.com", "https://www.youtube-nocookie.com")
      // map non-www URLs to www. Will raise SSL cert error without it!
      // ex. https://nocookie-youtube.com/embed/HaFORudBWhQ
      .replace("https://youtube.com", "https://www.youtube-nocookie.com") +
    "?autoplay=1"
  );
}

export function youtubeVidToThumbnail(shortUrl: string): string | undefined {
  const idMatch = shortUrl.match(/[\/=]((\w|-)+)$/);
  if (!idMatch) return undefined;

  const [, id] = idMatch;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
