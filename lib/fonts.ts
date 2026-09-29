import { Plus_Jakarta_Sans } from "next/font/google";

// Display face for the landing page (same family the Glyph Portal demo uses).
// Self-hosted by next/font, so no request goes to Google from the visitor.
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});
