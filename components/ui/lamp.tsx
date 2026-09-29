"use client";
/**
 * Lamp heading: adapted from Aceternity UI's Lamp component.
 *
 * Changes vs original:
 * - Light only comes out of the bar: it shines straight down and is clipped
 *   at the bar, so nothing glows above it or past its ends.
 * - No solid background masks (the original paints bg-slate-950 blocks over
 *   the glow). Fading uses CSS mask-image, so the site's dotted black
 *   background stays visible through the light.
 * - Sized as a compact section heading rather than a full-screen hero.
 * - White gradient heading text instead of slate.
 * - Uses framer-motion (already installed) and replays every time it
 *   scrolls back into view, like the footer.
 * - Honours "reduce motion": shows the lamp fully lit with no animation.
 */
import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Glow colours (Tailwind cyan-500 / cyan-400).
const CYAN = "#06b6d4";
const CYAN_LIGHT = "#22d3ee";

// Light beam: fades out downwards and towards both ends of the bar. A single
// radial mask (no mask-composite), because iPhone Safari ignored the
// two-layer version and showed the light as a hard-edged box.
const beamMask = {
  maskImage: "radial-gradient(ellipse 50% 100% at 50% 0%, black 35%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 50% 100% at 50% 0%, black 35%, transparent 100%)",
};

// Full bar width in rem on desktop; phones scale everything down to fit.
const BAR_REM = 30;

export function LampHeading({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const viewport = { once: false, amount: 0.4 };
  const transition = { delay: 0.3, duration: 0.8, ease: "easeInOut" } as const;

  // Scale factor so the bar (and its glow) never runs past a phone screen.
  const [k, setK] = useState(1);
  useEffect(() => {
    const fit = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      setK(Math.min(1, (window.innerWidth - 48) / (BAR_REM * rem)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Collapsed -> lit width (in rem, scaled by k), unless reduced motion is on.
  const grow = (fromRem: number, toRem: number) => {
    const from = `${(fromRem * k).toFixed(2)}rem`;
    const to = `${(toRem * k).toFixed(2)}rem`;
    return reduceMotion
      ? { initial: false as const, animate: { width: to } }
      : {
          initial: { width: from, opacity: 0.5 },
          whileInView: { width: to, opacity: 1 },
          viewport,
          transition,
        };
  };

  return (
    <div className="relative isolate flex w-full flex-col items-center">
      {/* The lamp bar */}
      <motion.div
        {...grow(15, BAR_REM)}
        className="relative z-20 h-0.5"
        style={{ backgroundColor: CYAN_LIGHT }}
      />

      {/* Light: starts at the bar and is clipped there, so it only shines
          downwards. clip-path cuts the top edge only; the old overflow-hidden
          also cut the sides, which on a phone gave the glow hard edges. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0.5 flex h-48 justify-center"
        style={{ clipPath: "inset(0 -100vw -100vw -100vw)" }}
      >
        <motion.div
          {...grow(15, BAR_REM)}
          className="h-full shrink-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${CYAN}66, transparent)`,
            ...beamMask,
          }}
        />
        <motion.div
          {...grow(12, 24)}
          className="absolute -top-16 h-28 rounded-full opacity-40 blur-3xl"
          style={{ backgroundColor: CYAN }}
        />
        <motion.div
          {...grow(7, 14)}
          className="absolute -top-12 h-20 rounded-full opacity-70 blur-2xl"
          style={{ backgroundColor: CYAN_LIGHT }}
        />
      </div>

      {/* Heading text, centred under the lamp */}
      <motion.h2
        initial={reduceMotion ? false : { opacity: 0.5, y: 40 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={viewport}
        transition={transition}
        className="relative z-10 mt-10 bg-clip-text pb-2 text-center text-4xl font-bold tracking-tight text-transparent md:text-7xl"
        style={{
          backgroundImage: "linear-gradient(to bottom, #ffffff, #b3b3b3)",
        }}
      >
        {children}
      </motion.h2>
    </div>
  );
}
