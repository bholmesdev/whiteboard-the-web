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

const templateToShownMap = new WeakMap<HTMLTemplateElement, Element>();

export function showTemplate(template: HTMLTemplateElement) {
  const content = template.content.cloneNode(true);
  if (!(content instanceof DocumentFragment) || !content.firstElementChild) {
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

export function toggleTemplate(template: HTMLTemplateElement, force?: boolean) {
  if (force ?? !templateToShownMap.has(template)) {
    showTemplate(template);
  } else {
    hideTemplate(template);
  }
}
