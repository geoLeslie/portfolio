"use client";

// Adapted from 21st.dev "Gallery4": only the image cards and the
// Previous/Next buttons are kept. The shadcn Button and Carousel (Embla)
// are replaced by a native scroll-snap track, and shadcn colour tokens by
// the site's own greys, so no extra packages are needed.

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GlowCard, GlowCardStyles } from "@/components/ui/spotlight-card";

// Spotlight glow frame around each gallery card. Set to true to turn it back on.
const USE_GLOW_CARDS = true;

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  image: string;
  href?: string;
}

export interface Gallery4Props {
  title?: string;
  items: Gallery4Item[];
}

const GAP_PX = 20;
// Number of position dots under the gallery.
const DOT_COUNT = 3;

export function Gallery4({ title = "Gallery", items }: Gallery4Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Start enabled: the row is hidden behind the landing zoom when it first
  // mounts, so an early measurement would wrongly read "nothing to scroll".
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const cardStep = () => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>("[data-gallery-card]");
    return card ? card.offsetWidth + GAP_PX : 0;
  };

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return; // not laid out yet
    const max = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < max - 4);
    const step = cardStep();
    if (step > 0) {
      // Dots show how far along the row you are: first dot at the start,
      // last dot at the end, the middle ones in between.
      const progress = max > 0 ? el.scrollLeft / max : 0;
      setCurrentSlide(Math.round(progress * (DOT_COUNT - 1)));
    }
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    // Re-measure whenever the row gets its real size (after the zoom, on resize).
    const ro = new ResizeObserver(updateState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateState);
      ro.disconnect();
    };
  }, [updateState]);

  const scrollToLeft = (left: number) => {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  };

  // Move by exactly one card so each press lands on the next snap point.
  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = cardStep() || el.clientWidth * 0.8;
    scrollToLeft(el.scrollLeft + direction * step);
  };

  // Dot i scrolls to that share of the row (start, middle, end).
  const scrollToSlide = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    scrollToLeft((index / (DOT_COUNT - 1)) * max);
  };

  const navButton =
    "inline-flex h-10 w-10 items-center justify-center rounded-md text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className="mt-12">
      {USE_GLOW_CARDS && <GlowCardStyles />}
      {/* mb-0 + the track's py-6 keep the old 24px spacing while giving the
          card glow and shadow room so the scroll row does not clip them. */}
      <div className="flex items-end justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {title}
        </h3>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className={navButton}
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            aria-label="Previous image"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            className={navButton}
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            aria-label="Next image"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        className="flex snap-x snap-mandatory overflow-x-auto py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: GAP_PX }}
      >
        {items.map((item) => {
          const card = (
            <div className="group relative aspect-[4/3] h-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(10,10,10,0),rgba(10,10,10,0.45),rgba(10,10,10,0.9)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-4 text-white md:p-8">
                <div className="mb-1 text-base font-semibold md:mb-3 md:text-xl">
                  {item.title}
                </div>
                <div className="line-clamp-2 text-sm text-neutral-300 md:text-base">
                  {item.description}
                </div>
                {item.href && (
                  <div className="mt-6 flex items-center text-sm">
                    Read more
                    <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </div>
            </div>
          );

          const link = (
            <a
              href={item.href ?? item.image}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.href ? item.title : `Open image: ${item.title}`}
              className="relative block h-full cursor-zoom-in rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-500"
            >
              {card}
            </a>
          );

          return (
            <div
              key={item.id}
              data-gallery-card
              role="group"
              aria-roledescription="slide"
              className="w-[85vw] max-w-[320px] shrink-0 snap-start lg:w-[360px] lg:max-w-none"
            >
              {/* Spotlight glow frame around the card (follows the pointer).
                  Clicking a card opens its picture on its own in a new tab
                  (or the card's own href, if it has one). */}
              {USE_GLOW_CARDS ? (
                <GlowCard customSize glowColor="blue" className="h-full p-2">
                  {link}
                </GlowCard>
              ) : (
                link
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-center gap-2">
        {Array.from({ length: DOT_COUNT }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollToSlide(index)}
            aria-label={`Go to part ${index + 1} of ${DOT_COUNT}`}
            aria-current={currentSlide === index}
            className={`h-2 w-2 rounded-full transition-colors ${
              currentSlide === index ? "bg-white" : "bg-neutral-700 hover:bg-neutral-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
