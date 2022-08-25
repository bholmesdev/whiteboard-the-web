import type { JSX } from 'solid-js'; 
import type { Variant } from '../_types';

function handleVideoPlay (event: any) {
  const container = event.currentTarget?.closest('article')
  container.toggleAttribute('data-video-playing')
}

function toProxyUrl(url: string) {
  return url.replace(new RegExp(`^https://video.twimg.com/`), '/video/')
}

type Props = {
  variants: Variant[];
  playButtonChildren: JSX.Element;
}

export default function Video({ variants, playButtonChildren }: Props) {
  return (
    <>
      <video
        onPlay={handleVideoPlay}
        onPause={handleVideoPlay}
        crossorigin="anonymous"
        controls>
          {variants
          .sort((a, b) => (b.bit_rate ?? 0) - (a.bit_rate ?? 0))
          .map(({ content_type, url, bit_rate }) => (
            <source src={toProxyUrl(url)} type={content_type} data-bit-rate={bit_rate} />
          ))}
      </video>
      {/* TODO: pass through heading */}
      <div data-video-overlay>
        <button aria-label="Play edition XX">
          {playButtonChildren}
        </button>
      </div>
    </>
  )
}