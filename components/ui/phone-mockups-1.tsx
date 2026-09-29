import { type ImageItem, PhoneCarousel } from "@/components/ui/phone-mockups-1-utils/phone-carousel";

export type { ImageItem };

/** Phone mockup showing a project's app screens (see phoneScreens in lib/projects.ts). */
export default function PhoneMockupBasic({
  images,
  className,
}: {
  images: ImageItem[];
  className?: string;
}) {
  return <PhoneCarousel images={images} className={className} />;
}
