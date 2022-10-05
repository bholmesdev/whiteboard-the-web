import type { MarkdownInstance } from "astro";

export type VideoFrontmatter = {
  twitter: string;
  youtube: string;
};

export type VideoDocument = MarkdownInstance<VideoFrontmatter>;

export type EditionInfo = { base: string; num: number };
