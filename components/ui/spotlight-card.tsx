"use client";

// Adapted from 21st.dev "Spotlight Card" (GlowCard): a card whose border and
// background light up around the mouse pointer. Changes from the original:
// - the shared ::before/::after styles are injected once, not once per card;
// - touch-action: none is dropped, so the card does not block swiping a
//   scrollable row (the gallery) on touch screens;
// - the glow is positioned from the card's own corner instead of with
//   background-attachment: fixed, which breaks under transformed parents;
// - with customSize, the default padding, gap and grid rows are left to
//   className, so a caller can wrap existing content edge to edge;
// - inline styles are typed so width/height can be added without TS errors;
// - no backdrop-blur: it was barely visible behind the images but was one of
//   the heaviest effects on the page (one per gallery card).

import React, { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

const beforeAfterStyles = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
  }

  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
    );
    filter: brightness(2);
  }

  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
    );
  }

  [data-glow] [data-glow] {
    position: absolute;
    inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius) * 1px);
    border-width: calc(var(--border-size) * 20);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
    border: none;
  }

  [data-glow] > [data-glow]::before {
    inset: -10px;
    border-width: 10px;
  }
`;

/** Render once on any page that uses GlowCard. */
export function GlowCardStyles() {
  return <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />;
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "blue",
  size = "md",
  width,
  height,
  customSize = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Performance: only cards on screen are updated, at most once per frame.
    // Every card used to measure itself on every mouse move, which forced
    // dozens of layout passes per move across all the galleries.
    let visible = false;
    let raf = 0;
    let x = -9999;
    let y = -9999;

    const paint = () => {
      raf = 0;
      // Pointer position relative to the card (not the viewport): the site's
      // content sits under a CSS transform, where the original's
      // background-attachment: fixed stops tracking the viewport.
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--x", (x - rect.left).toFixed(2));
      el.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
      el.style.setProperty("--y", (y - rect.top).toFixed(2));
      el.style.setProperty("--yp", (y / window.innerHeight).toFixed(2));
    };
    const syncPointer = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (visible && !raf) raf = requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      // Catch up with the pointer as the card comes into view.
      if (visible && !raf) raf = requestAnimationFrame(paint);
    });
    observer.observe(el);

    document.addEventListener("pointermove", syncPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("pointermove", syncPointer);
    };
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  const style = {
    "--base": base,
    "--spread": spread,
    "--radius": "14",
    "--border": "3",
    "--backdrop": "hsl(0 0% 60% / 0.12)",
    "--backup-border": "var(--backdrop)",
    "--size": "200",
    "--outer": "1",
    "--border-size": "calc(var(--border, 2) * 1px)",
    "--spotlight-size": "calc(var(--size, 150) * 1px)",
    "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
    )`,
    backgroundColor: "var(--backdrop, transparent)",
    backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
    backgroundPosition: "50% 50%",
    border: "var(--border-size) solid var(--backup-border)",
    position: "relative",
    ...(width !== undefined && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === "number" ? `${height}px` : height }),
  } as CSSProperties;

  const sizing = customSize ? "" : `${sizeMap[size]} aspect-[3/4] grid-rows-[1fr_auto] p-4 gap-4`;

  return (
    <div
      ref={cardRef}
      data-glow
      style={style}
      className={`relative grid rounded-2xl shadow-[0_1rem_2rem_-1rem_black] ${sizing} ${className}`}
    >
      <div data-glow />
      {children}
    </div>
  );
};

export { GlowCard };
