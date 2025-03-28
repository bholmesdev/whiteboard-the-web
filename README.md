# Whiteboard the Web API

> wtw.dev/anything

A serverless API built with Astro and Vercel for searching all of my YouTube videos.

## Project Overview

This project implements a serverless API that enables:

- YouTube video searching with cached results
- Direct video lookups by ID
- Automatic redirection to video URLs

## Project Structure

```
/
├── public/
│   └── favicon.ico
├── src/
│   └── pages/
│       ├── index.astro
│       ├── videos.json.ts
│       └── [search].ts
├── package.json
└── vercel.json
```

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure environment variables:
   Create a `.env` file with:
   ```
   YOUTUBE_API_KEY=your_api_key
   YOUTUBE_PLAYLIST_ID=your_playlist_id
   ```
4. Start the development server:
   ```bash
   pnpm run dev
   ```

## API breakdown

### Direct Video Lookup (`/[search]`)

Redirects to YouTube video by exact ID (ex. wtw.dev/141), or falls back to a search query (ex. wtw.dev/react-hooks or wtw.dev/react+hooks). It'll redirect to the first search result that matches.

### JSON for all videos (`/videos.json`)

Returns a list of all video information as JSON.

## Deployment Instructions

1. Fork or clone this repository
2. Create a new project on Vercel
3. Connect your repository
4. Configure environment variables in Vercel:
   - `YOUTUBE_API_KEY`
   - `YOUTUBE_PLAYLIST_ID`
5. Deploy!

## Cache Behavior

The API implements two caching strategies:

- Search results: Cached for several days to balance freshness and performance
- Direct ID lookups: Permanently cached as video IDs are immutable

## Tech Stack and Dependencies

- [Astro](https://astro.build) - Web framework
- Vercel - Serverless deployment platform
- YouTube Data API - Video data source

## Commands

All commands are run from the root of the project:

| Command            | Action                                                  |
| :----------------- | :------------------------------------------------------ |
| `pnpm install`     | Install dependencies                                    |
| `pnpm run dev`     | Start local dev server at `localhost:4321`              |
| `pnpm run build`   | Check types and build your production site to `./dist/` |
| `pnpm run preview` | Preview your build locally before deploying             |
