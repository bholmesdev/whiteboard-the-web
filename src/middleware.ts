import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (_, next) => {
  const actionFiles = import.meta.glob("/src/pages/**/*.{js,ts}", {
    eager: true,
  });

  for (const [fileName, mod] of Object.entries(actionFiles)) {
    if (mod.actions && typeof mod.actions === "object") {
      for (const [actionName, action] of Object.entries(mod.actions)) {
        const route = `${fileName
          .replace("/src/pages/", "")
          .replace(".ts", "")
          .replace(".js", "")}.${actionName}`;
        action.toString = () => route;
      }
    }
  }
  return next();
});
