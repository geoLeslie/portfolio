"use client";

/**
 * Footer section, adapted from the 21st.dev "footer-section" component.
 * Changes from the original:
 * - uses framer-motion (already installed; same API as motion/react)
 * - shadcn colour tokens replaced with the site's own neutrals, since this
 *   project has no shadcn theme variables
 * - generic Product / Company links replaced with the portfolio footer content
 * - adds a closing call to action, copy-email button, local time and back to top
 *
 * All text lives in the FOOTER object below so it is easy to edit.
 */
import React, { useEffect, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpIcon,
  CheckIcon,
  CopyIcon,
  FileTextIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from "lucide-react";

interface FooterLink {
  title: string;
  href?: string; // no href = plain text (e.g. the paper before it has a link)
  icon?: React.ComponentType<{ className?: string }>;
  download?: boolean | string; // string = file name the download saves as
  external?: boolean;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

// Footer content: edit everything here.
const FOOTER = {
  headline: "Have a project or role in mind?",
  supporting:
    "CS student at BINUS, open to internships in data, machine learning and UI/UX. Based in Jakarta, open to remote.",
  email: "geoffreylesliee06@gmail.com",
  name: "Geoffrey Leslie",
  location: "Jakarta, Indonesia",
  timeZone: "Asia/Jakarta",
  timeZoneLabel: "WIB",
};

const footerLinks: FooterSection[] = [
  {
    label: "Navigate",
    links: [
      { title: "Selected work", href: "#projects" },
      { title: "Back to top", href: "#top", icon: ArrowUpIcon },
    ],
  },
  {
    label: "Connect",
    links: [
      { title: "LinkedIn", href: "https://www.linkedin.com/in/geoffrey-leslie-4a785532a/", icon: LinkedinIcon, external: true },
      { title: "GitHub", href: "https://github.com/geoLeslie", icon: GithubIcon, external: true },
      { title: "Email", href: `mailto:${FOOTER.email}`, icon: MailIcon },
    ],
  },
  {
    label: "Resources",
    links: [
      // CV lives at public/cv.pdf; it saves as Geoffrey_Leslie_CV.pdf.
      { title: "Download CV", href: "/cv.pdf", icon: FileTextIcon, download: "Geoffrey_Leslie_CV.pdf" },
      // Not published yet, so no link. Update the wording to match its status.
      { title: "ICISS 2026 paper, coming soon" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mx-auto mt-32 flex w-full max-w-6xl flex-col items-center justify-center rounded-t-4xl border-t border-white/10 bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.08),transparent)] px-6 py-12 text-white md:rounded-t-[3rem] lg:py-16">
      <div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {FOOTER.headline}
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
            {FOOTER.supporting}
          </p>
          <EmailButton email={FOOTER.email} />
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0 xl:justify-items-end">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs text-neutral-500 uppercase tracking-widest">
                  {section.label}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-neutral-400">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      {link.href ? (
                        <a
                          href={link.href}
                          download={link.download || undefined}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center transition-all duration-300 hover:text-white"
                        >
                          {link.icon && <link.icon className="me-1.5 size-4" />}
                          {link.title}
                        </a>
                      ) : (
                        <span className="inline-flex items-center text-neutral-500">
                          {link.title}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <AnimatedContainer
        delay={0.5}
        className="mt-12 flex w-full flex-col gap-2 border-t border-white/10 pt-6 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between"
      >
        <p>
          © {new Date().getFullYear()} {FOOTER.name}
        </p>
        <p>
          {FOOTER.location}
          <LocalTime timeZone={FOOTER.timeZone} label={FOOTER.timeZoneLabel} />
        </p>
      </AnimatedContainer>
    </footer>
  );
}

/** Email as the main button, plus a copy-to-clipboard icon button. */
function EmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context): the mailto link still works.
    }
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={`mailto:${email}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-neutral-900 px-4 text-sm transition-colors hover:bg-neutral-800"
      >
        <MailIcon className="size-4" />
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email copied" : "Copy email address"}
        className="inline-flex size-11 items-center justify-center rounded-lg border border-white/10 bg-neutral-900 transition-colors hover:bg-neutral-800"
      >
        {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </div>
  );
}

/** Local time in Jakarta. Rendered only after mount to avoid a hydration mismatch. */
function LocalTime({ timeZone, label }: { timeZone: string; label: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());
    setTime(format());
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  if (!time) return null;
  return (
    <span>
      {" · "}
      {time} {label}
    </span>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      // once: false resets the fade when the footer leaves view, so it replays on the next scroll down.
      viewport={{ once: false, amount: 0.2 }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
