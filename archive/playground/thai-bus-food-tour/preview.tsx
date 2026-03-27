import type { StorySlide } from "@/components/preview/story-carousel";
import dynamic from "next/dynamic";

export const frame = { aspectRatio: "16/9" };

const StoryCarousel = dynamic(() => import("@/components/preview/story-carousel"));

const slides: StorySlide[] = [
  {
    kind: "video",
    src: "https://pasgu7dzhuxgk8ea.public.blob.vercel-storage.com/about_opt.mp4",
    position: "bottom center",
  },
  {
    kind: "video",
    src: "https://pasgu7dzhuxgk8ea.public.blob.vercel-storage.com/accordion_opt.mp4",
  },
  { kind: "video", src: "https://pasgu7dzhuxgk8ea.public.blob.vercel-storage.com/explore_opt.mp4" },
  { kind: "video", src: "https://pasgu7dzhuxgk8ea.public.blob.vercel-storage.com/buttons_opt.mp4" },
  {
    kind: "video",
    src: "https://pasgu7dzhuxgk8ea.public.blob.vercel-storage.com/testimonials_opt.mp4",
  },
];

export default function Preview() {
  return <StoryCarousel slides={slides} />;
}
