import type { Variant } from '../_types';

function handleVideoPlay (event: any) {
  const container = event.currentTarget?.closest('article')
  container.toggleAttribute('data-video-playing')
}

type Props = {
  variants: Variant[];
}

export default function Video({ variants }: Props) {
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
            <source src={url} type={content_type} data-bit-rate={bit_rate} />
          ))}
      </video>
    </>
  )
}