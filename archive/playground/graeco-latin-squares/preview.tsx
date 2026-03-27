import dynamic from "next/dynamic";

import img2 from "./graeco-latin-4x4-2.png";
import img3 from "./graeco-latin-4x4-3.png";
import img4 from "./graeco-latin-4x4-4.png";
import img5 from "./graeco-latin-4x4-5.png";
import img6 from "./graeco-latin-4x4-6.png";
import img7 from "./graeco-latin-4x4-7.png";
import img8 from "./graeco-latin-4x4-8.png";
import img1 from "./graeco-latin-4x4.png";

export const frame = { aspectRatio: "1/1" };

const ImageCycle = dynamic(() => import("@/components/preview/image-cycle"));

export default function Preview() {
  return (
    <ImageCycle
      images={[img1, img2, img3, img4, img5, img6, img7, img8]}
      interval={0.5}
      position="top left"
    />
  );
}
