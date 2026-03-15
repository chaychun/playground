import dynamic from "next/dynamic";

export const frame = { minHeight: 440 };

const PolaroidCarousel = dynamic(() => import("./component"));

export default function Preview() {
  return <PolaroidCarousel />;
}
