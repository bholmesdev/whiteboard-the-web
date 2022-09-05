import { youtubeShortToEmbed, youtubeShortToThumbnail } from "~/utils";
import Play from "./icons/Play";
import c from "./Video.module.css";
import { createSignal } from "solid-js";

type Props = {
  src: string;
  type: "youtube" | "twitter";
  title?: string;
};

export default function Video({ src, type, title }: Props) {
  let containerRef: HTMLElement | null | undefined;
  const [isPlaying, setIsPlaying] = createSignal(false);
  const isOffscreenObserver = new IntersectionObserver((changes) => {
    for (const change of changes) {
      if (!change.isIntersecting) handlePlaybackToggle(false);
    }
  });

  function handlePlaybackToggle(isPlaying: boolean) {
    setIsPlaying(isPlaying);
    if (isPlaying) {
      containerRef?.setAttribute("data-video-playing", "");
    } else {
      containerRef?.removeAttribute("data-video-playing");
    }
  }
  return (
    <>
      {type === "youtube" ? (
        <>
          <div
            class={c.player}
            ref={(el) => {
              isOffscreenObserver.observe(el);
              containerRef = el.closest("article");
            }}
          >
            {isPlaying() ? (
              <iframe
                width="225"
                height="400"
                src={youtubeShortToEmbed(src)}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            ) : (
              <button
                class={c.thumbnail}
                onClick={() => handlePlaybackToggle(true)}
                aria-label={`Watch - ${title}`}
              >
                <img src={youtubeShortToThumbnail(src)} alt={title} />
                <div class={c.iconContainer}>
                  <Play />
                </div>
              </button>
            )}
          </div>
        </>
      ) : null}
    </>
  );
}
