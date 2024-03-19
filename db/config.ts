import { column, defineDb, defineTable } from "astro:db";

const Video = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    embedUrl: column.text(),
    youtubeUrl: column.text(),
    description: column.text(),
    publishedAt: column.date(),
  },
});

const Thumbnail = defineTable({
  columns: {
    videoId: column.number({ references: () => Video.columns.id }),
    // TODO: enum validator with zod?
    quality: column.text(),
    url: column.text(),
    width: column.number(),
    height: column.number(),
  },
});

export default defineDb({
  tables: { Video, Thumbnail },
});
