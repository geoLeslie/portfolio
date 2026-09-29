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
import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// Glow colours (Tailwind cyan-500 / cyan-400).
const CYAN = "#06b6d4";
const CYAN_LIGHT = "#22d3ee";

// Light beam: fades out downwards and towards both ends of the bar.
const beamMask = {
  maskImage:
    "linear-gradient(to bottom, black, transparent 85%), linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to bottom, black, transparent 85%), linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

export function LampHeading({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const viewport = { once: false, amount: 0.4 };
  const transition = { delay: 0.3, duration: 0.8, ease: "easeInOut" } as const;

  // Collapsed -> lit width, unless reduced motion is on.
  const grow = (from: string, to: string) =>
    reduceMotion
      ? { initial: false as const, animate: { width: to } }
      : {
          initial: { width: from, opacity: 0.5 },
          whileInView: { width: to, opacity: 1 },
          viewport,
          transition,
        };

  return (
    <div className="relative isolate flex w-full flex-col items-center">
      {/* The lamp bar */}
      <motion.div
        {...grow("15rem", "30rem")}
        className="relative z-20 h-0.5"
        style={{ backgroundColor: CYAN_LIGHT }}
      />

      {/* Light: starts at the bar and is clipped there (overflow-hidden),
          so it only shines downwards out of the bar. */}
      <div className="pointer-events-none absolute inset-x-0 top-0.5 flex h-48 justify-center overflow-hidden">
        <motion.div
          {...grow("15rem", "30rem")}
          className="h-full"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${CYAN}66, transparent)`,
            ...beamMask,
          }}
        />
        <motion.div
          {...grow("12rem", "24rem")}
          className="absolute -top-16 h-28 rounded-full opacity-40 blur-3xl"
          style={{ backgroundColor: CYAN }}
        />
        <motion.div
          {...grow("7rem", "14rem")}
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
