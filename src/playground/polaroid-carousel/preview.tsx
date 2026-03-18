import dynamic from "next/dynamic";

export const frame = { minHeight: 440 };

const PolaroidCarousel = dynamic(() => import("./polaroid-carousel"));

export default function Preview() {
  return <PolaroidCarousel />;
}
