import StoryCarousel from "@/components/preview/story-carousel";
import type { StorySlide } from "@/components/preview/story-carousel";

import imgFooter from "./assets/footer.png";
import imgHero from "./assets/hero.png";
import imgLaptop from "./assets/laptop-mockup.jpg";
import imgProcess from "./assets/process.png";
import imgSculptor from "./assets/sculptor.png";
import imgWorks from "./assets/selected-works.png";

const slides: StorySlide[] = [
  { kind: "image", src: imgHero },
  {
    kind: "video",
    src: "https://media.contra.com/video/upload/fl_progressive/q_auto:best,w_1600/gkfj774lqahjf670asum.mp4",
  },
  { kind: "image", src: imgLaptop },
  { kind: "image", src: imgWorks },
  { kind: "image", src: imgSculptor },
  { kind: "image", src: imgProcess },
  {
    kind: "video",
    src: "https://media.contra.com/video/upload/fl_progressive/q_auto:best,w_1900/zb9utqk25axlv1w4hly4.mp4",
  },
  { kind: "image", src: imgFooter },
];

export default function ObjectPermanenceCarousel() {
  return <StoryCarousel slides={slides} />;
}
