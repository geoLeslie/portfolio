"use client";
/**
 * Hero Parallax: adapted from Aceternity UI (21st.dev).
 * Original: taste/interactions/hero-parallax.md
 *
 * Changes vs original:
 * - One row of 5 cards (original: 3 rows x 5).
 * - Row starts centred (middle card in the middle). Once flat it drifts slowly
 *   left/right on its own, pauses on hover, and pauses for 8 seconds after the
 *   user presses Previous / Next (which move it one card at a time).
 * - Clicking a card smooth-scrolls to that project's detail section (#slug).
 * - Horizontal scroll slide only runs during the tilt and rests at 0 when flat.
 * - Tilted row starts lower (START_Y -600 vs the original -700).
 * - Section is as tall as its content (original: fixed 300vh, which left a
 *   large empty gap below the cards). The tilt runs over a 30vh scroll marker.
 * Spring config is unchanged.
 */
import React from "react";
import {
  motion,
  animate,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LampHeading } from "@/components/ui/lamp";

type Product = {
  title: string;
  link: string; // "#slug" anchor to the project detail section
  thumbnail: string;
};

const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

export const HeroParallax = ({
  products,
  title,
  subtitle,
  about,
  workTitle,
}: {
  products: Product[];
  title: React.ReactNode;
  subtitle: React.ReactNode;
  about?: React.ReactNode;
  workTitle?: React.ReactNode;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLDivElement>(null);

  // The tilt is driven by an invisible marker at the top of the section whose
  // height is the scroll distance over which the cards flatten. This lets the
  // section itself be only as tall as its content (no empty space below).
  // FLATTEN_DISTANCE: 30vh ≈ 30% of one screen height of scrolling.
  const FLATTEN_DISTANCE = "30vh";
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Progress at which the cards are fully flat (end of the marker).
  const FLAT_AT = 1;

  // Small leftward slide during the tilt only (100px = the original's slide
  // over the same stretch of scroll). Rests at 0 once flat.
  const entranceX = useSpring(
    useTransform(scrollYProgress, [0, FLAT_AT], [100, 0]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, FLAT_AT], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, FLAT_AT], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, FLAT_AT], [20, 0]),
    springConfig
  );
  // Final resting offset (px) of the flat card row below the header text.
  // Original component used 500; lower = closer to the About Me text.
  const FLAT_Y = 0;
  // Starting offset (px) of the tilted row, relative to its flat position
  // area. Original component used -700 (cards up over the header text);
  // less negative = cards start lower on the screen.
  const START_Y = -600;

  const translateY = useSpring(
    useTransform(scrollYProgress, [0, FLAT_AT], [START_Y, FLAT_Y]),
    springConfig
  );

  // Auto-drift speed once the cards are flat (px per second). Slow on purpose.
  const AUTO_SPEED = 30;

  // Horizontal row position: centred at the top, auto-drifts when flat,
  // moved by Previous/Next. Final x = entrance slide + this.
  const posX = useMotionValue(0);
  const rowX = useTransform(
    [entranceX, posX],
    ([a, b]: number[]) => a + b
  );

  // Measured layout: min = row's last card flush with the right edge,
  // 0 = first card flush with the left edge, center = middle card centred.
  const bounds = React.useRef({ min: 0, center: 0, step: 0 });
  const autoplay = React.useRef(true); // false while paused after Previous/Next
  // How long the drift stays paused after Previous/Next (ms).
  const RESUME_AFTER_MS = 8000;
  const resumeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    []
  );
  const hovered = React.useRef(false);
  const direction = React.useRef(-1); // -1 = drifting left, 1 = right
  const navAnim = React.useRef<ReturnType<typeof animate> | null>(null);
  const reduceMotion = useReducedMotion();
  const [edges, setEdges] = React.useState({ atStart: false, atEnd: false });

  const measure = React.useCallback(() => {
    const row = rowRef.current;
    if (!row || row.children.length === 0) return;
    const cards = row.children as HTMLCollectionOf<HTMLElement>;
    const first = cards[0];
    const last = cards[cards.length - 1];
    const rowWidth = last.offsetLeft + last.offsetWidth - first.offsetLeft;
    const min = Math.min(0, row.clientWidth - rowWidth);
    bounds.current = {
      min,
      center: min / 2,
      step: cards.length > 1 ? cards[1].offsetLeft - first.offsetLeft : 0,
    };
  }, []);

  React.useLayoutEffect(() => {
    measure();
    posX.set(bounds.current.center);
    const onResize = () => {
      measure();
      const { min, center } = bounds.current;
      if (autoplay.current && scrollYProgress.get() < FLAT_AT) {
        posX.set(center);
      } else {
        posX.set(Math.max(min, Math.min(0, posX.get())));
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure, posX, scrollYProgress]);

  // Keep Previous/Next disabled state in sync with the actual position.
  useMotionValueEvent(posX, "change", (x) => {
    const atStart = x >= -1;
    const atEnd = x <= bounds.current.min + 1;
    setEdges((prev) =>
      prev.atStart === atStart && prev.atEnd === atEnd
        ? prev
        : { atStart, atEnd }
    );
  });

  useAnimationFrame((_, rawDelta) => {
    if (!autoplay.current || reduceMotion) return;
    const delta = Math.min(rawDelta, 50) / 1000; // avoid jumps after tab switch
    const { min, center } = bounds.current;
    const x = posX.get();

    // Still tilting (top of page): ease back to the centred position.
    if (scrollYProgress.get() < FLAT_AT) {
      if (Math.abs(x - center) > 0.5) {
        posX.set(x + (center - x) * Math.min(1, delta * 4));
      }
      return;
    }

    // Flat: drift slowly, bounce between the two ends, pause on hover.
    if (hovered.current) return;
    let next = x + direction.current * AUTO_SPEED * delta;
    if (next <= min) {
      next = min;
      direction.current = 1;
    } else if (next >= 0) {
      next = 0;
      direction.current = -1;
    }
    posX.set(next);
  });

  // Previous/Next: pause the auto-drift, then spring one card over from
  // wherever the row currently is. The drift resumes RESUME_AFTER_MS after
  // the last press (each press restarts the countdown).
  const nudge = (dir: -1 | 1) => {
    autoplay.current = false;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      autoplay.current = true;
      resumeTimer.current = null;
    }, RESUME_AFTER_MS);
    const { min, step } = bounds.current;
    if (!step) return;
    const index = Math.round(-posX.get() / step) + dir;
    const target = Math.max(min, Math.min(0, -index * step));
    navAnim.current?.stop();
    navAnim.current = animate(posX, target, {
      type: "spring",
      stiffness: springConfig.stiffness,
      damping: springConfig.damping,
    });
  };

  return (
    <div className="pt-40 pb-16 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]">
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 w-px"
        style={{ height: FLATTEN_DISTANCE }}
      />
      <Header
        title={title}
        subtitle={subtitle}
        about={about}
        workTitle={workTitle}
      />
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <div className="max-w-7xl mx-auto w-full px-4">
          <div
            ref={rowRef}
            className="flex flex-row gap-20"
            onMouseEnter={() => (hovered.current = true)}
            onMouseLeave={() => (hovered.current = false)}
            onFocus={() => (hovered.current = true)}
            onBlur={() => (hovered.current = false)}
          >
            {products.map((product) => (
              <ProductCard
                product={product}
                translate={rowX}
                key={product.title}
              />
            ))}
          </div>

          <div className="mt-16 flex items-center justify-between">
            <NavButton
              onClick={() => nudge(-1)}
              disabled={edges.atStart}
              label="Previous project"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
              Previous
            </NavButton>
            <NavButton
              onClick={() => nudge(1)}
              disabled={edges.atEnd}
              label="Next project"
            >
              Next
              <ArrowRight className="size-5" aria-hidden="true" />
            </NavButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Header = ({
  title,
  subtitle,
  about,
  workTitle,
}: {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  about?: React.ReactNode;
  workTitle?: React.ReactNode;
}) => {
  return (
    <div className="max-w-7xl relative mx-auto pt-20 pb-10 md:pt-40 md:pb-16 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-white">{title}</h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-200">
        {subtitle}
      </p>
      {about && (
        <div
          id="about"
          className="max-w-2xl mt-6 space-y-4 text-base leading-relaxed text-neutral-400"
        >
          {about}
        </div>
      )}
      {workTitle && (
        <div id="selected-work" className="mt-24">
          <LampHeading>{workTitle}</LampHeading>
        </div>
      )}
    </div>
  );
};

const NavButton = ({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="inline-flex items-center gap-3 rounded-lg px-5 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
  >
    {children}
  </button>
);

export const ProductCard = ({
  product,
  translate,
}: {
  product: Product;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="group/product aspect-video w-[30rem] relative flex-shrink-0"
    >
      <a
        href={product.link}
        aria-label={`View ${product.title} details`}
        className="block group-hover/product:shadow-2xl"
      >
        <Image
          src={product.thumbnail}
          width={1920}
          height={1080}
          sizes="480px"
          unoptimized={product.thumbnail.endsWith(".svg")}
          className="object-cover absolute h-full w-full inset-0 rounded-lg"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full rounded-lg opacity-0 group-hover/product:opacity-40 bg-black pointer-events-none"></div>
    </motion.div>
  );
};
