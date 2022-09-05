import { parseHTML } from "linkedom";

export const WTW = "whiteboardtheweb";

const SANCTIONED_COLORS = ["#e30570", "#6100FF", "#de230a", "#12880a"];

export function toRandomNotUglyColor() {
  const randomIdx = Math.floor(Math.random() * SANCTIONED_COLORS.length);
  return SANCTIONED_COLORS[randomIdx];
}

export function getEditionNumber(file: string): number | Error {
  const badMatch = new Error(
    "File does not match edition naming convention: #-page-name.md"
  );
  // matches first digit after the last "/" in a file path
  // ex. "/example/44/32.md" will match "32"
  const match = file.match(/(\d+)(\w|-|\.)+$/);
  if (!match) return badMatch;

  const [, rawNum] = match;
  const num = Number.parseInt(rawNum);
  if (Number.isNaN(num)) return badMatch;

  return num;
}

export function stripHtmlHeadings(rawHtml: string): string {
  const { document } = parseHTML(rawHtml);
  for (const h of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    document.removeChild(h);
  }
  return document.toString();
}

export function youtubeShortToEmbed(shortUrl: string): string {
  return (
    shortUrl
      .replace("/shorts/", "/embed/")
      .replace("youtube.com", "youtube-nocookie.com") + "?autoplay=1"
  );
}

export function youtubeShortToThumbnail(shortUrl: string): string | undefined {
  const idMatch = shortUrl.match(/\/((\w|-)+)$/);
  if (!idMatch) return undefined;

  const [, id] = idMatch;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
