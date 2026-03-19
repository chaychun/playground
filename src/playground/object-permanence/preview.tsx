import dynamic from "next/dynamic";

export const frame = { aspectRatio: "16/9" };

const StoryCarousel = dynamic(() => import("./carousel"));

export default function Preview() {
  return <StoryCarousel />;
}
