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
  const [playing, setPlaying] = createSignal(false);

  function handleVideoPlay(event: any) {
    const container = event.currentTarget?.closest("article");
    container.toggleAttribute("data-video-playing");
    setPlaying(true);
  }
  return (
    <>
      {type === "youtube" ? (
        <>
          <div class={c.player}>
            {playing() ? (
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
                onClick={handleVideoPlay}
                aria-label={`Watch "${title}"`}
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
