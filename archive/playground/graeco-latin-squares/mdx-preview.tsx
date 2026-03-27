"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import img2 from "./graeco-latin-4x4-2.png";
import img3 from "./graeco-latin-4x4-3.png";
import img4 from "./graeco-latin-4x4-4.png";
import img5 from "./graeco-latin-4x4-5.png";
import img6 from "./graeco-latin-4x4-6.png";
import img7 from "./graeco-latin-4x4-7.png";
import img8 from "./graeco-latin-4x4-8.png";
import img1 from "./graeco-latin-4x4.png";

const images = [img1, img2, img3, img4, img5, img6, img7, img8];

export function MDXPreviewCycle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto my-6 aspect-square w-4/5">
      <Image
        src={images[index]}
        alt="Animated preview of Graeco-Latin squares"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
