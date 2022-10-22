import {
  colorIntersectionObserver,
  youtubeVidToEmbed,
  youtubeVidToThumbnail,
} from "~utils";
import { EditionInfo } from "~types";
import Play from "./icons/Play";
import c from "./Video.module.css";
import { createEffect, createSignal } from "solid-js";

type Props = {
  src: string;
  type: "youtube" | "twitter";
  title?: string;
  hasColorIntersectionObserver?: boolean;
  editionInfo?: EditionInfo;
};

export default function Video({
  src,
  type,
  title,
  hasColorIntersectionObserver = true,
  editionInfo,
}: Props) {
  let containerRef: HTMLElement | null | undefined;
  const [isPlaying, setIsPlaying] = createSignal(false);
  createEffect(() => {
    if (containerRef) {
      const isOffscreenObserver = new IntersectionObserver((changes) => {
        for (const change of changes) {
          if (!change.isIntersecting) handlePlaybackToggle(false);
        }
      });
      isOffscreenObserver.observe(containerRef);
      if (hasColorIntersectionObserver) {
        const isTopOfPageObserver = colorIntersectionObserver(containerRef);
        isTopOfPageObserver.observe(containerRef);
      }
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
              containerRef = el.closest("article");
            }}
          >
            {isPlaying() ? (
              <iframe
                width="225"
                height="400"
                src={youtubeVidToEmbed(src)}
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
                  src={youtubeVidToThumbnail(src)}
                  alt={title}
                  width={200}
                  height={356}
                  // special case: remove black borders from thumbnail crop
                  style={editionInfo?.num === 39 ? "transform: scale(1.4)" : ""}
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
