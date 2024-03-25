import type { APIContext } from "astro";
import { z } from "zod";

const formContentTypes = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
];

export const POST = async ({ request, redirect }: APIContext) => {
  // TODO: run from virtual module for caching
  const actionHandlers = setupActionHandlers();

  // TODO: robust URL formatting
  const url = new URL(request.url).pathname.replace(/^\//, "");
  const handler = actionHandlers[url];
  if (!handler) return new Response("Action not found", { status: 404 });

  // TODO: JSON vs formdata based on content-type
  let args: unknown;
  const contentType = request.headers.get("Content-Type");
  if (contentType === "application/json") {
    args = await request.json();
  }
  if (formContentTypes.some((f) => contentType?.startsWith(f))) {
    args = await request.formData();
  }
  const result = await handler(args);

  if (request.headers.get("Accept") === "application/json") {
    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return redirect(request.headers.get("Referer") || "/");
};

const actionsExportSchema = z.object({
  actions: z.record(z.function()),
});

function setupActionHandlers() {
  const actionRoutes: Record<string, (...args: unknown[]) => unknown> = {};
  const actionFiles = import.meta.glob("/src/pages/**/*.{js,ts}", {
    eager: true,
  });
  for (const [fileName, mod] of Object.entries(actionFiles)) {
    const parsed = actionsExportSchema.safeParse(mod);
    if (!parsed.success) continue;

    for (const [actionName, action] of Object.entries(parsed.data.actions)) {
      const route = `${fileName
        .replace("/src/pages/", "")
        .replace(".ts", "")
        .replace(".js", "")}.${actionName}`;

      // biome-ignore lint/suspicious/noExplicitAny: Update original object reference to mutate component handler
      (mod as any).actions[actionName].toString = () => route;
      actionRoutes[route] = action;
    }
  }
  return actionRoutes;
}
