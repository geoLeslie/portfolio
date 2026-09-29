/**
 * Social icon dock for the landing page (top left).
 * A dark pill of icons: on hover or keyboard focus an icon turns white, gets
 * a darker rounded square behind it, and shows a white label bubble above.
 */
import type { ComponentType, SVGProps } from "react";
import { Instagram, Linkedin, Mail } from "lucide-react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

/** lucide has no WhatsApp logo: a chat bubble with a phone inside, in lucide's stroke style. */
function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <g transform="translate(7.6 7.6) scale(0.37)" strokeWidth={4.4}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </g>
    </svg>
  );
}

interface SocialLink {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

// Link formats, for future edits:
//   Email:     "mailto:you@example.com"
//   WhatsApp:  "https://wa.me/62XXXXXXXXXX" (country code, no + or spaces)
const SOCIAL_LINKS: SocialLink[] = [
  { label: "Email", href: "mailto:geoffreylesliee06@gmail.com", icon: Mail },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/geoffrey-leslie-4a785532a/", icon: Linkedin },
  { label: "WhatsApp", href: "https://wa.me/6285159008806", icon: WhatsAppIcon },
  { label: "Instagram", href: "https://www.instagram.com/geoffreyleslie_/", icon: Instagram },
];

export function SocialDock({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Contact and social links" className={className}>
      <ul className="flex items-center gap-1">
        {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => {
          const external = href.startsWith("http");
          return (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group relative grid size-11 place-items-center rounded-xl text-[#0a0a0a] transition-colors duration-200 hover:bg-[#1f1f1f] hover:text-white focus-visible:bg-[#1f1f1f] focus-visible:text-white focus-visible:outline-none"
              >
                <Icon className="size-5" />
                {/* Label bubble above the icon */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-[13px] font-medium leading-none text-[#0a0a0a] opacity-0 shadow-sm transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                >
                  {label}
                  <span className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-white" />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
