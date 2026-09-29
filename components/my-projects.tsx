/**
 * PART 2: MY PROJECTS
 * Hero Parallax card row + About Me + project detail sections.
 */
import { HeroParallax } from "@/components/ui/hero-parallax";
import { ProjectDetails } from "@/components/project-details";
import { projects } from "@/lib/projects";

export function MyProjects() {
  const cards = projects.map((p) => ({
    title: p.title,
    link: `#${p.slug}`,
    thumbnail: p.thumbnail,
  }));

  return (
    <div id="projects">
      <HeroParallax
        products={cards}
        title={
          <>
            Projects so far, <br /> more in progress.
          </>
        }
        subtitle="I'm Geoffrey Leslie, a Computer Science student at BINUS University working across machine learning, data analysis, and UI/UX research. Paper accepted at ICISS 2026, pending upload."
        about={
          <>
            <p>
              I&apos;m a Computer Science student at BINUS University with a
              strong interest in data analytics and machine learning. My
              interest grew from wanting to turn raw data and half-formed ideas
              into things that actually work: models that predict accurately,
              and interfaces people find genuinely usable.
            </p>
            <p>
              I enjoy work that combines technical rigor with real user
              understanding, from tuning ML models to running user interviews
              that ground a design in real needs. I&apos;m looking for hands-on
              experience to keep growing across engineering, machine learning,
              and design.
            </p>
          </>
        }
        workTitle="Selected Work"
      />
      <ProjectDetails projects={projects} />
    </div>
  );
}
