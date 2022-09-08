import { youtubeShortToEmbed, youtubeShortToThumbnail } from "~/utils";
import Play from "./icons/Play";
import c from "./Video.module.css";
import { createSignal } from "solid-js";

type Props = {
  src: string;
  type: "youtube" | "twitter";
  title?: string;
  colorIntersectionObserver?: boolean;
};

export default function Video({
  src,
  type,
  title,
  colorIntersectionObserver = true,
}: Props) {
  let containerRef: HTMLElement | null | undefined;
  const [isPlaying, setIsPlaying] = createSignal(false);
  const isOffscreenObserver = new IntersectionObserver((changes) => {
    for (const change of changes) {
      if (!change.isIntersecting) handlePlaybackToggle(false);
    }
  });
  const isTopOfPageObserver = new IntersectionObserver(
    (changes) => {
      for (const change of changes) {
        if (change.isIntersecting && containerRef) {
          const colorHs =
            getComputedStyle(containerRef).getPropertyValue("--color-hs");
          (
            document.querySelector("#color-backdrop") as HTMLElement
          ).style.setProperty("--color-hs", colorHs);
        }
      }
    },
    { rootMargin: "0px 0px -70% 0px", threshold: 0 }
  );

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
              if (colorIntersectionObserver) {
                isTopOfPageObserver.observe(el);
              }
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
                <img
                  src={youtubeShortToThumbnail(src)}
                  alt={title}
                  width={200}
                  height={356}
                />
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
