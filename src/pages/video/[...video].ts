import type { APIRoute } from 'astro'

export const get: APIRoute = ({ params }) => {
  const videoPath = `${params.video}`
  const url = new URL(videoPath, 'https://video.twimg.com/')
  console.log({url})
  return fetch(url)
}