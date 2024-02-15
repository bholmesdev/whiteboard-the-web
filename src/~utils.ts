import { parseHTML } from "linkedom";
import type { EditionInfo } from "~types";
import Slugger from "github-slugger";

export const WTW = "whiteboardtheweb";

const COLOR_VARIABLES = ["orange", "green", "pink", "purple"];

export function toRandomColorVariable() {
  const randomIdx = Math.floor(Math.random() * COLOR_VARIABLES.length);
  return COLOR_VARIABLES[randomIdx];
}

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

export function createVideoSlugger() {
  const slugger = new Slugger();
  return (id: number, title: string) => `${id}-${slugger.slug(title)}`;
}

const templateToShownMap = new WeakMap<HTMLTemplateElement, Element>();

export function showTemplate(template: HTMLTemplateElement) {
  const content = template.content.cloneNode(true);
  if (!(content instanceof DocumentFragment) || !content.firstElementChild) {
    console.log(content.firstChild);
    throw new Error(
      "Template show failed. Template does not have any content."
    );
  }
  if (!template.parentElement) {
    throw new Error(
      "Template show failed. Template does not have a parent element. Does the template exist in the document?"
    );
  }
  const element = template.insertAdjacentElement(
    "afterend",
    content.firstElementChild
  );
  if (!element) {
    throw new Error(
      "Template show failed. Could not insert content after template."
    );
  }
  templateToShownMap.set(template, element);
  return element;
}

export function hideTemplate(template: HTMLTemplateElement) {
  const shown = templateToShownMap.get(template);
  if (shown) {
    shown.remove();
    templateToShownMap.delete(template);
  }
}

export function toggleTemplate(template: HTMLTemplateElement) {
  if (templateToShownMap.has(template)) {
    hideTemplate(template);
  } else {
    showTemplate(template);
  }
}
