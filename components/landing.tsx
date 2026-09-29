"use client";
/**
 * PART 1: LANDING PAGE
 * Glyph Portal (21st.dev, MIT) with the word as a window into a dotted black
 * field. Scrolling zooms through a letter until the field fills the screen;
 * the field is the same #0a0a0a as Part 2 (My Projects), so the zoom lands
 * seamlessly on the projects page.
 *
 * Edit the text in the COPY object below.
 */
import { useEffect, useState, type ReactNode } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import { SocialDock } from "@/components/ui/social-dock";
import { FileTextIcon } from "lucide-react";
import { jakarta } from "@/lib/fonts";

const COPY = {
  word: "PORTFOLIO", // the big word you zoom through
  category: "Data · ML · Design",
  eyebrow: "Curiosity turns into skill, and skill turns into impact",
  support: "Geoffrey Leslie",
  cv: "Download CV",
  enter: "See my work",
  scrollHint: "Scroll to enter ↓",
};

// Colours taken from Part 2 so both parts feel like one page.
const COLORS = {
  paper: "#ffffff", // landing background around the word (Part 2 text colour)
  ink: "#0a0a0a", // text on the landing
  field: "#0a0a0a", // inside the letters = Part 2 background
  foreground: "#ffffff", // text after the zoom
};

const FALLBACK = "Arial, sans-serif";

// Enter button: how many pixels per SECOND the page scrolls while it glides
// into the projects. 1152 = the old 8px per frame on a 144Hz screen, the pace
// it was tuned on. Time-based, so every screen (60Hz, 120Hz, 144Hz) and a
// busy computer get the same zoom duration. Lower = slower.
const ENTER_SCROLL_SPEED = 1152;
const STOP_EVENTS = ["wheel", "touchstart", "keydown", "mousedown"] as const;

/**
 * Dotted black background (fills the letters, then the whole screen).
 * Uses the same .dot-field pattern as the projects page (app/globals.css),
 * so when the zoom finishes the two are pixel identical.
 */
function DotField() {
  return <div className="dot-field" style={{ position: "absolute", inset: 0 }} />;
}

/**
 * The portal shows its content (and drops the letter mask) whenever focus is
 * inside it. The Enter button and mouse clicks on cards or Previous/Next
 * leave focus there, so scrolling back up showed a blank dotted screen
 * instead of zooming back out to the word. Release that focus once the
 * zoom is no longer complete. Keyboard focus (:focus-visible) on a control
 * is kept, so tabbing through the page still works.
 */
function releaseFocus(progress: number) {
  if (progress >= 0.9) return;
  const el = document.activeElement as HTMLElement | null;
  const content = el?.closest("[data-gp-content]");
  if (!el || !content) return;
  if (el === content || !el.matches(":focus-visible")) el.blur();
}

/** Part 1 wraps Part 2: the zoom opens straight onto the projects page. */
export function Landing({ children }: { children: ReactNode }) {
  // The portal measures the font once on mount, so wait for it to load.
  const family = jakarta.style.fontFamily;
  const [face, setFace] = useState<string | null>(null);

  useEffect(() => {
    let settled = false;
    const finish = (value: string) => {
      if (!settled) {
        settled = true;
        setFace(value);
      }
    };
    const timeout = window.setTimeout(() => finish(FALLBACK), 1600);
    document.fonts
      .load(`800 100px ${family}`, COPY.word)
      .then(() => finish(`${family}, ${FALLBACK}`), () => finish(FALLBACK));
    return () => {
      settled = true;
      clearTimeout(timeout);
    };
  }, [family]);

  // Enter button: instead of jumping, scroll the page down a few pixels each
  // frame, exactly like a slow manual scroll, so the zoom plays at that pace.
  // No timer: the zoom is still driven purely by the scroll position.
  useEffect(() => {
    if (!face) return;
    const enter = document.querySelector<HTMLAnchorElement>("[data-landing] [data-gp-enter]");
    const content = document.querySelector<HTMLElement>("[data-landing] [data-gp-content]");
    if (!enter || !content) return;

    let raf = 0;
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      STOP_EVENTS.forEach((e) => window.removeEventListener(e, stop));
    };

    const onClick = (event: MouseEvent) => {
      // Keeps focus out of the projects (focus there caused the black flash).
      event.preventDefault();
      enter.blur();
      stop();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        content.scrollIntoView();
        return;
      }
      // Position comes from the time since the click (not a step per frame),
      // so the pace is identical on every refresh rate and never accumulates
      // rounding errors. On a 144Hz screen this is exactly 8px per frame.
      const startY = window.scrollY;
      let startTime = 0;
      const step = (now: number) => {
        if (!startTime) startTime = now;
        const remaining = content.getBoundingClientRect().top;
        if (remaining <= 1) return stop();
        const target = startY + (ENTER_SCROLL_SPEED * (now - startTime)) / 1000;
        const next = Math.min(target, window.scrollY + remaining);
        if (next > window.scrollY) window.scrollTo({ top: next, behavior: "instant" });
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      // The visitor scrolling, touching, pressing a key or clicking takes over.
      STOP_EVENTS.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    };

    enter.addEventListener("click", onClick);
    return () => {
      enter.removeEventListener("click", onClick);
      stop();
    };
  }, [face]);

  // "Back to top" (footer): instead of jumping straight to the landing page,
  // which skipped the zoom and flashed black on phones, glide up in two parts:
  // a quick eased scroll through the projects, then the zoom back out to the
  // word at the same pace as the Enter glide.
  useEffect(() => {
    if (!face) return;
    const content = document.querySelector<HTMLElement>("[data-landing] [data-gp-content]");
    if (!content) return;

    let raf = 0;
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      STOP_EVENTS.forEach((e) => window.removeEventListener(e, stop));
    };
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href="#top"]');
      if (!link) return;
      event.preventDefault();
      link.blur();
      stop();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
      // Scroll position where the zoom is complete (the top of the projects).
      const zoomEnd = Math.max(0, window.scrollY + content.getBoundingClientRect().top);
      const startY = window.scrollY;
      const firstLeg = Math.max(0, startY - zoomEnd);
      const firstMs = firstLeg ? Math.min(1200, Math.max(500, firstLeg * 0.25)) : 0;
      let startTime = 0;
      const step = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        let next: number;
        if (elapsed < firstMs) {
          next = startY - firstLeg * ease(elapsed / firstMs);
        } else {
          next = Math.min(startY, zoomEnd) - (ENTER_SCROLL_SPEED * (elapsed - firstMs)) / 1000;
        }
        next = Math.max(0, next);
        window.scrollTo({ top: next, behavior: "instant" });
        if (next <= 0) return stop();
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      STOP_EVENTS.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      stop();
    };
  }, [face]);

  if (!face) {
    return (
      <div
        role="status"
        className="grid h-svh place-items-center text-xs"
        style={{ background: COLORS.paper, color: "#737373" }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div data-landing style={{ fontFamily: face }}>
      <style>{`
        [data-landing] [data-gp-caption]{inset:calc(var(--gp-word-bottom,50%) + 124px) 24px auto;justify-content:center;}
        [data-landing] [data-gp-hint]{display:none;}
        [data-landing] [data-gp-enter]{min-height:46px;padding:0 20px;gap:24px;background:${COLORS.ink};border-radius:10px;color:#fff;font-size:14px;font-weight:600;transition:background .2s;}
        [data-landing] [data-gp-enter]:hover{background:#262626;}
        [data-landing] [data-gp-enter]:focus-visible{outline:2px solid #737373;outline-offset:4px;}
        [data-landing] [data-gp-touch-picker]{top:auto;bottom:calc(18px + 100lvh - 100svh);}
        [data-landing] [data-gp-select]{border-color:transparent;border-radius:8px;font-size:12px;color:#525252;}
        [data-landing-header]{position:absolute;inset:clamp(44px,4.5cqw,56px) clamp(24px,5cqw,64px) auto;display:flex;align-items:center;justify-content:space-between;gap:20px;}
        [data-landing-category]{font-size:12px;line-height:1.5;color:#737373;}
        [data-landing-eyebrow]{position:absolute;inset:auto 24px calc(100% - var(--gp-word-top,35%) + 32px);margin:0;text-align:center;font-size:13px;line-height:1.5;color:#737373;}
        [data-landing-support]{position:absolute;inset:calc(var(--gp-word-bottom,50%) + 32px) 24px auto;margin:0;text-align:center;font-size:16px;line-height:1.5;color:#525252;}
        /* Download CV link under the name, same look as the footer's (icon + text), in the landing's greys. */
        [data-landing-cv]{position:absolute;top:calc(var(--gp-word-bottom,50%) + 72px);left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 8px;border-radius:8px;font-size:14px;line-height:1;color:#737373;text-decoration:none;white-space:nowrap;transition:color .3s;}
        [data-landing-cv]:hover{color:#0a0a0a;}
        [data-landing-cv]:focus-visible{outline:2px solid #737373;outline-offset:2px;}
        [data-landing-scroll]{position:absolute;inset:auto 24px 7%;text-align:center;color:#a3a3a3;font-size:11px;letter-spacing:.02em;}
        /* The landing is sized to the tall viewport (100lvh), so keep bottom
           items above iPhone Safari's bar: add the gap between tall and short. */
        @media(any-pointer:coarse){[data-landing-scroll]{bottom:calc(13% + 100lvh - 100svh);}}
        @container(max-height:479px){[data-landing-scroll]{display:none;}}
        /* Part 2 is the portal's content: no padding, no box of its own, on the page's dots. */
        [data-landing] [data-gp-content]{display:block;padding:0;background:transparent!important;overflow-wrap:normal;font-family:inherit;}
        /* Reveal animation (from the 21st.dev demo): the projects page fades in as
           the zoom ends; it also rises into place. */
        [data-landing] [data-gp-motion=on] [data-gp-content]{transform:translateY(calc((1 - var(--gp-reveal,1)) * 64px));}
        /* Once the zoom has filled the screen, hand off to the fixed page dots
           (identical pattern), so the field never scrolls away as a separate layer. */
        [data-landing] section[data-gp-entered=true]{background:transparent;}
        [data-landing] [data-gp-entered=true] [data-gp-field]{visibility:hidden;}
        [data-landing] section,[data-landing] [data-gp-caption]{font-family:inherit;}
      `}</style>
      <GlyphPortal
        word={COPY.word}
        fontFamily={face}
        fontWeight={800}
        scrollLength={2.4}
        interactive
        enterLabel={COPY.enter}
        onProgress={releaseFocus}
        background={<DotField />}
        style={{
          fontFamily: face,
          "--gp-paper": COLORS.paper,
          "--gp-ink": COLORS.ink,
          "--gp-field": COLORS.field,
          "--gp-foreground": COLORS.foreground,
        }}
        front={
          <>
            <div data-landing-header>
              <SocialDock />
              <span data-landing-category>{COPY.category}</span>
            </div>
            <p data-landing-eyebrow>{COPY.eyebrow}</p>
            <p data-landing-support>{COPY.support}</p>
            {/* Same file and saved name as the footer's Download CV link. */}
            <a data-landing-cv href="/cv.pdf" download="Geoffrey_Leslie_CV.pdf">
              <FileTextIcon aria-hidden="true" className="size-4" />
              {COPY.cv}
            </a>
            <span data-landing-scroll>{COPY.scrollHint}</span>
          </>
        }
      >
        {children}
      </GlyphPortal>
    </div>
  );
}
