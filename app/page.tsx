import { Landing } from "@/components/landing";
import { MyProjects } from "@/components/my-projects";
import { Footer } from "@/components/ui/footer-section";

// The site is split into two parts so each can be tweaked on its own:
//   Part 1: Landing page  -> components/landing.tsx
//   Part 2: My Projects   -> components/my-projects.tsx
//   Footer                -> components/ui/footer-section.tsx
// Part 2 sits inside Part 1, so zooming through the word lands on it directly.
// The footer follows the projects inside the same zoom content.
// id="top" is the target of the footer's "Back to top" link.
export default function Home() {
  return (
    <main id="top" className="w-full overflow-x-clip">
      <Landing>
        <MyProjects />
        <Footer />
      </Landing>
    </main>
  );
}
