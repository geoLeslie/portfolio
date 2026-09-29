import type { Project } from "@/lib/projects";
import { Gallery4 } from "@/components/ui/gallery4";
import PhoneMockupBasic from "@/components/ui/phone-mockups-1";

// Placeholder detail layout: the target for card clicks. Will be redesigned
// once the hero is approved.
export function ProjectDetails({ projects }: { projects: Project[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-40 space-y-32">
      {projects.map((p) => (
        <article key={p.slug} id={p.slug} className="scroll-mt-24">
          <div
            className={
              p.phoneScreens?.length
                ? "lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16"
                : ""
            }
          >
          <div className="min-w-0">
          <div className="flex items-center gap-3 text-sm text-neutral-400">
            <span>{p.category}</span>
            {p.badge && (
              <span className="rounded-full border border-neutral-700 px-3 py-1 text-neutral-200">
                {p.badge}
              </span>
            )}
          </div>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white">
            {p.title}
          </h2>
          <p className="mt-4 max-w-3xl text-lg md:text-xl text-neutral-300">
            {p.oneLiner}
          </p>

          <dl className="mt-10 grid gap-8 md:grid-cols-2 text-neutral-300">
            {[
              ["Problem", p.problem],
              ["Approach", p.approach],
              ["Result", p.result],
              ["My role", p.role],
            ].map(([term, desc]) => (
              <div key={term}>
                <dt className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  {term}
                </dt>
                <dd className="mt-2">{desc}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {p.stack.map((s) => (
              <span
                key={s}
                className="rounded-md bg-neutral-900 px-3 py-1 text-sm text-neutral-300"
              >
                {s}
              </span>
            ))}
            {p.links?.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${i === 0 ? "ml-auto" : ""} rounded-lg px-4 py-2 font-semibold text-white transition-colors hover:bg-neutral-800`}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
          </div>

          {/* Phone mockup with app screens: to the right of the text on wide
              screens. Below 1024px it sits in its own block under the text,
              clipped to the screen, so it can never widen the text column. */}
          {p.phoneScreens && p.phoneScreens.length > 0 && (
            <div className="mt-16 flex justify-center overflow-hidden lg:mt-0 lg:block lg:overflow-visible">
              <PhoneMockupBasic images={p.phoneScreens} className="lg:translate-y-[50px]" />
            </div>
          )}
          </div>

          {p.gallery && p.gallery.length > 0 && (
            <Gallery4 title="Gallery" items={p.gallery} />
          )}
        </article>
      ))}
    </section>
  );
}
