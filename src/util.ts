export function isEmptyString(str: unknown) {
  return typeof str === "string" && str.trim() === "";
}

export function safeParseNumber(str: unknown) {
  if (isEmptyString(str)) return null;
  const parsed = Number(str);
  if (isNaN(parsed)) return null;
  if (!isFinite(parsed)) return null;
  return parsed;
}

/**
 * Format a search query from a URL part for exact text match.
 * Example: "react+hooks" -> "react hooks"
 * Example: "react-hooks" -> "react hooks"
 * Example: "react hooks" -> "react hooks"
 * @param query
 */
export function formatSearchQuery(query: string) {
  return query.replace(/[+\-_]/g, " ");
}

export function sqlLikeMatch(query: string, str: string) {
  const queryWords = query.split(/\s+/);
  return queryWords.every((word) =>
    str.toLowerCase().includes(word.toLowerCase())
  );
}

export const CACHE_FOR_A_FEW_DAYS = "public, s-maxage=604800";
export const CACHE_FOREVER = "public, s-maxage=31536000";
