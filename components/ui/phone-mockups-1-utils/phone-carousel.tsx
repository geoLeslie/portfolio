"use client";

/**
 * Stacked iPhone mockups for app screenshots, on a transparent background.
 * The current screen is on a light-rimmed phone in front; the previous and
 * next screens are on dimmed phones behind it, left and right.
 *
 * - Previous / Next rotate the stack: the phones slide and swap places, so
 *   the next screen moves forward into the front and the old one moves back.
 * - The stack advances on its own every few seconds; the middle button
 *   pauses/plays it (paused from the start if the visitor prefers reduced motion).
 * - On hover the front phone tilts and lifts and the back phones spread out.
 *
 * Written for this site (the 21st.dev component's phone-carousel file wasn't
 * included), using the site's greys/white, lucide-react icons and no extra packages.
 */
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export interface ImageItem {
  src: string;
  alt: string;
}

const AUTOPLAY_MS = 3500; // time each screen stays in front while playing
const PHONE_W = 230; // px
const BACK_X = 120; // how far the back phones sit left/right of centre (px)
const BACK_Y = 64; // how much lower the back phones sit (px)

type Slot = "front" | "left" | "right" | "hidden";

const SLOT_STYLE: Record<Slot, { transform: string; zIndex: number; opacity: number }> = {
  front: { transform: "translate(0, 0) scale(1)", zIndex: 20, opacity: 1 },
  left: { transform: `translate(-${BACK_X}px, ${BACK_Y}px) scale(0.95)`, zIndex: 10, opacity: 1 },
  right: { transform: `translate(${BACK_X}px, ${BACK_Y}px) scale(0.95)`, zIndex: 10, opacity: 1 },
  hidden: { transform: `translate(0, ${BACK_Y}px) scale(0.85)`, zIndex: 0, opacity: 0 },
};

// Extra movement on hover, per slot.
const SLOT_HOVER: Record<Slot, string> = {
  front: "group-hover:-translate-y-2 group-hover:rotate-[-5deg]",
  left: "group-hover:-translate-x-3",
  right: "group-hover:translate-x-3",
  hidden: "",
};

const MOVE = "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-0";

function Phone({ image, front }: { image: ImageItem; front: boolean }) {
  const part = (on: string, off: string) => `transition-colors ${MOVE} ${front ? on : off}`;
  return (
    <div
      className={`relative rounded-[2.6rem] p-[9px] ring-2 transition-[background-color,box-shadow] ${MOVE} ${
        front ? "bg-[#262626] ring-neutral-200" : "bg-[#1c1c1c] ring-neutral-700"
      }`}
    >
      {/* Side buttons */}
      <span aria-hidden="true" className={`absolute -left-[3px] top-[18%] h-[5%] w-[3px] rounded-l ${part("bg-neutral-300", "bg-neutral-700")}`} />
      <span aria-hidden="true" className={`absolute -left-[3px] top-[26%] h-[9%] w-[3px] rounded-l ${part("bg-neutral-300", "bg-neutral-700")}`} />
      <span aria-hidden="true" className={`absolute -right-[3px] top-[22%] h-[14%] w-[3px] rounded-r ${part("bg-neutral-300", "bg-neutral-700")}`} />
      {/* Top speaker slit */}
      <span aria-hidden="true" className={`absolute left-1/2 top-[3px] h-[3px] w-1/5 -translate-x-1/2 rounded-full ${part("bg-neutral-400", "bg-neutral-700")}`} />

      {/* Screen */}
      <div className={`relative aspect-[9/19.5] overflow-hidden rounded-[2.1rem] ${part("bg-neutral-100", "bg-neutral-600")}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={front ? image.alt : ""}
          loading="lazy"
          className={`h-full w-full object-cover object-top transition-opacity ${MOVE} ${front ? "opacity-100" : "opacity-40"}`}
        />
        {/* Dynamic island */}
        <span
          aria-hidden="true"
          className={`absolute left-1/2 top-3 flex h-7 w-[34%] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2.5`}
        >
          <span className="size-2 rounded-full bg-neutral-800 ring-1 ring-neutral-700" />
        </span>
      </div>
    </div>
  );
}

const CONTROL =
  "grid size-11 place-items-center rounded-full bg-neutral-500/85 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function PhoneCarousel({
  images,
  className = "",
}: {
  images: ImageItem[];
  className?: string;
}) {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  // Start paused for visitors who prefer reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  // Autoplay. Restarts its timer after every change, so a click gets the full interval.
  useEffect(() => {
    if (!playing || count < 2) return;
    const id = window.setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [playing, index, count, go]);

  if (count === 0) return null;

  const slotOf = (i: number): Slot => {
    const offset = (i - index + count) % count;
    if (offset === 0) return "front";
    if (offset === 1) return "right";
    if (offset === count - 1) return "left";
    return "hidden";
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="App screens"
      className={`group relative h-[570px] w-[460px] max-w-full ${className}`}
    >
      {images.map((img, i) => {
        const slot = slotOf(i);
        return (
          <div
            key={img.src + i}
            aria-hidden={slot !== "front"}
            onClick={slot === "left" ? () => go(index - 1) : slot === "right" ? () => go(index + 1) : undefined}
            className={`absolute left-1/2 top-0 transition-[transform,opacity] ${MOVE} ${
              slot === "left" || slot === "right" ? "cursor-pointer" : ""
            }`}
            style={{ width: PHONE_W, marginLeft: -PHONE_W / 2, ...SLOT_STYLE[slot] }}
          >
            <div className={`transition-transform ${MOVE} ${SLOT_HOVER[slot]}`}>
              <Phone image={img} front={slot === "front"} />
            </div>
          </div>
        );
      })}

      {/* Controls, over the bottom of the front screen */}
      {count > 1 && (
        <div className="absolute left-1/2 top-[410px] z-30 flex -translate-x-1/2 items-center gap-5">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous screen" className={CONTROL}>
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            aria-pressed={!playing}
            className={CONTROL}
          >
            {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next screen" className={CONTROL}>
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}

      {/* Announce the current screen to screen readers */}
      <p className="sr-only" aria-live={playing ? "off" : "polite"}>
        Screen {index + 1} of {count}: {images[index].alt}
      </p>
    </div>
  );
}
