"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

export default function ImageCycle({
  images,
  interval = 1,
  position,
}: {
  images: (StaticImageData | string)[];
  interval?: number;
  position?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval * 1000);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <Image
      src={images[index]}
      alt=""
      fill
      sizes="(max-width: 744px) 100vw, 680px"
      className="object-cover"
      style={position ? { objectPosition: position } : undefined}
    />
  );
}
